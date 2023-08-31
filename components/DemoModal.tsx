"use client";

import { useDemoModal } from "@/hooks/use-demo-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";

function DemoModal() {
  const demoModal = useDemoModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={demoModal.isOpen} onOpenChange={demoModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Chat Limit Reached!</DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <div>{"You've reached the chat limit for this demo."}</div>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DialogTitle className="text-center text-base">
          Thanks for trying my app!
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

export default DemoModal;
