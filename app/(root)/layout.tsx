import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";

async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const isPro = await checkSubscription();
  const companion = await prismadb.companion.findFirst({
    where: {
      userId: user?.id,
    },
  });
  return (
    <div className="h-full max-w-screen-2xl mx-auto">
      <Navbar isPro={isPro} companionId={companion?.id} userId={user?.id} />
      <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
        <Sidebar isPro={isPro} companionId={companion?.id} userId={user?.id} />
      </div>
      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
}

export default RootLayout;
