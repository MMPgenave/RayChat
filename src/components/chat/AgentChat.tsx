import { useState } from "react";
import { useSocketOn } from "@/hooks/socket-hooks";
import { useCallback } from "react";
import { IClient, IMessage, IConversation } from "@/interfaces";
import AgentClientsConversation from "./AgentClientsConversation";
const AgentChat = () => {
  const [clients, setClients] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState([]);
  useSocketOn(
    "existing-conversations",
    useCallback((data) => {
      setConversations(data.conversations);
      setClients(data.clients);
    }, [])
  );

  console.log(`clients:${JSON.stringify(clients, undefined, 2)}`);
  console.log(`conversations:${JSON.stringify(conversations, undefined, 2)}`);

  function handleUserConversations(id: string) {
    const userConversation = conversations.filter((conversation: IConversation) => conversation.clientId === id);
    setConversation(userConversation);
    console.log(`user conversation:${JSON.stringify(userConversation, undefined, 2)}`);
  }
  return (
    <div className=" flex">
      <div className=" w-1/5  border">
        <div className=" text-[20px] border-b py-3  text-center">لیست کاربران</div>
        <div className=" flex flex-col ">
          {clients ? (
            <div className="  ">
              {clients.map((client: { id: string; socketId: string; name: string }) => {
                return (
                  <div
                    key={client.id}
                    className=" py-1  border-b  text-center hover:bg-[#E3E3E3] hover:cursor-pointer"
                    onClick={() => handleUserConversations(client.id)}
                  >
                    {client.name}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>فعلا کاربری با سوکت متصل نشده است</div>
          )}
        </div>
      </div>
      <div className=" flex-grow bg-[#F0F0F0]">
        <AgentClientsConversation Conversation={conversation} />
      </div>
    </div>
  );
};

export default AgentChat;
