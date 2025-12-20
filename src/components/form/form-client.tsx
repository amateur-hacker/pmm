"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  GraduationCap,
  Heart,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import crypto from "node:crypto";

// ---------------- SCHEMAS ----------------
const memberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  mobile: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" }),
  email: z.email({ message: "Invalid email address" }),
  dob: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid date of birth",
  }),
  education: z.string().min(2, { message: "Education information required" }),
  permanentAddress: z
    .string()
    .min(5, { message: "Permanent address must be at least 5 characters" }),
  image: z.string().min(1, { message: "Image is required" }),
  terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms and Conditions",
  }),
});

const donationSchema = z.object({
  amount: z.string().min(1, { message: "Please select a donation amount" }),
});

const generateCustomerId = () => {
  const uniqueId = crypto.randomBytes(16).toString("hex");

  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const customerId = hash.digest("hex");
  return `${customerId.slice(0, 6)}`;
};
export default function FormPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingMember, setExistingMember] = useState(false);
  const [currentStep, setCurrentStep] = useState<"registration" | "donation">(
    "registration",
  );
  const [memberData, setMemberData] = useState<z.infer<
    typeof memberSchema
  > | null>(null);

  // Clear any pending member data when component mounts (in case user navigated back)
  useEffect(() => {
    localStorage.removeItem("pendingMemberData");
  }, []);

  const registrationForm = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      address: "",
      mobile: "",
      email: "",
      dob: "",
      education: "",
      permanentAddress: "",
      image: "",
      terms: false,
    },
  });

  const donationForm = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onRegistrationSubmit = async (data: z.infer<typeof memberSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/check-member?name=${encodeURIComponent(data.name)}`,
      );

      if (!response.ok) throw new Error("Failed to check member existence");

      const { exists } = await response.json();

      if (exists) {
        setExistingMember(true);
        toast.error("Member Already Exists");
        setIsSubmitting(false);
        return;
      }

      // Store member data and move to donation step
      setMemberData(data);
      setCurrentStep("donation");
      setExistingMember(false);
    } catch (_error) {
      toast.error(
        "Something went wrong on our side. Please try again — we really want to get you onboard 🙏",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDonationSubmit = async (data: z.infer<typeof donationSchema>) => {
    if (!memberData) return;

    setIsSubmitting(true);

    const verifyPayment = async (orderId: string) => {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId }),
        });

        const data = await res.json();

        if (data?.order_status) {
          console.log("Payment verified", data);
          alert("Payment verified");
        }
      } catch (error) {
        console.error(error);
      }
    };

    try {
      // Store member data in localStorage for later use after payment success
      localStorage.setItem(
        "pendingMemberData",
        JSON.stringify({
          ...memberData,
          image: memberData.image || null,
          type: "member",
          donated: parseInt(data.amount),
        }),
      );

      // Load Cashfree SDK
      // const cashfree = await load({
      //   mode: "sandbox", // Change to "production" for live
      // });
      let cashfree: any;
      const initializeSDK = async () => {
        cashfree = await load({
          mode: "sandbox",
        });
      };
      initializeSDK();

      const customerId = generateCustomerId();

      // Create payment order
      const paymentResponse = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(data.amount),
          customerDetails: {
            customer_id: customerId,
            customer_email: memberData.email,
            customer_phone: memberData.mobile,
            customer_name: memberData.name,
          },
        }),
      });
      console.log(paymentResponse);

      if (!paymentResponse.ok) throw new Error("Failed to create payment");

      const paymentData = await paymentResponse.json();
      const orderId = paymentData.order_id;

      console.log(paymentData);

      // Initialize checkout with the payment session ID
      const checkoutOptions = {
        paymentSessionId: paymentData.payment_session_id,
        redirectTarget: "_modal", // Use modal instead of redirect
        // redirectTarget: "_self", // Use modal instead of redirect
      };

      // Start the checkout process
      cashfree
        .checkout(checkoutOptions)
        .then((result: any) => {
          if (result.error) {
            toast.error("Payment failed. Please try again.");
            setIsSubmitting(false);
          } else if (result.paymentDetails) {
            // Payment successful - redirect to success page
            // window.location.href = `/payment-success?order_id=${paymentData.order_id}`;
            verifyPayment(orderId);
          } else {
            // Payment was cancelled or closed
            setIsSubmitting(false);
          }
        })
        .catch((error: any) => {
          console.error("Checkout error:", error);
          toast.error(
            "Payment process encountered an error. Please try again.",
          );
          setIsSubmitting(false);
        });
    } catch (_error) {
      toast.error(
        "Something went wrong on our side. Please try again — we really want to get you onboard 🙏",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {currentStep === "registration"
                ? "Member Registration"
                : "Make a Donation"}
            </CardTitle>
            <CardDescription>
              {currentStep === "registration"
                ? "Fill in the required details to become a member of Purvanchal Mitra Mahasabha"
                : "Support our cause by making a donation"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {currentStep === "registration" ? (
              <Form {...registrationForm}>
                <form
                  onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* NAME */}
                    <FormField
                      control={registrationForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              Full Name{" "}
                              <span className="text-destructive">*</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* MOBILE */}
                    <FormField
                      control={registrationForm.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              Mobile Number{" "}
                              <span className="text-destructive">*</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your mobile number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* EMAIL */}
                    <FormField
                      control={registrationForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              Email Address{" "}
                              <span className="text-destructive">*</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* DOB */}
                    <FormField
                      control={registrationForm.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              Date of Birth{" "}
                              <span className="text-destructive">*</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              date={
                                field.value ? new Date(field.value) : undefined
                              }
                              setDate={(date) =>
                                field.onChange(date?.toISOString() || null)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* EDUCATION */}
                    <FormField
                      control={registrationForm.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-muted-foreground" />
                              Education{" "}
                              <span className="text-destructive">*</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your education details"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* IMAGE */}
                    <FormField
                      control={registrationForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              Image <span className="text-destructive">*</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <FileUpload
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* CURRENT ADDRESS */}
                  <FormField
                    control={registrationForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Current Address{" "}
                            <span className="text-destructive">*</span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your current address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PERMANENT ADDRESS */}
                  <FormField
                    control={registrationForm.control}
                    name="permanentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Permanent Address{" "}
                            <span className="text-destructive">*</span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your permanent address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* TERMS */}
                  <FormField
                    control={registrationForm.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(Boolean(v))}
                          />
                        </FormControl>

                        <div className="flex flex-col space-y-1">
                          <FormLabel className="text-sm font-medium">
                            I agree to the{" "}
                            <Link
                              href="/terms"
                              className="text-primary hover:underline underline-offset-4"
                            >
                              Terms and Conditions
                            </Link>
                          </FormLabel>

                          <FormDescription className="text-xs text-muted-foreground">
                            I confirm that I am 18+ years old, have no criminal
                            record, and am a citizen of India.
                          </FormDescription>

                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* EXISTING MEMBER */}
                  {existingMember && (
                    <div className="p-4 bg-warning/20 border border-warning rounded-md">
                      <p className="text-warning-foreground">
                        <strong>Note:</strong> A member with this name already
                        exists.
                      </p>
                    </div>
                  )}

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Continue to Donation"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...donationForm}>
                <form
                  onSubmit={donationForm.handleSubmit(onDonationSubmit)}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Thank you for registering! Your support helps us continue
                      our mission.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-center block text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        Select Donation Amount
                      </div>
                    </Label>
                    <Select
                      value={donationForm.watch("amount")}
                      onValueChange={(value) =>
                        donationForm.setValue("amount", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select donation amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">₹100</SelectItem>
                        <SelectItem value="500">₹500</SelectItem>
                        <SelectItem value="1000">₹1000</SelectItem>
                        <SelectItem value="2000">₹2000</SelectItem>
                      </SelectContent>
                    </Select>
                    {donationForm.formState.errors.amount && (
                      <p className="text-sm text-destructive">
                        {donationForm.formState.errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep("registration")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting || !donationForm.watch("amount")}
                    >
                      {isSubmitting ? "Processing..." : "Donate & Complete"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
