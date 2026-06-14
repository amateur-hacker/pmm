"use client";

import { useCallback, useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

const panelVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 28 },
  },
  exit: { x: 20, opacity: 0, transition: { duration: 0.1 } },
};

const qrVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

export default function DonationButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [presetIndex, setPresetIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const isAdminRoute = pathname.startsWith("/admin");

  const handleAmount = useCallback((value: number, index: number) => {
    setAmount(value);
    setPresetIndex(index);
    setCustomAmount("");
    setQrDataUrl("");
    setPaymentLink("");
    setError("");
  }, []);

  const handleCustomAmount = useCallback((value: string) => {
    setCustomAmount(value);
    setPresetIndex(-1);
    if (value) {
      const parsed = Number.parseFloat(value);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setAmount(parsed);
      }
    }
    setQrDataUrl("");
    setPaymentLink("");
    setError("");
  }, []);

  const donateUrl = useCallback(
    (amt: number) => {
      const base =
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://purvanchalmitramahasabha.in";
      return `${base}/donate?amount=${amt}`;
    },
    [],
  );

  const handleGenerate = useCallback(async () => {
    if (amount < 1) {
      setError("Please enter a valid amount");
      return;
    }

    setError("");
    setQrDataUrl("");
    setPaymentLink("");

    try {
      const url = donateUrl(amount);
      setPaymentLink(url);

      const qr = await QRCode.toDataURL(url, {
        width: 280,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setQrDataUrl(qr);
    } catch {
      setError("Failed to generate QR code");
    }
  }, [amount, donateUrl]);

  const handlePayNow = useCallback(async () => {
    if (amount < 1) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create payment link");
      }

      window.open(data.link_url, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [amount]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQrDataUrl("");
    setPaymentLink("");
    setError("");
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    handleClose();
  }, [pathname, handleClose]);

  if (isAdminRoute) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
          aria-hidden
        />
      )}

      <div className="fixed right-0 top-1/2 z-50 -translate-y-1/2">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="donation-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-full top-1/2 w-80 -translate-y-1/2 overflow-hidden rounded-l-2xl border bg-card shadow-2xl"
            >
              <div className="border-b px-5 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Make a Donation</h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4 px-5 py-4">
                <div>
                  <p className="mb-2 text-muted-foreground text-sm">
                    Select amount
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_AMOUNTS.map((val, i) => (
                      <motion.button
                        key={val}
                        type="button"
                        onClick={() => handleAmount(val, i)}
                        className={cn(
                          "cursor-pointer rounded-lg border px-2 py-2 text-sm font-medium transition-colors",
                          presetIndex === i
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted hover:border-muted-foreground/30",
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ₹{val}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-muted-foreground text-sm">
                    Or enter custom amount
                  </p>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    className="w-full cursor-pointer"
                    disabled={amount < 1}
                    onClick={handleGenerate}
                  >
                    {qrDataUrl ? "Regenerate QR" : `Generate QR for ₹${amount}`}
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-center text-sm text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {qrDataUrl && paymentLink && (
                    <motion.div
                      key="qr-result"
                      variants={qrVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="space-y-4"
                    >
                      <div className="flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrDataUrl}
                          alt="Payment QR Code"
                          className="rounded-lg"
                          width={280}
                          height={280}
                        />
                      </div>

                      <p className="text-center text-muted-foreground text-xs">
                        Scan with any QR scanner to pay
                      </p>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="button"
                          className="w-full cursor-pointer gap-2"
                          disabled={isLoading}
                          onClick={handlePayNow}
                        >
                          {isLoading ? (
                            <svg
                              className="h-4 w-4 animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" x2="21" y1="14" y2="3" />
                            </svg>
                          )}
                          {isLoading ? "Processing..." : `Pay ₹${amount} Now`}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={handleToggle}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-1.5 bg-primary px-2.5 py-4 text-primary-foreground shadow-lg transition-colors",
            isOpen ? "rounded-l-none" : "rounded-l-xl",
          )}
          whileTap={{ scale: 0.95 }}
          aria-label="Donate"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={isOpen ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </motion.svg>
          <span className="text-[10px] font-semibold uppercase tracking-wider [writing-mode:vertical-rl]">
            Donate
          </span>
        </motion.button>
      </div>
    </>
  );
}
