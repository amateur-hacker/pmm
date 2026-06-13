"use client";

import { useRef, useState } from "react";

import Image from "next/image";

import { toPng } from "html-to-image";
import { Download, Eye } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MembershipCardProps {
  name: string;
  address: string;
  mobile: string;
  dob: string;
  image?: string | null;
  validUntil: string;
  className?: string;
  showActions?: boolean;
}

export default function MembershipCard({
  name,
  address,
  mobile,
  dob,
  image,
  validUntil,
  className,
  showActions = true,
}: MembershipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "white",
      });
      const link = document.createElement("a");
      link.download = `membership-card-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download card:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDob = new Date(dob).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedValidUntil = new Date(validUntil).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const isExpired = new Date(validUntil) < new Date();

  return (
    <>
      <div
        className={cn(
          "flex w-full flex-col items-start space-y-3 overflow-hidden",
          className,
        )}
      >
        <div className="w-full overflow-x-auto">
          {" "}
          {/* scroll container */}
          <div
            className="w-xl shrink-0 overflow-hidden rounded-xl border bg-white shadow-lg"
            ref={cardRef}
          >
            {/* Header with Logo and Organization Name */}
            <div className="p-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <Image
                    alt="Logo"
                    className="rounded-full object-contain"
                    height={64}
                    src="/logo.png"
                    width={64}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="font-bold text-base text-gray-900 leading-tight">
                    Purvanchal Mitra Mahasabha
                  </h2>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-gray-500 leading-tight">
                      Ph.no: 7982970305
                    </p>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      Reg.no: 9015240451
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="mx-5 border-gray-300 border-t" />

            {/* Main Content: Details + Profile Image */}
            <div className="p-5 pt-4">
              <div className="flex gap-4">
                {/* Left side - Details */}
                <div className="min-w-0 flex-1 space-y-1.5 text-start">
                  <div>
                    <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                      Name
                    </span>
                    <p className="font-medium text-gray-900 text-sm">{name}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                      Address
                    </span>
                    <p className="text-gray-700 text-sm">{address}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                      Contact
                    </span>
                    <p className="text-gray-700 text-sm">{mobile}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                      Date of Birth
                    </span>
                    <p className="text-gray-700 text-sm">{formattedDob}</p>
                  </div>
                </div>

                {/* Right side - Profile Image */}
                <div className="flex shrink-0 flex-col items-center justify-center">
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage
                      alt={name}
                      src={
                        image ||
                        "https://res.cloudinary.com/ahcloud/image/upload/v1747277562/images/default-profile_bpnjdl_dzyvud.png"
                      }
                    />
                    <AvatarFallback className="text-lg">
                      {name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="mx-5 border-gray-300 border-t" />

            {/* Validation */}
            <div className="px-5 pt-3 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                  Membership Valid Until
                </span>
                <span
                  className={cn(
                    "font-semibold text-sm",
                    isExpired ? "text-red-600" : "text-green-600",
                  )}
                >
                  {formattedValidUntil}
                </span>
              </div>
              {isExpired && (
                <p className="mt-1 text-[11px] text-red-500">
                  Membership expired. Please renew to continue.
                </p>
              )}
            </div>

            {/* President */}
            <div className="flex justify-end px-5 pb-4">
              <p className="max-w-[160px] text-right text-[10px] text-gray-400 leading-tight">
                shri uttam singh chauhan
                <br />
                president
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1 cursor-pointer"
              onClick={() => setLightboxOpen(true)}
              variant="outline"
            >
              <Eye className="mr-1 h-4 w-4" />
              Preview
            </Button>
            <Button
              className="flex-1 cursor-pointer"
              disabled={isDownloading}
              onClick={handleDownload}
            >
              <Download className="mr-1 h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox for preview */}
      <Lightbox
        close={() => setLightboxOpen(false)}
        controller={{ disableSwipeNavigation: true }}
        open={lightboxOpen}
        render={{
          slide: () => {
            if (!cardRef.current) return null;
            return (
              <div className="flex h-full w-full items-center justify-start overflow-x-auto p-4 sm:justify-center">
                <div className="w-xl shrink-0 rounded-xl bg-white shadow-lg">
                  <div className="p-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <Image
                          alt="Logo"
                          className="rounded-full object-contain"
                          height={48}
                          src="/logo.png"
                          width={48}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h2 className="font-bold text-base text-gray-900 leading-tight">
                          Purvanchal Mitra Mahasabha
                        </h2>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] text-gray-500 leading-tight">
                            Ph.no: 7982970305
                          </p>
                          <p className="text-[11px] text-gray-500 leading-tight">
                            Reg.no: 9015240451
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mx-5 border-gray-300 border-t" />
                  <div className="p-5 pt-4">
                    <div className="flex gap-4">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div>
                          <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                            Name
                          </span>
                          <p className="font-medium text-gray-900 text-sm">
                            {name}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                            Address
                          </span>
                          <p className="text-gray-700 text-sm">{address}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                            Contact
                          </span>
                          <p className="text-gray-700 text-sm">{mobile}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                            Date of Birth
                          </span>
                          <p className="text-gray-700 text-sm">
                            {formattedDob}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center">
                        <Avatar className="h-32 w-32 border-2 border-gray-200">
                          <AvatarImage
                            alt={name}
                            src={
                              image ||
                              "https://res.cloudinary.com/ahcloud/image/upload/v1747277562/images/default-profile_bpnjdl_dzyvud.png"
                            }
                          />
                          <AvatarFallback className="text-lg">
                            {name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                  <div className="mx-5 border-gray-300 border-t" />
                  <div className="px-5 pt-3 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                        Membership Valid Until
                      </span>
                      <span
                        className={cn(
                          "font-semibold text-sm",
                          isExpired ? "text-red-600" : "text-green-600",
                        )}
                      >
                        {formattedValidUntil}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end px-5 pb-4">
                    <p className="max-w-[160px] text-right text-[10px] text-gray-400 leading-tight">
                      shri uttam singh chauhan
                      <br />
                      president
                    </p>
                  </div>
                </div>
              </div>
            );
          },
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        slides={[{ src: "" }]}
      />
    </>
  );
}
