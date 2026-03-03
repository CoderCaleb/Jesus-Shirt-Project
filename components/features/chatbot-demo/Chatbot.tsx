"use client"

import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import ChatbotUI from "../Chatbot/ChatbotUI";
import { ChatMessage } from "../Chatbot/types";

  type InputData = {
    message: string;
  };

  type ChatbotProps = {
    formMethods: UseFormReturn<InputData, any, undefined>,
    formValues: InputData
  }

function Chatbot({formMethods:methods, formValues}:ChatbotProps) {
  // ─── Form ─────────────────────────────────────────────

  // ─── Chat State ───────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "AI",
      text: "Hi 👋 How can I help you today?",
      timestamp: Date.now(),
    },
  ]);

  const [loading, setLoading] = useState(false);

  // ─── Voice State (placeholder for now) ───────────────
  const [voiceConnecting, setVoiceConnecting] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<unknown | null>(
    null
  );

  // ─── Scroll Ref ───────────────────────────────────────
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // ─── Send Message ─────────────────────────────────────
  const onSendMessage = async (data: { message: string }) => {
    if (!data.message.trim()) return;

    const userMessage: ChatMessage = {
      sender: "USER",
      text: data.message,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    methods.reset();

    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        sender: "AI",
        text: `You said: **${data.message}**`,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  // ─── Voice Button Click ───────────────────────────────
  const onConnectButtonClicked = async () => {
    setVoiceConnecting(true);

    // Simulate connecting
    setTimeout(() => {
      setConnectionDetails({ connected: true });
      setVoiceConnecting(false);
    }, 1500);
  };

  // ─── Reset Chat ───────────────────────────────────────
  const onReset = () => {
    setMessages([
      {
        sender: "AI",
        text: "Chat reset. How can I help you?",
        timestamp: Date.now()
      },
    ]);
    setConnectionDetails(null);
    methods.reset();
  };

  return (
    <div className="w-full flex-1">
    <ChatbotUI
      messages={messages}
      methods={methods}
      formValues={formValues}
      loading={loading}
      voiceConnecting={voiceConnecting}
      connectionDetails={connectionDetails}
      chatContainerRef={chatContainerRef}
      onSendMessage={onSendMessage}
      onConnectButtonClicked={onConnectButtonClicked}
      onReset={onReset}
      voiceAssistantSlot={<div>🎙 Voice Assistant Active</div>}
      transcriptionSlot={<div>Listening...</div>}
      title="Chatbot"
      subtitle="Ask away about our products!"
      styleMode="container"
    />
    </div>
  );
}

export default Chatbot;