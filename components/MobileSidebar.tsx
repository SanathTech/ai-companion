import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  isPro: boolean;
  companionId: string | undefined;
  userId: string | undefined;
}

function MobileSidebar({ isPro, companionId, userId }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4">
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 bg-secondary pt-10 w-32 flex justify-center"
      >
        <SheetClose>
          <Sidebar isPro={isPro} companionId={companionId} userId={userId} />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar;
