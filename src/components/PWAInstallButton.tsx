'use client';

import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';

export function PWAInstallButton() {
  const { installStatus, installPWA } = usePWAInstall();

  // Only show the button if it's appropriate to install
  if (installStatus === 'notSupported' || installStatus === 'installed') {
    return null;
  }

  const handleClick = () => {
    // Directly trigger the installation
    installPWA();
  };

  return (
    <Button onClick={handleClick} size="sm" className="gap-2">
      <Smartphone className="h-4 w-4" />
      Install App
    </Button>
  );
}