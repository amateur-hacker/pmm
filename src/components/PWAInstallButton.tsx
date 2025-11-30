'use client';

import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
import { usePWAInstall } from 'react-use-pwa-install';
import { useEffect, useState } from 'react';

export function PWAInstallButton() {
  const [isClient, setIsClient] = useState(false);
  const install = usePWAInstall();

  useEffect(() => {
    // Ensure we're on the client side before attempting to show the button
    setIsClient(true);
  }, []);

  // Only show the button if installation is available and we're on the client
  if (!isClient || !install) {
    return null;
  }

  return (
    <Button onClick={install} size="sm" className="gap-2">
      <Smartphone className="h-4 w-4" />
      Install App
    </Button>
  );
}