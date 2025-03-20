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
        // console.log(
        //   `ConversationsCopy[index].messages:${JSON.stringify(ConversationsCopy[index].messages, undefined, 2)}`
        // );
        setConversations(ConversationsCopy);
      }
    }
  });

  // console.log(`clients:${JSON.stringify(clients, undefined, 2)}`);
  console.log(`conversations:${JSON.stringify(conversations, undefined, 2)}`);
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

  // extract unread from conversation and display it in the client list
  const unread = conversations.map((conversation) => conversation.unread);

  return (
    <div className=" flex h-[87vh]  ">
      <div className=" w-1/5  border">
        <div className=" text-[20px] border-b py-3  text-center">لیست کاربران</div>
        <div className=" flex flex-col ">
          {clients ? (
            <div>
              {clients.map((client: { id: string; socketId: string; name: string }, index) => {
                return (
                  <div
                    className={` flex flex-row-reverse gap-3 hover:font-bold hover:cursor-pointer items-center justify-center py-1  border-b  ${
                      client.id === specificUserConversation.clientId && "bg-[#DBDBDB]"
                    } `}
                    key={client.id}
                    onClick={() => handleUserMessages(client.id)}
                  >
                    <div>{client.name}</div>
                    <div
                      className={`h-5 w-5 flex items-center justify-center text-xs rounded-full bg-green-600 text-white ${
                        unread[index] === 0 && "hidden"
                      }`}
                    >
                      {unread[index] !== 0 && unread[index]}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>فعلا کاربری با سوکت متصل نشده است</div>
          )}
        </div>
      </div>
      <div className=" w-4/5 bg-[#F0F0F0] ">
        {specificUserConversation.clientId !== "" && (
          <AgentClientsConversation Conversation={specificUserConversation} />
        )}
      </div>
    </div>
  );
};

export default AgentChat;
