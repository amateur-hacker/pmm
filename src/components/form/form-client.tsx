"use client";

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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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

// ---------------- SCHEMA ----------------
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
  image: z.string().optional(),
  terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms and Conditions",
  }),
});

export default function FormPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingMember, setExistingMember] = useState(false);

  const form = useForm({
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

  const onSubmit = async (data: z.infer<typeof memberSchema>) => {
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

      const submitResponse = await fetch("/api/register-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          image: data.image || null,
          type: "member",
        }),
      });

      if (!submitResponse.ok) throw new Error("Failed to submit member data");

      toast.success(
        "You’re now a member! We're truly grateful to have you with us 🤝",
      );
      form.reset();
      setExistingMember(false);
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
              Member Registration Form
            </CardTitle>
            <CardDescription>
              Fill in the required details to become a member of Purvanchal
              Mitra Mahasabha
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NAME */}
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            Image (Optional)
                          </div>
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* CURRENT ADDRESS */}
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
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
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
