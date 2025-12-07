"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

// ----------------- SCHEMA --------------------
const memberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  mobile: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" }),
  email: z.string().email({ message: "Invalid email address" }),
  dob: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid date of birth",
  }),
  education: z.string().min(2, { message: "Education information required" }),
  permanentAddress: z.string().min(5, {
    message: "Permanent address must be at least 5 characters",
  }),
  image: z.string().optional(),
  donated: z
    .number()
    .min(0, { message: "Donation amount cannot be negative" })
    .default(0),
});

interface Member {
  id: string; // UUID
  name: string;
  address: string;
  mobile: string;
  email: string;
  dob: string;
  education: string;
  permanentAddress: string;
  image: string | null;
  donated: number; // Donated field
  type: string;
  createdAt: string;
}

type Props = {
  params: Promise<{ id: string }>;
};

// ----------------- COMPONENT --------------------
export function EditMemberPageClient(props: Props) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      donated: 0,
    },
  });
  const { control, handleSubmit, setValue } = form;
  const memberIdRef = useRef<string | null>(null);

  // Load Member
  useEffect(() => {
    const load = async () => {
      const { id } = await props.params;
      const memberId = id; // UUID is a string, no need to convert

      try {
        const res = await fetch(`/api/admin/members/${memberId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Member not found");
        }

        const data = await res.json();
        setMember(data);
        memberIdRef.current = data.id;

        setValue("name", data.name);
        setValue("address", data.address);
        setValue("mobile", data.mobile);
        setValue("email", data.email);
        setValue("dob", new Date(data.dob).toISOString());
        setValue("education", data.education);
        setValue("permanentAddress", data.permanentAddress);
        setValue("image", data.image || "");
        setValue("donated", data.donated || 0);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load member details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [props.params, setValue]);

  // Submit Handler
  const onSubmit = async (data: z.infer<typeof memberSchema>) => {
    try {
      // Session check is done in useEffect

      if (!memberIdRef.current) throw new Error("Invalid member ID");

      const res = await fetch(`/api/admin/members/${memberIdRef.current}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      toast.success("Member updated successfully!");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update member");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Member not found
      </div>
    );
  }

  // ---------------- UI -------------------
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="outline" className="cursor-pointer" asChild>
            <Link href="/admin" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Member</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NAME */}
                  <FormField
                    control={control}
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
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* MOBILE */}
                  <FormField
                    control={control}
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
                          <Input placeholder="Enter mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* EMAIL */}
                  <FormField
                    control={control}
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
                          <Input placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* DOB */}
                  <FormField
                    control={control}
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
                    control={control}
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
                          <Input placeholder="Enter education" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* IMAGE */}
                  <FormField
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Image
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

                  {/* DONATED AMOUNT */}
                  <FormField
                    control={control}
                    name="donated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Donated Amount (₹)
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter donated amount"
                            value={field.value ?? 0}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* CURRENT ADDRESS */}
                <FormField
                  control={control}
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
                        <Input placeholder="Enter current address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PERMANENT ADDRESS */}
                <FormField
                  control={control}
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
                          placeholder="Enter permanent address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button asChild variant="outline" className="cursor-pointer">
                    <Link href="/admin">Cancel</Link>
                  </Button>

                  <Button type="submit">Update Member</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
