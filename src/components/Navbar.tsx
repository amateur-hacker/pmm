"use client";

import { useElementSize } from "@mantine/hooks";
import { CreditCard, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { PWAInstallButton } from "@/components/PWAInstallButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";
import type { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

import { Skeleton } from "./ui/skeleton";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending, refetch } = authClient.useSession();
  const { ref, height: navbarHeight } = useElementSize();
  const [, _setIsMenuOpen] = useState(false);
  const isTouchDevice = useIsTouchDevice();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Members", href: "/members" },
    { name: "Membership", href: "/membership" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSignOut = async () => {
    await authClient.signOut();
    refetch();
  };

  const sessionUser =
    (session?.user as typeof auth.$Infer.Session.user) ?? null;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--navbar-height",
      navbarHeight > 0 ? `${navbarHeight}px` : "0px",
    );
  }, [navbarHeight]);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      ref={ref}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex flex-1 items-center">
            <Link className="flex shrink-0 items-center gap-2" href="/">
              <Image
                src="/logo.png"
                alt="Purvanchal Mitra Mahasabha Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-bold text-xl">PMM</span>
            </Link>
          </div>

          <div className="hidden shrink-0 items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <PWAInstallButton />
            {isPending ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : sessionUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Open User Menu"
                    className="cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          sessionUser.image ||
                          "https://res.cloudinary.com/ahcloud/image/upload/v1747277562/images/default-profile_bpnjdl_dzyvud.png"
                        }
                        alt={sessionUser.name}
                      />
                      <AvatarFallback>
                        {sessionUser.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1.5 px-2 py-1.5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            sessionUser.image ||
                            "https://res.cloudinary.com/ahcloud/image/upload/v1747277562/images/default-profile_bpnjdl_dzyvud.png"
                          }
                          alt={sessionUser.name}
                        />
                        <AvatarFallback>
                          {sessionUser.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <DropdownMenuLabel className="truncate">
                        {sessionUser.name}
                      </DropdownMenuLabel>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {sessionUser.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin?tab=events"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <LayoutDashboard size={16} />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem asChild>
                    <Link
                      href="/payment-history"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <CreditCard size={16} />
                      <span>Payment History</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={async () => {
                  await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/",
                  });
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}

            {!isTouchDevice && (
              <div className="flex items-center lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-foreground"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="flex w-full flex-col px-3"
                  >
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <div className="mt-16 flex flex-1 flex-col space-y-4 overflow-y-auto">
                      <div className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                          <Button
                            key={item.name}
                            variant={
                              isActive(item.href) ? "secondary" : "ghost"
                            }
                            className="w-full justify-start text-base font-medium cursor-pointer"
                            asChild
                          >
                            <Link href={item.href}>{item.name}</Link>
                          </Button>
                        ))}
                      </div>

                      <div className="mt-auto" />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
