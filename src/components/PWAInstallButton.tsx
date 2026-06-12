"use client";

import { DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePWAInstall } from "react-use-pwa-install";
import { Button } from "@/components/ui/button";

export function PWAInstallButton() {
  const [isClient, setIsClient] = useState(false);
  const install = usePWAInstall();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !install) {
    return null;
  }

  return (
    <Button
      aria-label="Install App"
      className="cursor-pointer rounded-full"
      onClick={install}
      variant="ghost"
    >
      <DownloadIcon className="size-5" />
      <span className="hidden md:inline-block">Install</span>
    </Button>
  );
}
