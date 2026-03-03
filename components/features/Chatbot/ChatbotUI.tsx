import React from "react";
import { FormProvider } from "react-hook-form";
import Markdown from "react-markdown";
import { VscDebugRestart } from "react-icons/vsc";
import { FaUser, FaArrowUp } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import { UseFormReturn } from "react-hook-form";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { ChatMessage, MessageSender } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatbotUIProps {
  /** All chat messages to display */
  messages: ChatMessage[];

  /** react-hook-form methods instance */
  methods: UseFormReturn<{ message: string }>;

  /** Current value of the message form field */
  formValues: { message?: string };

  /** Whether a message is being sent / AI is responding */
  loading: boolean;

  /** Whether the voice call is currently connecting */
  voiceConnecting: boolean;

  /** LiveKit / voice connection details — null when voice is inactive */
  connectionDetails: unknown | null;

  /** Ref forwarded to the scrollable chat container */
  chatContainerRef: React.RefObject<HTMLDivElement>;

  /** Called when the user submits a text message */
  onSendMessage: (data: { message: string }) => void;

  /** Called when the voice-call button is clicked */
  onConnectButtonClicked: () => void;

  /** Called when the reset / restart button is clicked */
  onReset: () => void;

  /** Slot: renders the voice assistant when a connection is active */
  voiceAssistantSlot?: React.ReactNode;

  /** Slot: renders the transcription component when a connection is active */
  transcriptionSlot?: React.ReactNode;

  // ── Optional customisation ────────────────────────────────────────────────
  title?: string;
  subtitle?: string;

  styleMode?: "pop-up" | "container"
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const AIIcon = () => (
  <svg
    stroke="none"
    fill="black"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    aria-hidden="true"
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const SenderAvatar = ({ sender }: { sender: MessageSender }) => (
  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
    <div className="rounded-full bg-gray-100 border p-1 w-full h-full">
      {sender === "AI" && <AIIcon />}
      {sender === "USER" && <FaUser className="w-[20px] h-[20px] p-1" />}
    </div>
  </span>
);

// ─── Main component ───────────────────────────────────────────────────────────

function ChatbotUI({
  messages,
  methods,
  formValues,
  loading,
  voiceConnecting,
  connectionDetails,
  chatContainerRef,
  onSendMessage,
  onConnectButtonClicked,
  onReset,
  voiceAssistantSlot,
  transcriptionSlot,
  title = "Chatbot",
  subtitle = "Ask away about our products!",
  styleMode="pop-up"
}: ChatbotUIProps) {
  return (
    <div className={`${styleMode=="pop-up"?"fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 w-[440px] h-[calc(80vh-64px)]":"w-full h-full"} flex flex-col bg-white p-6 rounded-lg border border-[#e5e7eb] shadow-slate-200 shadow-md`}>
      {/* ── Heading ── */}
      <div className="flex flex-col space-y-1.5 pb-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg tracking-tight text-black">
            {title}
          </h2>
          <VscDebugRestart
            className="fill-slate-500 cursor-pointer"
            onClick={onReset}
          />
        </div>
        <p className="text-sm text-[#6b7280] leading-3">{subtitle}</p>
      </div>

      {/* ── Chat messages ── */}
      <div className="flex-1 overflow-y-auto pr-4" ref={chatContainerRef}>
        {messages.map((msg, index) => {
          if (msg.sender === "SYSTEM") {
            return (
              <p key={index} className="text-sm text-red-500 font-medium my-4">
                {msg.text}
              </p>
            );
          }

          const isFirstInGroup =
            index === 0 || messages[index - 1].sender !== msg.sender;

          return isFirstInGroup ? (
            <div key={index} className="flex gap-3 mt-8 text-gray-600 text-sm h-min">
              <SenderAvatar sender={msg.sender} />
              <p>
                <span className="block font-bold text-gray-700">
                  {msg.sender}
                </span>
                <React.Fragment>
                  <Markdown>{msg.text}</Markdown>
                </React.Fragment>
              </p>
            </div>
          ) : (
            <p key={index} className="leading-relaxed text-gray-600 text-sm ml-11">
              {msg.text}
            </p>
          );
        })}
      </div>

      {/* ── Input box ── */}
      <div className="flex items-center h-10 relative">
        <FormProvider {...methods}>
          {!connectionDetails ? (
            <form
              className="flex items-center justify-center w-full space-x-2"
              onSubmit={methods.handleSubmit(onSendMessage)}
            >
              {/* Replace InputField / Button with your own components as needed */}
              <InputField
                name="message"
                placeholder="Enter your message"
                additionalStyles="w-full"
                buttonInInput={
                  <Button
                    type="submit"
                    isDisabled={!formValues?.message?.trim() || loading}
                    disabledLoader={!loading ? false : true}
                    buttonIcon={<FaArrowUp className="m-auto fill-white" />}
                    additionalStyles="max-h-8 max-w-8 !rounded-xl"
                  />
                }
              />

              <div
                className={`flex justify-center items-center aspect-square h-10 w-10 rounded-[10px] hover:opacity-80 active:opacity-60 bg-blue-600 cursor-pointer ${
                  voiceConnecting ? "opacity-70" : ""
                }`}
                onClick={onConnectButtonClicked}
              >
                {!voiceConnecting ? (
                  <IoCall fill="white" />
                ) : (
                  <BiLoaderAlt
                    className="m-auto animate-spin"
                    size="25"
                    color="white"
                  />
                )}
              </div>
            </form>
          ) : (
            <>
              {voiceAssistantSlot}
              {transcriptionSlot}
            </>
          )}
        </FormProvider>
      </div>
    </div>
  );
}

export default ChatbotUI;