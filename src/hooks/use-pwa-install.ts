import { useState, useEffect, useCallback } from "react";

type PWAInstallStatus =
  | "beforeInstall"
  | "installing"
  | "installed"
  | "notSupported";

export function usePWAInstall() {
  const [installStatus, setInstallStatus] =
    useState<PWAInstallStatus>("notSupported");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Function to check if app is installed
  const checkInstallStatus = useCallback((): PWAInstallStatus => {
    // Check if app is already installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    const isInstalled = isStandalone || isIOSStandalone;

    if (isInstalled) {
      return "installed";
    }

    return "notSupported";
  }, []);

  useEffect(() => {
    // Check if the browser supports the install prompt
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "BeforeInstallPromptEvent" in window
    ) {
      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        setDeferredPrompt(e);
        setInstallStatus("beforeInstall");
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // Initial check for install status
      setInstallStatus(
        checkInstallStatus() === "installed" ? "installed" : "notSupported",
      );

      // If we already have a deferred prompt, it might be ready to use
      // This is for cases where the prompt was triggered before our hook mounted
      if ((window as any).deferredPrompt) {
        setDeferredPrompt((window as any).deferredPrompt);
        setInstallStatus("beforeInstall");
      }

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
      };
    } else {
      // If the browser doesn't support PWA installation, check if already installed
      setInstallStatus(checkInstallStatus());
    }
  }, [checkInstallStatus]);

  const installPWA = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt is available, guide the user
      alert(
        'To install this app:\n1. Open the browser menu\n2. Select "Install App" or "Add to Home Screen"',
      );
      return;
    }

    setInstallStatus("installing");

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
        setInstallStatus("installed");
      } else {
        console.log("User dismissed the install prompt");
        setInstallStatus("beforeInstall");
      }
    } catch (err) {
      console.error("Install prompt was not shown:", err);
      setInstallStatus("beforeInstall");
    }

    setDeferredPrompt(null);
  };

  const openPWA = () => {
    // For installed PWA, we can just alert the user
    alert(
      "App is already installed! Please use the installed app for the best experience.",
    );
  };

  return {
    installStatus,
    installPWA,
    openPWA,
  };
}

