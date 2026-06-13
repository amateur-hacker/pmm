"use client";

import crypto from "node:crypto";
// @ts-expect-error
import { load } from "@cashfreepayments/cashfree-js";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  GraduationCap,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
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

// ---------------- SCHEMAS ----------------
const memberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  mobile: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  dob: z.string().refine(
    (date) => {
      const parsedDate = Date.parse(date);
      if (Number.isNaN(parsedDate)) return false;

      const birthDate = new Date(parsedDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if birthday hasn't occurred this year
      const adjustedAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      return adjustedAge >= 18;
    },
    {
      message: "You must be at least 18 years old to become a member",
    },
  ),
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
  plan: z.enum(["year", "lifetime"]),
  tier: z.enum(["Normal", "Special"]),
  years: z.number().min(1).max(5),
  amount: z.string().min(1, { message: "Please select an amount" }),
});

const generateCustomerId = () => {
  const uniqueId = crypto.randomBytes(16).toString("hex");

  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const customerId = hash.digest("hex");
  return `${customerId.slice(0, 6)}`;
};
export default function MembershipForm() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingMember, setExistingMember] = useState(false);
  const [currentStep, setCurrentStep] = useState<"registration" | "donation">(
    "registration",
  );
  const [memberData, setMemberData] = useState<z.infer<
    typeof memberSchema
  > | null>(null);

  const uploadedImages = useRef<Set<string>>(new Set());

  useEffect(() => {
    localStorage.removeItem("pendingMemberData");

    return () => {
      uploadedImages.current.forEach((url) => {
        fetch("/api/cleanup-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, type: "member" }),
        }).catch(() => {});
      });
    };
  }, []);

  const registrationForm = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "xyz123",
      address: "xyz123",
      mobile: "1234567890",
      email: "xyz123@gmail.com",
      dob: "1/1/2001",
      education: "xyz",
      permanentAddress: "xyz123",
      image: "",
      terms: true,
    },
  });

  const donationForm = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      plan: "year",
      amount: "100",
      tier: "Normal",
      years: 1,
    },
  });

  const onRegistrationSubmit = async (data: z.infer<typeof memberSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/check-member?name=${encodeURIComponent(data.name)}&mobile=${encodeURIComponent(data.mobile)}`,
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

    const verifyPayment = async (txnId: string) => {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction_id: txnId }),
        });

        const data = await res.json();

        if (data?.order_status === "PAID") {
          return { success: true, data };
        } else {
          return { success: false, data };
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        return { success: false, error };
      }
    };

    try {
      // Store member data in localStorage for later use after payment success
      const type = data.plan === "lifetime" ? "Lifetime" : data.tier;

      localStorage.setItem(
        "pendingMemberData",
        JSON.stringify({
          ...memberData,
          image: memberData.image || null,
          type,
          donated: parseInt(data.amount, 10),
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
      if (!paymentResponse.ok) throw new Error("Failed to create payment");

      const paymentData = await paymentResponse.json();
      const txnId = paymentData.order_id;

      // Initialize checkout with the payment session ID
      const checkoutOptions = {
        paymentSessionId: paymentData.payment_session_id,
        redirectTarget: "_modal",
      };

      // Start the checkout process
      cashfree
        .checkout(checkoutOptions)
        .then(async (result: any) => {
          if (result.error) {
            toast.error("Payment failed. Please try again.");
            setIsSubmitting(false);
          } else if (result.paymentDetails) {
            // Verify payment before redirecting to success page
            const verificationResult = await verifyPayment(txnId);
            if (verificationResult.success) {
              // Payment verified successfully - redirect to success page
              window.location.href = `/payment-success?transaction_id=${txnId}&t=${Date.now()}`;
            } else {
              toast.error(
                "Payment verification failed. Please contact support if amount was deducted.",
              );
              setIsSubmitting(false);
            }
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
                ? "NGO Membership"
                : "Membership Type"}
            </CardTitle>
            <CardDescription>
              {currentStep === "registration"
                ? "Become a member of Purvanchal Mitra Mahasabha and support our community development initiatives"
                : "Choose your membership type to complete registration"}
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
                              onChange={(url) => {
                                if (url) uploadedImages.current.add(url);
                                field.onChange(url);
                              }}
                              onPreview={() => setLightboxOpen(true)}
                              previewClassName="rounded-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Lightbox
                      open={lightboxOpen}
                      close={() => setLightboxOpen(false)}
                      slides={[
                        {
                          src: registrationForm.watch("image") || "",
                        },
                      ]}
                      render={{
                        buttonPrev: () => null,
                        buttonNext: () => null,
                      }}
                      controller={{ disableSwipeNavigation: true }}
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
                      <FormItem>
                        <div className="flex gap-3">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(v) =>
                                field.onChange(Boolean(v))
                              }
                              className="mt-1"
                            />
                          </FormControl>

                          <div className="space-y-1">
                            <FormLabel className="text-sm font-medium leading-relaxed inline-block">
                              I agree to the{" "}
                              <Link
                                href="/terms"
                                className="text-primary hover:underline underline-offset-4"
                              >
                                Terms and Conditions
                              </Link>{" "}
                              and understand that membership requires a minimum
                              donation
                            </FormLabel>

                            <FormDescription className="text-xs text-muted-foreground leading-relaxed">
                              I confirm that I am 18+ years old, have no
                              criminal record, and am a citizen of India.
                            </FormDescription>

                            <FormMessage />
                          </div>
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
                    className="w-full cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Continue to Registration"}
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
                    <p className="text-muted-foreground">
                      Thank you for registering! Please select your membership
                      type.
                    </p>
                  </div>

                  {/* Plan Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Year */}
                    <button
                      type="button"
                      onClick={() => {
                        const tier = donationForm.getValues("tier");
                        const years = donationForm.getValues("years");
                        const base = tier === "Special" ? 500 : 100;
                        donationForm.setValue("plan", "year");
                        donationForm.setValue("amount", String(base * years));
                      }}
                      className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all cursor-pointer ${
                        donationForm.watch("plan") === "year"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      <span className="text-2xl font-bold">Yearly</span>
                      <span className="text-sm text-muted-foreground">
                        ₹100/yr – ₹500/yr
                      </span>
                    </button>

                    {/* Lifetime */}
                    <button
                      type="button"
                      onClick={() => {
                        donationForm.setValue("plan", "lifetime");
                        donationForm.setValue("amount", "5000");
                      }}
                      className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all cursor-pointer ${
                        donationForm.watch("plan") === "lifetime"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      <span className="text-3xl font-bold">₹5,000</span>
                      <Badge variant="default">Lifetime Member</Badge>
                    </button>
                  </div>

                  {/* Year Options */}
                  {donationForm.watch("plan") === "year" && (
                    <div className="space-y-4 rounded-lg border p-4">
                      {/* Tier Toggle */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const years = donationForm.getValues("years");
                            donationForm.setValue("tier", "Normal");
                            donationForm.setValue("amount", String(100 * years));
                          }}
                          className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all ${
                            donationForm.watch("tier") === "Normal"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          Normal (₹100/yr)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const years = donationForm.getValues("years");
                            donationForm.setValue("tier", "Special");
                            donationForm.setValue(
                              "amount",
                              String(500 * years),
                            );
                          }}
                          className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all ${
                            donationForm.watch("tier") === "Special"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          Special (₹500/yr)
                        </button>
                      </div>

                      {/* Year Selector */}
                      <div>
                        <FormLabel>Duration</FormLabel>
                        <div className="mt-1 flex gap-2">
                          {[1, 2, 3, 4, 5].map((y) => (
                            <button
                              key={y}
                              type="button"
                              onClick={() => {
                                donationForm.setValue("years", y);
                                const tier =
                                  donationForm.getValues("tier");
                                const base =
                                  tier === "Special" ? 500 : 100;
                                donationForm.setValue(
                                  "amount",
                                  String(base * y),
                                );
                              }}
                              className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                donationForm.watch("years") === y
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              {y} {y === 1 ? "yr" : "yrs"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Computed Amount */}
                      <div className="rounded-md bg-primary/5 p-3 text-center">
                        <p className="text-sm text-muted-foreground">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          ₹
                          {(
                            (donationForm.watch("tier") === "Special"
                              ? 500
                              : 100) * donationForm.watch("years")
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Lifetime Display */}
                  {donationForm.watch("plan") === "lifetime" && (
                    <div className="rounded-lg border bg-primary/5 p-4 text-center">
                      <p className="text-lg font-semibold">
                        Lifetime Membership
                      </p>
                      <p className="mt-2 text-3xl font-bold text-primary">
                        ₹5,000
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        One-time payment, lifetime access
                      </p>
                    </div>
                  )}

                  {donationForm.formState.errors.amount && (
                    <p className="text-center text-sm text-destructive">
                      {donationForm.formState.errors.amount.message}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 cursor-pointer"
                      onClick={() => setCurrentStep("registration")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 cursor-pointer"
                      disabled={isSubmitting || !donationForm.watch("amount")}
                    >
                      {isSubmitting ? "Processing..." : "Continue Registration"}
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
