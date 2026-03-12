"use client"

import React from 'react'
import ChatbotSidebar from './ChatbotSidebar'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Chatbot from '../Chatbot';
import OrdersAccordian from '../order/OrdersAccordian';

const schema = z.object({
    message: z.string().max(400, "Message is too long"),
  });
  
  type InputData = {
    message: string;
  };

function ChatBotDemo() {
    const methods = useForm<InputData>({ resolver: zodResolver(schema) });
    const formValues = methods.watch();
  
    const handlePromptClick = (prompt: string) => {
      methods.setValue("message", prompt)
    };

  return (
    <div className="flex w-full h-full bg-white">
    <ChatbotSidebar onPromptClick={handlePromptClick} />
    <div className='flex flex-col w-3/4 h-full'>
    <Chatbot
      chatbotStyle='container'
      formMethods={methods}
      formValues={formValues}
    />
    <OrdersAccordian ordersClickable={false} ordersCopyable/>
    </div>
  </div>
  )
}

export default ChatBotDemo