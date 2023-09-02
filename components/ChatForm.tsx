"use client";

import { ChangeEvent, FormEvent, useRef } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";

interface ChatFormProps {
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
}

function ChatForm({
  input,
  handleInputChange,
  onSubmit,
  isLoading,
}: ChatFormProps) {
  const inputRef = useRef(null);
  return (
    <form
      onSubmit={onSubmit}
      className="fixed bottom-0 max-w-4xl w-[calc(100vw-32px)] border-t border-primary/10 py-4 flex items-center gap-x-2 z-30"
    >
      <Input
        ref={(ref) => ref && ref.focus()}
        onFocus={(e) => e.currentTarget.setSelectionRange(0, 0)}
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message"
        className="rounded-lg bg-primary/10"
      />
      <Button disabled={isLoading || !input} variant="ghost">
        <SendHorizonal className="h-6 w-6" />
      </Button>
    </form>
  );
}

export default ChatForm;
