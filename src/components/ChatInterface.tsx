"use client";

import { useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ChatInterface() {
  const { messages, sendMessage, isLoading, error, initializeSession } =
    useChat();

  // Initialize chat session on component mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[name="message"]');
    if (input) {
      sendMessage(input.value);
      input.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full justify-between" data-oid="af9v6fr">
      <div className="overflow-y-auto p-4" data-oid="atl5t.g">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${msg.role === "assistant" ? "bg-gray-100" : "bg-electric-50"} my-2 rounded-md shadow-sm`}
            data-oid="4db3lnb"
          >
            <strong data-oid="81hg71l">
              {msg.role === "assistant" ? "Tutor" : "You"}:
            </strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <form
        className="p-4 flex items-center gap-2 border-t"
        onSubmit={handleSendMessage}
        data-oid="kiqjzr6"
      >
        <Input
          name="message"
          placeholder="Type your message..."
          className="flex-grow"
          disabled={isLoading}
          data-oid="vkk8_fb"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isLoading}
          data-oid="n:8fxxm"
        >
          Send
        </Button>
      </form>

      {error && (
        <p className="p-4 text-red-500" data-oid="rgm8-um">
          {error}
        </p>
      )}
    </div>
  );
}
