import { IConversation, IMessage } from "@/interfaces";
import { useState } from "react";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AgentClientsConversation = ({ Conversation }: { Conversation: IConversation }) => {
  const [textareaValue, setTextareaValue] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  // console.log(`Conversation:${JSON.stringify(Conversation, undefined, 2)}`);
  function handleSubmit() {
    socket.emit("agent-message", { clientId: Conversation.clientId, text: textareaValue });
    const message = {
      id: Date.now().toString(),
      text: textareaValue,
      clientId: user.clientId,
      timestamp: Date.now().toString(),
      isFromAgent: true,
    };
    Conversation.messages.push(message);
    setTextareaValue("");
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

  return (
    <div className=" relative border  h-full">
      <div className="flex flex-col overflow-y-auto scrollbar-hide h-[90%] pb-4 p-4  ">
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
            </div>
          );
        })}
      </div>

      <div className=" absolute w-[95%] left-[50%] transform -translate-x-1/2 bottom-[14px] rounded-[11px] bg-[#F5F5F5] border-[1px] border-[#BBBBBB] pt-2 pr-6 pb-2 pl-3 flex items-center justify-between">
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
  );
};

export default AgentClientsConversation;
