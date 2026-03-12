"use client"

import { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";

interface SidebarProps {
  onPromptClick: (prompt: string) => void;
}

interface Section {
  id: string;
  title: string;
  description: string;
  prompts: string[];
}

export default function Sidebar({ onPromptClick }: SidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('db-tool');

  const sections: Section[] = [
    {
      id: 'db-tool',
      title: 'Order Lookup & Database Queries',
      description: 'Retrieve order status, purchased products, and shipping details. You can query up to 3 orders at once.',
      prompts: [
        'Check the status of order {order_number}',
        'What items did I buy in order {order_number}?',
        'Where is order {order_number} being shipped?',
        'Show the details for orders {order_number}, {order_number}, and {order_number}',
        'Check the status of these orders: {order_number}, {order_number}',
        'Summarize everything in order {order_number}',
        'What products are in orders {order_number} and {order_number}?',
        'Which address is order {order_number} being delivered to?'
      ]
    },
    {
      id: 'rag',
      title: 'Product & Store Knowledge',
      description: 'Ask questions about products, sizing, shipping, and store policies.',
      prompts: [
        'What is Drippy Dino Tees and what kind of products do they sell?',
        'Tell me about the Cloud Syntax Tee, including material, fit, and available colors.',
        'Compare the Cloud Syntax Tee and Samurai Error 404 Tee.',
        'What sizes are available for the Dino Minimal Logo Tee and how should I size down for regular fit?',
        'How long does shipping take in Singapore and what are the costs for express or international shipping?',
        'What is your return and exchange policy, including time limits and conditions?',
        'Do your prints crack after washing and how should I care for the shirts?',
        'When is the next product drop and where can I find announcements?'
      ]
    },
    {
      id: 'auth',
      title: 'Order Access & Authorization',
      description: 'Access protected order information. You must provide a valid {order_number} and be logged in. Data will not be returned if your session is expired or invalid.',
      prompts: [
        'Show details for order {order_number}.',
        'What is the status of order {order_number}?',
        'List the items and quantities in order {order_number}.',
        'How much did order {order_number} cost including shipping?',
        'Show the shipping address for order {order_number}.',
        'What payment method was used for order {order_number}?',
        'What happens if I try to fetch order {order_number} while logged out?',
        'Can I access order {order_number} if I am not the owner?'
      ]
    }
  ];

  return (
    <div className="w-1/4 h-full bg-[#FAFAFA] border-r border-[#E5E5E5] flex flex-col overflow-y-auto">
      <div className="px-6 py-8 border-b border-[#E5E5E5] sticky top-0 bg-[#FAFAFA]">
        <h1 className="text-lg font-semibold text-black mb-1">
          Chatbot Demo
        </h1>
        <p className="text-sm text-gray-500">
          Database · RAG · Authorization · Voice chat
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="border border-[#E5E5E5] rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-sm text-black">
                    {section.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {section.description}
                  </p>
                </div>
                <FaChevronDown className="w-4 h-4" />
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-[#E5E5E5] bg-white p-3 space-y-2">
                  {section.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => onPromptClick(prompt)}
                      className="w-full px-3 py-2.5 text-left text-sm text-black bg-white border border-[#E5E5E5] rounded-[10px] hover:bg-black hover:text-white hover:border-black transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
