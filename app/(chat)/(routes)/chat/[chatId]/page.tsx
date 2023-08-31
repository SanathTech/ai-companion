import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ChatClient from "../components/ChatClient";
import { checkSubscription } from "@/lib/subscription";

interface ChatIdPageProps {
  params: {
    chatId: string;
  };
}

async function ChatIdPage({ params }: ChatIdPageProps) {
  const { userId } = auth();
  const isPro = await checkSubscription();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!companion) {
    return redirect("/");
  }
  return <ChatClient companion={companion} isPro={isPro} />;
}

export default ChatIdPage;
