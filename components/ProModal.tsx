"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { CheckIcon } from "lucide-react";

function ProModal() {
  const proModal = useProModal();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubscribe = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Upgrade to Pro</DialogTitle>
          <DialogDescription className="mx-auto space-y-2">
            <div className="mb-4 text-center">
              {"(Don't worry it's free for this demo)"}
            </div>
            <div className="flex">
              <CheckIcon size={20} className="mr-2 text-sky-500" />
              <div>
                Create a{" "}
                <span className="text-sky-500 font-medium">Custom AI</span>{" "}
                Companion
              </div>
            </div>
            <div className="flex">
              <CheckIcon size={20} className="mr-2 text-sky-500" />
              <div>
                Increase your{" "}
                <span className="text-sky-500 font-medium">Chat Limit</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className="text-2xl font-medium">
            $9<span className="text-sm font-normal">.99/mo</span>
          </p>
          <Button disabled={loading} onClick={onSubscribe} variant="premium">
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProModal;
