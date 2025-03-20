import { IConversation, IMessage } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocketOn } from "@/hooks/socket-hooks";

const AgentClientsConversation = ({ Conversation }: { Conversation: IConversation }) => {
  const [textareaValue, setTextareaValue] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const chatContainerRef = useRef(null);
  function handleSubmit() {
    socket.emit("agent-message", { clientId: Conversation.clientId, text: textareaValue });
  }

  function enterKeyHandler(event: any) {
    if (!textareaValue && event.key === "Enter") {
      event.preventDefault();
    }
    if (textareaValue && event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  }

  useSocketOn("agent-message-to-agent", (Message) => {
    Conversation.messages.push(Message);
    setTextareaValue("");
  });

  // when the chat rendered, go automatically to bottom of this chat
  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [Conversation.messages.length]);

  return (
    <div className="  border h-full ">
      <div className="flex flex-col overflow-y-auto scrollbar-hide h-[90%] pb-12 p-4  ">
        {Conversation.messages.map((message: IMessage) => {
          return (
            <div key={message.id} className={`flex ${message.isFromAgent ? "justify-start" : "justify-end"} mb-2`}>
              <div className={`flex flex-col  ${message.isFromAgent ? " " : " items-end"}`}>
                <p
                  className={` p-3 max-w-[15rem] text-[16px] rounded-t-[12px] ${
                    message.isFromAgent
                      ? "bg-white text-black rounded-bl-[12px]"
                      : "bg-[#841474] text-white  rounded-br-[12px] "
                  }`}
                >
                  {message.text}
                </p>
                <span className="text-[10px] text-black block mt-1">
                  {new Date(Number(message.timestamp)).toLocaleTimeString()}
                </span>
              </div>
              {/* Empty div to act as a scroll target */}
              <div ref={chatContainerRef}></div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <div className=" absolute w-[95%] left-[50%] transform -translate-x-1/2 -bottom-[35px] rounded-[11px] bg-[#F5F5F5] border-[1px] border-[#BBBBBB] pt-2 pr-6 pb-2 pl-3 flex items-center justify-between">
          <textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            onKeyDown={(e) => enterKeyHandler(e)}
            maxLength={200}
            className="w-full text-[15px] text-black pt-[10px] text-justify overflow-hidden leading-[1.4] border-none outline-none bg-inherit resize-none"
            autoFocus
            placeholder="اینجا بنویسید ..."
          ></textarea>
          <button
            type="button"
            disabled={!textareaValue}
            onClick={() => {
              handleSubmit();
            }}
          >
            <img
              src={`${textareaValue ? "/icons/telegram-send-active.svg" : "/icons/telegram-send.svg"}`}
              width={30}
              height={30}
              alt="send"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentClientsConversation;
