"use client";

import { toPng } from "html-to-image";
import { Download, Eye } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
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
          "w-full space-y-3 overflow-hidden flex flex-col items-start",
          className,
        )}
      >
        <div className="w-full overflow-x-auto">
          {" "}
          {/* scroll container */}
          <div
            ref={cardRef}
            className="w-xl bg-white rounded-xl shadow-lg overflow-hidden border shrink-0"
          >
            {/* Header with Logo and Organization Name */}
            <div className="p-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="rounded-full object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-base font-bold text-gray-900 leading-tight">
                    Purvanchal Mitra Mahasabha
                  </h2>
                  <div className="flex justify-between gap-3 items-center">
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
            <div className="mx-5 border-t border-gray-300" />

            {/* Main Content: Details + Profile Image */}
            <div className="p-5 pt-4">
              <div className="flex gap-4">
                {/* Left side - Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Name
                    </span>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Address
                    </span>
                    <p className="text-sm text-gray-700">{address}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Contact
                    </span>
                    <p className="text-sm text-gray-700">{mobile}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Date of Birth
                    </span>
                    <p className="text-sm text-gray-700">{formattedDob}</p>
                  </div>
                </div>

                {/* Right side - Profile Image */}
                <div className="shrink-0 flex flex-col items-center justify-center">
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage
                      src={
                        image ||
                        "https://res.cloudinary.com/ahcloud/image/upload/v1747277562/images/default-profile_bpnjdl_dzyvud.png"
                      }
                      alt={name}
                    />
                    <AvatarFallback className="text-lg">
                      {name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="mx-5 border-t border-gray-300" />

            {/* Validation */}
            <div className="px-5 pb-3 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Membership Valid Until
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isExpired ? "text-red-600" : "text-green-600",
                  )}
                >
                  {formattedValidUntil}
                </span>
              </div>
              {isExpired && (
                <p className="text-[11px] text-red-500 mt-1">
                  Membership expired. Please renew to continue.
                </p>
              )}
            </div>

            {/* President */}
            <div className="px-5 pb-4 flex justify-end">
              <p className="text-[10px] text-gray-400 leading-tight text-right max-w-[160px]">
                shri uttam singh chauhan
                <br />
                president
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              className="flex-1 cursor-pointer"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-1" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox for preview */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: "" }]}
        controller={{
          touchAction: "none",
          disableSwipeNavigation: true,
        }}
        render={{
          slide: () => {
            if (!cardRef.current) return null;
            return (
              <div className="flex items-center justify-start sm:justify-center h-full w-full p-4 overflow-x-auto">
                <div className="w-xl bg-white rounded-xl shadow-lg shrink-0">
                  <div className="p-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <Image
                          src="/logo.png"
                          alt="Logo"
                          width={48}
                          height={48}
                          className="rounded-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h2 className="text-base font-bold text-gray-900 leading-tight">
                          Purvanchal Mitra Mahasabha
                        </h2>
                        <div className="flex justify-between gap-3 items-center">
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
                  <div className="mx-5 border-t border-gray-300" />
                  <div className="p-5 pt-4">
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Name
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {name}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Address
                          </span>
                          <p className="text-sm text-gray-700">{address}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Contact
                          </span>
                          <p className="text-sm text-gray-700">{mobile}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Date of Birth
                          </span>
                          <p className="text-sm text-gray-700">
                            {formattedDob}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <Avatar className="h-32 w-32 border-2 border-gray-200">
                          <AvatarImage
                            src={
                              image ||
                              "https://res.cloudinary.com/ahcloud/image/upload/v1747277562/images/default-profile_bpnjdl_dzyvud.png"
                            }
                            alt={name}
                          />
                          <AvatarFallback className="text-lg">
                            {name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                  <div className="mx-5 border-t border-gray-300" />
                  <div className="px-5 pb-3 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Membership Valid Until
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isExpired ? "text-red-600" : "text-green-600",
                        )}
                      >
                        {formattedValidUntil}
                      </span>
                    </div>
                  </div>
                  <div className="px-5 pb-4 flex justify-end">
                    <p className="text-[10px] text-gray-400 leading-tight text-right max-w-[160px]">
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
      />
    </>
  );
}
