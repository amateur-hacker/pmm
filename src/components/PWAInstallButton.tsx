'use client';

import { Button } from '@/components/ui/button';
import { BadgeCheck, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';

export function PWAInstallButton() {
  const { installStatus, installPWA, openPWA } = usePWAInstall();

  // Only show the button if it's appropriate to install or if it's already installed
  if (installStatus === 'notSupported') {
    return null;
  }

  const handleClick = () => {
    if (installStatus === 'installed') {
      openPWA();
    } else {
      // Directly trigger the installation
      installPWA();
    }
  };

  return (
    <Button onClick={handleClick} size="sm" className="gap-2">
      {installStatus === 'installed' ? (
        <>
          <BadgeCheck className="h-4 w-4" />
          Open App
        </>
      ) : (
        <>
          <Smartphone className="h-4 w-4" />
          Install App
        </>
      )}
    </Button>
  );
}