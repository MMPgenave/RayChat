import { IConversation, IMessage } from "@/interfaces";
import { useState } from "react";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AgentClientsConversation = ({ Conversation }: { Conversation: IConversation }) => {
  const [textareaValue, setTextareaValue] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  console.log(`Conversation:${JSON.stringify(Conversation, undefined, 2)}`);
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
    <div className=" relative h-[380px]">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-4 h-[320px] p-2">
        {Conversation.messages.map((message: IMessage) => {
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

      <div className=" absolute w-full bottom-[0px] rounded-sm bg-[#E0E0E0] pt-2 pr-6 pb-2 pl-3 flex items-center justify-between">
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
