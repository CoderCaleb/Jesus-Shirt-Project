
export type MessageSender = "AI" | "USER" | "SYSTEM";
export type ChatMessage = {
    sender: MessageSender;
    text: string;
    id?: string;
    isSelf?: boolean;
    timestamp: number;
  };
  