"use client";

import { LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "./ui/skeleton";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending, error, refetch } = authClient.useSession();

  // Helper function to determine if a link is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };
  const [_isMenuOpen, _setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Members", href: "/members" },
    { name: "Registration", href: "/register-member" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSignOut = async () => {
    await authClient.signOut();
    refetch(); // Refetch the session after sign out
  };

  const sessionUser =
    (session?.user as typeof auth.$Infer.Session.user) ?? null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="Purvanchal Mitra Mahasabha Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="ml-2 text-xl font-bold hidden lg:inline-block">
                PMM
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
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

            {/* Authentication buttons */}
            {isPending ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : sessionUser ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 cursor-pointer"
                      type="button"
                      title="Open User Menu"
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
                    </button>
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
                            href="/admin"
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <LayoutDashboard size={16} />
                            <span>Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/", // Redirect to home after sign in
                  });
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}

            <PWAInstallButton />
          </div>

          {/* Mobile menu button - using Sheet component */}
          <div className="flex items-center lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full flex flex-col px-3">
                <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
                  <div className="flex flex-col space-y-2 mt-16">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`py-2 px-3 rounded-md text-base font-medium ${
                          isActive(item.href)
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:text-primary hover:bg-accent"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto">
                    {/* Mobile auth buttons - same as large device */}
                    {isPending ? (
                      <div className="py-4 rounded-md text-base font-medium bg-gray-100 animate-pulse flex justify-center">
                        Loading...
                      </div>
                    ) : session ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="w-full flex items-center gap-2 cursor-pointer py-2 px-3 rounded-md text-foreground hover:text-primary hover:bg-accent"
                            type="button"
                            title="Open User Menu"
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
                            <span className="text-left flex-1 text-sm font-medium">
                              {sessionUser.name}
                            </span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-full min-w-[200px]"
                        >
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
                                  href="/admin"
                                  className="cursor-pointer flex items-center gap-2"
                                >
                                  <LayoutDashboard size={16} />
                                  <span>Admin Dashboard</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}

                          <DropdownMenuItem
                            onClick={handleSignOut}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <button
                        type="submit"
                        className="w-full text-left py-2 px-3 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent flex items-center"
                        onClick={async () => {
                          await authClient.signIn.social({
                            provider: "google",
                            callbackURL: "/", // Redirect to home after sign in
                          });
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Sign In</span>
                      </button>
                    )}

                    <div className="pt-4">
                      <PWAInstallButton />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
