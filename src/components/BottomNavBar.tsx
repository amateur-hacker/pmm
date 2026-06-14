"use client";

import { useElementSize } from "@mantine/hooks";
import {
  CalendarIcon,
  CreditCard,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/events", label: "Events", icon: CalendarIcon },
  { href: "/members", label: "Members", icon: UsersIcon },
  { href: "/registration", label: "Join", icon: UserPlusIcon },
  { href: "/membership", label: "Membership", icon: CreditCard },
] as const;

function BottomNavBar() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const isTouchDevice = useIsTouchDevice();

  const { ref, height: bottomNavHeight } = useElementSize();

  const isActive = (itemHref: string) => {
    if (itemHref === "/") return pathname === "/";
    return pathname === itemHref || pathname.startsWith(itemHref + "/");
  };

  const activeIndex = navItems.findIndex((item) => isActive(item.href));

  useEffect(() => {
    prevPathname.current = pathname;
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--bottom-nav-height",
      bottomNavHeight > 0 ? `${bottomNavHeight}px` : "0px",
    );
  }, [bottomNavHeight]);

  if (!isTouchDevice) return null;

  return (
    <nav
      aria-label="Bottom navigation"
      className="pointer-events-auto bg-background md:hidden"
      ref={ref}
    >
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-0 h-0.5 w-full bg-border"
        />
        <motion.div
          animate={{
            x:
              activeIndex >= 0
                ? `${(activeIndex / navItems.length) * 100}%`
                : 0,
          }}
          className="absolute top-0 left-0 h-0.5 bg-primary"
          initial={false}
          style={{ width: `${100 / navItems.length}%` }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <div className="relative flex h-16 items-center justify-between border-t bg-background/90 px-4 backdrop-blur-md">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                className="flex flex-1 flex-col items-center justify-center gap-0.5"
                href={item.href}
                key={item.href}
              >
                <Button
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "h-full w-full rounded-none border-0 bg-transparent",
                    "data-[state=active]:text-primary",
                    active && "text-primary",
                  )}
                  data-state={active ? "active" : "inactive"}
                  size="icon"
                  variant={active ? "default" : "ghost"}
                >
                  <item.icon aria-hidden className="size-5" />
                  <span className="sr-only">{item.label}</span>
                </Button>
                <span className={cn("text-[0.7rem]", active && "text-primary")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export { BottomNavBar };
