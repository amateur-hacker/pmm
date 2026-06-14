"use client";

import { Suspense, useCallback, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000, 5000];

function DonateForm() {
  const searchParams = useSearchParams();
  const presetFromUrl = useMemo(() => {
    const amt = Number(searchParams.get("amount"));
    const idx = PRESET_AMOUNTS.indexOf(amt);
    return idx >= 0 ? { amount: amt, index: idx } : null;
  }, [searchParams]);

  const [amount, setAmount] = useState(presetFromUrl?.amount ?? 100);
  const [customAmount, setCustomAmount] = useState(presetFromUrl ? "" : "");
  const [presetIndex, setPresetIndex] = useState(presetFromUrl?.index ?? 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePreset = useCallback((val: number, idx: number) => {
    setAmount(val);
    setPresetIndex(idx);
    setCustomAmount("");
    setError("");
  }, []);

  const handleCustom = useCallback((val: string) => {
    setCustomAmount(val);
    setPresetIndex(-1);
    setError("");
    if (val) {
      const parsed = Number.parseFloat(val);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setAmount(parsed);
      }
    }
  }, []);

  const handleDonate = useCallback(async () => {
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

      window.location.href = data.link_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }, [amount]);

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-4 py-12">
      <div className="w-full space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Heart className="size-6 text-primary" />
          </div>
          <h1 className="font-bold text-xl">Make a Donation</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Support Purvanchal Mitra Mahasabha
          </p>
        </div>

        <div>
          <p className="mb-2 text-muted-foreground text-sm">Select amount</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((val, idx) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePreset(val, idx)}
                className={cn(
                  "cursor-pointer rounded-lg border py-3 text-sm font-medium transition-all",
                  presetIndex === idx
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted hover:border-muted-foreground/30",
                )}
              >
                ₹{val}
              </button>
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
              onChange={(e) => handleCustom(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <Button
          type="button"
          className="w-full cursor-pointer gap-2"
          disabled={isLoading || amount < 1}
          onClick={handleDonate}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Heart className="size-4" />
              Donate ₹{amount}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[70dvh] max-w-md items-center justify-center px-4">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      }
    >
      <DonateForm />
    </Suspense>
  );
}
