"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useContent } from "@/contexts/ContentContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SpeechRecorder from "@/components/speech/SpeechRecorder";
import { MessageCircle, Send, Loader2, AlertCircle, RotateCcw } from "lucide-react";

// Simple markdown-to-HTML converter for basic formatting
const renderMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
    .replace(/\n/g, '<br>'); // Line breaks
};

interface ChatInterfaceProps {
  className?: string;
  "data-oid"?: string;
  "data-tour"?: string;
}

export default function ChatInterface({ className = "", "data-oid": dataOid, "data-tour": dataTour }: ChatInterfaceProps) {
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    initializeSession,
    setContext,
    clearChat,
  } = useChat();
  const { currentSection } = useContent();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat session after restoration is complete
  useEffect(() => {
    // Wait a bit for the restoration to complete, then initialize if needed
    const timer = setTimeout(() => {
      if (messages.length === 0) {
        initializeSession();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initializeSession, messages.length]);

  // Update chat context when section changes
  useEffect(() => {
    if (currentSection) {
      setContext(currentSection.id, currentSection.title);
    }
  }, [currentSection, setContext]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");

    // Send message with current section context
    const context = currentSection ? currentSection.id : undefined;
    await sendMessage(message, context);

    // Focus back to input
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const handleNewChat = () => {
    clearChat();
    // Initialize a new session after clearing
    setTimeout(() => {
      initializeSession();
    }, 100);
  };

  const handleSpeechTranscription = (transcribedText: string) => {
    // Set the transcribed text in the input field
    setInputValue(transcribedText);
    // Focus the input for user to review/edit if needed
    inputRef.current?.focus();
  };

  return (
    <div
      className={`flex flex-col h-full bg-white border-l border-gray-200 mb-12 ${className}`}
      data-oid={dataOid || "q4a.pob"}
      data-tour={dataTour}
    >
      {/* Chat Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50"
        data-oid="2zji9wu"
      >
        <div className="flex items-center space-x-2" data-oid="ecb_0uu">
          <MessageCircle className="w-5 h-5 text-blue-600" data-oid="tn7wxft" />
          <h3 className="font-semibold text-gray-900" data-oid="vwmju:6">
            AI Tutor
          </h3>
        </div>
        
        {currentSection && (
          <div
            className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded"
            data-oid="jixturm"
          >
            {currentSection.title}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-oid=".7f238.">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8" data-oid="-tk0_tl">
            <MessageCircle
              className="w-12 h-12 mx-auto mb-4 text-gray-300"
              data-oid="h7nlo9s"
            />

            <p data-oid="fq:xg1b">Start a conversation with your AI tutor!</p>
            <p className="text-sm mt-2" data-oid="ur6a76l">
              Ask questions about electricity concepts, get explanations, or
              request help with problems.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              data-oid="o4n6ln7"
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
                data-oid="je2.v-6"
              >
                <div 
                  className="whitespace-pre-wrap" 
                  data-oid="m2p_9.o"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                ></div>
                <div
                  className={`text-xs mt-1 opacity-70 ${
                    msg.role === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                  data-oid="e5dgg:h"
                >
                  {msg.timestamp?.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start" data-oid="6bsdis9">
            <div
              className="bg-gray-100 p-3 rounded-lg rounded-bl-sm"
              data-oid=".91zzq6"
            >
              <div className="flex items-center space-x-2" data-oid="29uy-8y">
                <Loader2
                  className="w-4 h-4 animate-spin text-gray-500"
                  data-oid="7be-113"
                />

                <span className="text-gray-500" data-oid="ck3qgpp">
                  Tutor is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} data-oid="fv5gb_l" />
      </div>

      {/* Error Display */}
      {error && (
        <div
          className="p-3 mx-4 mb-2 bg-red-50 border border-red-200 rounded-lg"
          data-oid="w6m0jfr"
        >
          <div className="flex items-center space-x-2" data-oid="tyhhna0">
            <AlertCircle className="w-4 h-4 text-red-500" data-oid="5b9q.-w" />
            <span className="text-red-700 text-sm" data-oid="9w8qdpw">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
        data-oid="kvnfk.f"
      >
        <div className="flex items-end space-x-2" data-oid="398ra6s">
          <div className="flex-1" data-oid="a1uynk0">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about electricity..."
              disabled={isLoading}
              className="resize-none"
              data-oid="kp1.l8u"
            />
          </div>
          
          {/* Speech Recording Button */}
          <SpeechRecorder
            onTranscriptionComplete={handleSpeechTranscription}
            disabled={isLoading}
            className="flex-shrink-0"
          />

          {/* New Chat Button - moved to input area */}
          {messages.length >= 2 && (
            <Button
              onClick={handleNewChat}
              variant="outline"
              size="sm"
              className="px-3 py-2"
              title="Start new conversation"
              type="button"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2"
            data-oid="9kye25y"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" data-oid="29r3oe4" />
            ) : (
              <Send className="w-4 h-4" data-oid="jl-12p1" />
            )}
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500" data-oid="tngdbgy">
            Press Enter to send, Shift+Enter for new line, or use voice 🎤
          </div>
          
          {/* Debug info in input area */}
          <div className="text-xs bg-yellow-100 px-2 py-1 rounded">
            Messages: {messages.length}
          </div>
        </div>
      </form>
    </div>
  );
}
