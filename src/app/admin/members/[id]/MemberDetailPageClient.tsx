"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

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

export function MemberDetailPageClient(props: Props) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Use a useEffect to extract the id from async params
  useEffect(() => {
    const extractParams = async () => {
      const { id } = await props.params;
      const memberId = id; // UUID is a string, no need to parse

      const fetchMember = async () => {
        try {
          const response = await fetch(`/api/admin/members/${memberId}`, {
            credentials: "include", // Include cookies by default
          });

          if (!response.ok) {
            if (response.status === 401) {
              // Call logout API to properly delete the server-side cookie
              await fetch("/api/admin/logout", {
                method: "POST",
                credentials: "include",
              });
              router.push("/admin/login");
              return;
            }
            if (response.status === 404) {
              toast.error("Member not found.");
              router.push("/admin");
              return;
            }
            throw new Error("Failed to fetch member");
          }

          const data = await response.json();
          setMember(data);
        } catch (error) {
          console.error("Error fetching member:", error);
          toast.error("Failed to load member details. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchMember();
    };

    extractParams();
  }, [props.params, router]);

  // Authentication check is handled on the server side now

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Member not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="outline" className="cursor-pointer" asChild>
            <Link href="/admin" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Member Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </h3>
                    <p className="font-medium">{member.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h3>
                    <p className="font-medium">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Mobile
                    </h3>
                    <p className="font-medium">{member.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Education
                    </h3>
                    <p className="font-medium">{member.education}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </h3>
                    <p className="font-medium">
                      {new Date(member.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Current Address
                    </h3>
                    <p className="font-medium">{member.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Permanent Address
                    </h3>
                    <p className="font-medium">{member.permanentAddress}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Membership Type
                    </h3>
                    <p className="font-medium capitalize">{member.type}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Registration Date
                    </h3>
                    <p className="font-medium">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total Donated (₹)
                    </h3>
                    <p className="font-medium">₹{member.donated || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {member.image && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Profile Image
                </h3>
                <div className="relative w-32 h-32">
                  <Image
                    src={member.image}
                    alt="Member profile"
                    fill
                    className="object-cover rounded-md border"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

