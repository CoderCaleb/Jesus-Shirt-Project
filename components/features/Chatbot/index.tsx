"use client";

import React from "react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { fetchHelper } from "@/helpers/fetchHelper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import { z } from "zod";
import { VscDebugRestart } from "react-icons/vsc";
import { IoCall } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa6";
import Markdown from 'react-markdown'
import {
  AgentState,
  DisconnectButton,
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useTrackTranscription,
  useVoiceAssistant,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import {
  LocalParticipant,
  MediaDeviceFailure,
  Participant,
  Track,
  TranscriptionSegment,
} from "livekit-client";
import { BiLoaderAlt } from "react-icons/bi";
import "@livekit/components-styles";

const schema = z.object({
  message: z.string().max(400, "Message is too long"),
});

type InputData = {
  message: string;
};

type ChatResponse = {
  answer: string;
  conversation_id: string;
};

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

type ChatMessage = {
  sender: string;
  text: string;
  id?: string;
  isSelf?: boolean;
  timestamp: number;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "AI", text: "Hi, how can I help you today?", timestamp: Date.now() },
  ]);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [voiceConnecting, setVoiceConnecting] = useState(false);
  const [transcripts] = useState<Map<string, ChatMessage>>(
    new Map()
  );

  const [connectionDetails, updateConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");

  const methods = useForm<InputData>({ resolver: zodResolver(schema) });
  const formValues = methods.watch();

  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Create a reference to the chat container
  useEffect(() => {
    console.log(conversationId);
  }, [conversationId]);
  const onConnectButtonClicked = async () => {
    setVoiceConnecting(true);
    try {
      const response = await fetchHelper<ConnectionDetails>(
        "http://localhost:4242/get_connection_details"
      );
      updateConnectionDetails(response);
      setConversationId(null);
      setMessages([]);
    } finally {
      setVoiceConnecting(false);
    }
  };

  const onCloseButtonClicked = () => {
    setConversationId(null);
    setMessages([{ sender: "AI", text: "Hi, how can I help you today?", timestamp: Date.now() }]);
  };
  const handleSendMessage = async (data: InputData) => {
    const { message } = data;
    methods.reset();
    if (message.trim()) {
      try {
        setLoading(true);
        setMessages((prev) => [...prev, { sender: "USER", text: message, timestamp: Date.now() }]);
        const response = await fetchHelper<ChatResponse>(
          "http://localhost:4242/send-dify-chat-message",
          {
            method: "POST",
            body: {
              query: message,
              conversation_id: conversationId?conversationId:null,
            },
          }
        );
        console.log("Chat response:", response);
        setConversationId(response.conversation_id);
        setMessages((prev) => [
          ...prev,
          { sender: "AI", text: response.answer, timestamp: Date.now() },
        ]);
      } catch (e: unknown) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "SYSTEM",
            text: "An error occurred. Please try again",
            type: "error",
            timestamp: Date.now()
          },
        ]);
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenChatBot = () => {
    setChatBotOpen(!chatBotOpen);
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    console.log("Messages", messages);
  }, [messages]);

  useEffect(() => {
    console.log("Connection details", connectionDetails);
    transcripts.clear();
  }, [connectionDetails]);

  useEffect(() => {
    console.log("Updated agentState in parent:", agentState);
  }, [agentState]);

  return (
    <LiveKitRoom
      token={connectionDetails?.participantToken}
      serverUrl={connectionDetails?.serverUrl}
      connect={connectionDetails !== undefined}
      audio={true}
      video={false}
      onMediaDeviceFailure={onDeviceFailure}
      onDisconnected={() => {
        updateConnectionDetails(undefined);
        onCloseButtonClicked();
      }}
      className="grid grid-rows-[2fr_1fr] items-center"
      data-lk-theme="default"
    >
      <div className="text-black">
        {/* Button */}
        <button
          className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          onClick={handleOpenChatBot}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white block border-gray-200 align-middle"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
        </button>

        {/* Chat Container */}
        {chatBotOpen && (
          <div className="fixed flex flex-col bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[calc(80vh-64px)] shadow-slate-200 shadow-md">
            {/* Heading */}
            <div className="flex flex-col space-y-1.5 pb-2">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg tracking-tight text-black">
                  Chatbot
                </h2>
                <div>
                  <VscDebugRestart
                    className=" fill-slate-500 cursor-pointer"
                    onClick={() => {
                      setConversationId(null);
                      setMessages([
                        { sender: "AI", text: "Hi, how can I help you today?", timestamp: Date.now() },
                      ]);
                      updateConnectionDetails(undefined);
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-[#6b7280] leading-3">
                Ask away about our products!
              </p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto pr-4" ref={chatContainerRef}>
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.sender !== "SYSTEM" ? (
                    index===0||messages[index - 1].sender !== msg.sender?<div className="flex gap-3 mt-8 text-gray-600 text-sm h-min">
                      
                        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                          <div className="rounded-full bg-gray-100 border p-1 w-full h-full">
                            {msg.sender === "AI" && (
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
                            )}
                            {msg.sender === "USER" && (
                              <FaUser className="w-[20px] h-[20px] p-1" />
                            )}
                          </div>
                        </span>
                      
                        <p className="">
                          <span className="block font-bold text-gray-700">
                            {msg.sender}
                          </span>
                            <React.Fragment key={index}>
                              <Markdown>{msg.text}</Markdown>
                            </React.Fragment>
                        </p>
                      
                    </div>:<p className="leading-relaxed text-gray-600 text-sm ml-11">{msg.text}</p>
                  
                  ) : (
                    <p className="text-sm text-red-500 font-medium my-4">
                      {msg.text}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Input box */}
            <div className="flex items-center h-10 relative">
              <FormProvider {...methods}>
                {!connectionDetails ? (
                  <form
                    className="flex items-center justify-center w-full space-x-2"
                    onSubmit={methods.handleSubmit(handleSendMessage)}
                  >
                    <InputField
                      name="message"
                      placeholder="Enter your message"
                      additionalStyles="w-full"
                      buttonInInput={
                        <Button
                          type="submit"
                          isDisabled={!formValues?.message?.trim() || loading}
                          disabledLoader={!loading ? false : true}
                          buttonIcon={
                            <FaArrowUp className="m-auto fill-white" />
                          }
                          additionalStyles="max-h-8 max-w-8 !rounded-xl"
                        />
                      }
                    />

                    <div
                      className={`flex justify-center items-center aspect-square h-10 w-10 rounded-[10px] hover:opacity-80 active:opacity-60 bg-blue-600 cursor-pointer ${voiceConnecting ? "opacity-70" : ""}`}
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
                    <SimpleVoiceAssistant onStateChange={setAgentState} />
                    <Transcription
                      setMessagesAction={setMessages}
                      transcripts={transcripts}
                    />
                  </>
                )}
              </FormProvider>
            </div>
          </div>
        )}
      </div>
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

function ControlBar(props: { setAgentState: (state: AgentState) => void }) {
  const { state } = useVoiceAssistant();
  useEffect(() => {
    console.log("state:", state);
    props.setAgentState(state);
  }, [props, state]);

  return (
    <>
      {state !== "disconnected" && state !== "connecting" && (
        <>
          <VoiceAssistantControlBar controls={{ leave: false }} />
          <DisconnectButton>
            <CloseIcon />
          </DisconnectButton>
        </>
      )}
    </>
  );
}

function SimpleVoiceAssistant({
  onStateChange,
}: {
  onStateChange: (state: AgentState) => void;
}) {
  const { state } = useVoiceAssistant();
  useEffect(() => {
    onStateChange(state);
    console.log("state:", state);
  }, [onStateChange, state]);
  return (
    <div className="flex w-full h-full items-center justify-center">
      {state === "initializing" ||
      state === "connecting" ||
      state === "disconnected" ? (
        "Connecting..."
      ) : (
        <ControlBar setAgentState={onStateChange} />
      )}
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

export function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.33398 3.33334L12.6673 12.6667M12.6673 3.33334L3.33398 12.6667"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="square"
      />
    </svg>
  );
}

export function Transcription({
  setMessagesAction,
  transcripts,
}: {
  setMessagesAction: Dispatch<SetStateAction<ChatMessage[]>>;
  transcripts: Map<string, ChatMessage>;
}) {
  const voiceAssistant = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const agentMessages = useTrackTranscription(voiceAssistant.audioTrack);
  const localMessages = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  useEffect(() => {
    agentMessages.segments.forEach((s) =>
      transcripts.set(
        s.id,
        segmentToChatMessage(
          s,
          transcripts.get(s.id),
          voiceAssistant.audioTrack?.participant
        )
      )
    );
    localMessages.segments.forEach((s) =>
      transcripts.set(
        s.id,
        segmentToChatMessage(
          s,
          transcripts.get(s.id),
          localParticipant.localParticipant
        )
      )
    );

    const allMessages = Array.from(transcripts.values());
    allMessages.sort((a, b) => a.timestamp - b.timestamp);
    setMessagesAction(allMessages);
  }, [
    transcripts,
    localParticipant.localParticipant,
    voiceAssistant.audioTrack?.participant,
    agentMessages.segments,
    localMessages.segments,
    setMessagesAction,
  ]);

  return <></>;
}

function segmentToChatMessage(
  s: TranscriptionSegment,
  existingMessage: ChatMessage | undefined,
  participant: Participant | undefined
): ChatMessage {
  const msg: ChatMessage = {
    text: s.final ? s.text : `${s.text} ...`,
    sender: participant instanceof LocalParticipant ? "USER" : "AI",
    isSelf: participant instanceof LocalParticipant,
    timestamp: existingMessage?.timestamp ?? Date.now(),
  };
  return msg;
}

export default ChatBot;
