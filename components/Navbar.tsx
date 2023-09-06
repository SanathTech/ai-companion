"use client";

import { Menu, Sparkles } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import MobileSidebar from "./MobileSidebar";
import { useProModal } from "@/hooks/use-pro-modal";
import { redirect, useRouter } from "next/navigation";
import { Router } from "next/router";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

interface NavbarProps {
  isPro: boolean;
  companionId: string | undefined;
  userId: string | undefined;
}

function Navbar({ isPro, companionId, userId }: NavbarProps) {
  const proModal = useProModal();
  const router = useRouter();

  return (
    <div className="fixed max-w-screen-2xl w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
      <div className="flex items-center">
        <MobileSidebar
          isPro={isPro}
          companionId={companionId}
          userId={userId}
        />
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className
            )}
          >
            companion.ai
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!userId ? (
          <div>
            <Button variant="default" size="sm" className="mr-3">
              <SignInButton />
            </Button>
            <Button variant="premium" size="sm">
              <SignUpButton />
            </Button>
          </div>
        ) : (
          !isPro && (
            <Button onClick={proModal.onOpen} variant="premium" size="sm">
              Upgrade
              <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
            </Button>
          )
        )}
        <ModeToggle />
        {userId && <UserButton afterSignOutUrl="/" />}
      </div>
    </div>
  );
}

export default Navbar;
