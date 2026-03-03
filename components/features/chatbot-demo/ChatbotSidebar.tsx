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
      title: 'Database Tool Calls',
      description: 'Query and modify order data.',
      prompts: [
        'Show my recent orders',
        'Add a test order for $200',
        'Delete order #3',
        'Summarize my order history'
      ]
    },
    {
      id: 'rag',
      title: 'RAG Knowledge Retrieval',
      description: 'Retrieve information from the knowledge base.',
      prompts: [
        'Explain the refund policy',
        'Summarize company guidelines',
        'What are the shipping rules?',
        'Compare standard vs express delivery'
      ]
    },
    {
      id: 'auth',
      title: 'Authorization & Sensitive Data',
      description: 'Test access control for protected user information.',
      prompts: [
        'What is my full name?',
        'What is my saved address?'
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
