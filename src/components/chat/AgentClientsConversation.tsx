import { IConversation, IMessage } from "@/interfaces";
import React from "react";

const AgentClientsConversation = ({ Conversation }: { Conversation: any }) => {
  return (
    <div>
      <div className="flex-1 overflow-y-auto mb-4">
        {Conversation[0].messages.map((message: IMessage) => {
          return (
            <div key={message.id} className={`flex ${message.isFromAgent ? "justify-start" : "justify-end"} mb-2`}>
              <div
                className={`rounded-lg p-3 max-w-[15rem] ${
                  message.isFromAgent ? "bg-blue-500 text-white" : "bg-green-500 text-black"
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs text-black block mt-1">
                  {new Date(Number(message.timestamp)).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentClientsConversation;
