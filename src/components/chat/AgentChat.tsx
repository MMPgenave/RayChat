import { useState } from "react";
import { useSocketOn } from "@/hooks/socket-hooks";
import { IClient, IConversation } from "@/interfaces";
import AgentClientsConversation from "./AgentClientsConversation";
import { toast } from "react-toastify";
const AgentChat = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [specificUserConversation, setSpecificUserConversation] = useState<IConversation>({
    clientId: "",
    messages: [],
    unread: 0,
  });
  useSocketOn("existing-conversations", (data) => {
    setConversations(data.conversations);
    setClients(data.clients);
  });
  useSocketOn("user-connected", (data) => {
    const newClient = { id: data.clientId, socketId: "new", name: data.name };
    const newClients = [...clients, newClient];
    setClients(newClients);
    const conversationCopy = [...conversations];
    conversationCopy.push(data.conversation);
    setConversations(conversationCopy);
  });
  useSocketOn("new-user-message", (data) => {
    const ConversationsCopy = [...conversations];
    // find the coresponding client's message and attach the new-user-message to its message array

    for (let index = 0; index < ConversationsCopy.length; index++) {
      // console.log(`clientId:${JSON.stringify(ConversationsCopy[index].clientId, undefined, 2)}`);
      if (ConversationsCopy[index].clientId === data.conversation.clientId) {
        ConversationsCopy[index].messages.push(data.message);
        console.log(
          `ConversationsCopy[index].messages:${JSON.stringify(ConversationsCopy[index].messages, undefined, 2)}`
        );

        setSpecificUserConversation({ ...specificUserConversation, messages: ConversationsCopy[index].messages });
      }
    }
    setConversations(ConversationsCopy);
  });

  // console.log(`clients:${JSON.stringify(clients, undefined, 2)}`);
  // console.log(`conversations:${JSON.stringify(conversations, undefined, 2)}`);
  // console.log(`newUser:${JSON.stringify(newUser, undefined, 2)}`);

  function handleUserMessages(id: string) {
    const userConversation: IConversation | undefined = conversations.find(
      (conversation: IConversation) => conversation.clientId === id
    );
    if (userConversation) {
      setSpecificUserConversation(userConversation);
    } else {
      toast.error("User conversation not found");
    }
    console.log(`setSpecificUserConversation:${JSON.stringify(userConversation, undefined, 2)}`);
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
                    className={`py-1  border-b  text-center hover:font-bold hover:cursor-pointer ${
                      client.id === specificUserConversation.clientId && "bg-green-500"
                    }`}
                    onClick={() => handleUserMessages(client.id)}
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
      <div className=" flex-grow bg-[#F0F0F0] ">
        <AgentClientsConversation Conversation={specificUserConversation} />
      </div>
    </div>
  );
};

export default AgentChat;
