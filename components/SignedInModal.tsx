"use client";

import { useSignedInModal } from "@/hooks/use-signed-in-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";
import { SignIn, SignInButton, SignUpButton } from "@clerk/nextjs";

function SignedInModal() {
  const signedInModal = useSignedInModal();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={signedInModal.isOpen} onOpenChange={signedInModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Create an account</DialogTitle>
          <DialogDescription className="mx-auto space-y-2">
            {/* <div className="mb-4 text-center">to continue to companion.ai</div> */}
            <div className="flex">
              <CheckIcon size={20} className="mr-2 text-sky-500" />
              <div>Chat with AI Companions</div>
            </div>
            <div className="flex">
              <CheckIcon size={20} className="mr-2 text-sky-500" />
              <div>Create a Custom AI Companion</div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-center">
          <Button
            onClick={signedInModal.onClose}
            variant="default"
            className="mr-3"
          >
            <SignInButton />
          </Button>
          <Button onClick={signedInModal.onClose} variant="premium">
            <SignUpButton />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignedInModal;
