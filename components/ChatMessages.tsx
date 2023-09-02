"use client";

import { Companion } from "@prisma/client";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { ElementRef, useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  companion: Companion;
}

function ChatMessages({
  messages = [],
  isLoading,
  companion,
}: ChatMessagesProps) {
  const scrollRef = useRef<ElementRef<"div">>(null);
  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex flex-col justify-end flex-1 pt-16 pb-[72px]">
      <ChatMessage
        isLoading={fakeLoading}
        src={companion.src}
        role="system"
        content={`Hello, I am ${companion.name}, ${companion.description}`}
      />
      {messages.map((message, idx) => (
        <ChatMessage
          role={message.role}
          key={message.content + idx.toString()}
          content={message.content}
          src={companion.src}
        />
      ))}
      {isLoading && <ChatMessage role="system" src={companion.src} isLoading />}
      <div ref={scrollRef} />
    </div>
  );
}

export default ChatMessages;
