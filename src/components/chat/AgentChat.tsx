import { useEffect, useState } from "react";
import { useSocketOn } from "@/hooks/socket-hooks";
import { IClient, IConversation } from "@/interfaces";
import AgentClientsConversation from "./AgentClientsConversation";
import { toast } from "react-toastify";
import { socket } from "@/socket";
const AgentChat = () => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [specificUserConversation, setSpecificUserConversation] = useState<IConversation>({
    clientId: "",
    messages: [],
    unread: 0,
  });
  const [activeClient, setActiveClient] = useState<number>(-1);

  useSocketOn("existing-conversations", (data) => {
    setConversations(data.conversations);
  });

  // اگر مکالمه از طرف کاربری میاد که الان ایجنت روی چتشه، چت رو رفرش کن که مکالمه نشون داده بشه
  useEffect(() => {
    for (let index = 0; index < conversations.length; index++) {
      if (conversations[index].clientId === specificUserConversation.clientId) {
        handleUserMessages(specificUserConversation.clientId);
      }
    }
  }, [activeClient !== -1 && conversations[activeClient].messages.length]);

  useSocketOn("user-connected", (data) => {
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
        ConversationsCopy[index] = data.conversation;
        setConversations(ConversationsCopy);
      }
    }
  });

  function handleUserMessages(id: string) {
    const conversationCopy = [...conversations];
    for (let index = 0; index < conversations.length; index++) {
      if (conversations[index].clientId === id) {
        setActiveClient(index);
        setSpecificUserConversation(conversations[index]);
        conversationCopy[index].unread = 0;
        break;
      }
    }
    setConversations(conversationCopy);
    socket.emit("reset unread to 0", id);
  }

  return (
    <div className=" flex h-[77vh]  ">
      <div className=" w-1/5  border">
        <div className=" text-[20px] border-b py-3  text-center">لیست کاربران</div>
        <div className=" flex flex-col ">
          {conversations ? (
            <div>
              {conversations.map((conversation: IConversation) => {
                const { clientId, unread } = conversation;
                return (
                  <div
                    className={` flex flex-row-reverse gap-3 hover:font-bold hover:cursor-pointer items-center justify-center py-1  border-b  ${
                      clientId === specificUserConversation.clientId && "bg-[#DBDBDB]"
                    } `}
                    key={clientId}
                    onClick={() => handleUserMessages(clientId)}
                  >
                    <div>{clientId}</div>
                    <div
                      className={`h-5 w-5 flex items-center justify-center text-xs rounded-full bg-green-600 text-white ${
                        unread === 0 && "hidden"
                      }`}
                    >
                      {unread}
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
      <div className=" w-4/5  bg-[#F0F0F0] ">
        {specificUserConversation.clientId !== "" && (
          <AgentClientsConversation Conversation={specificUserConversation} />
        )}
      </div>
    </div>
  );
};

export default AgentChat;
