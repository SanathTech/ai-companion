"use client";

import ChatHeader from "@/components/ChatHeader";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompletion } from "ai/react";
import ChatForm from "@/components/ChatForm";
import ChatMessages from "@/components/ChatMessages";
import { ChatMessageProps } from "@/components/ChatMessage";
import { useProModal } from "@/hooks/use-pro-modal";
import { useDemoModal } from "@/hooks/use-demo-modal";
import axios from "axios";

interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
  isPro: boolean;
}

function ChatClient({ companion, isPro }: ChatClientProps) {
  const proModal = useProModal();
  const demoModal = useDemoModal();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onResponse(response: Response) {
        if (response?.status === 403) {
          console.log("Chat Limit Reached.");
          if (!isPro) {
            console.log("Free Chat Limit Reached");
            proModal.onOpen();
          }
          if (isPro) {
            console.log("Pro Chat Limit Reached");
            demoModal.onOpen();
          }
          setMessages((current) => current.slice(0, -1));
        }
      },
      onFinish(_prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };

        setMessages((current) => [...current, systemMessage]);

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);

    setInput("");

    handleSubmit(e);
  };

  const resetConversation = async () => {
    try {
      const response = await axios.delete(`/api/chat/${companion.id}`);
      if (response.status === 200) {
        setMessages([]);
        setInput("");
      }
    } catch (error) {
      console.error("Failed to reset conversation:", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="fixed top-0 left-0 h-[76.8px] sm:h-[80.8px] w-full bg-secondary z-10" />
      <ChatHeader companion={companion} resetConversation={resetConversation} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <div className="fixed bottom-0 left-0 h-[72.8px] w-full bg-secondary z-10" />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default ChatClient;
