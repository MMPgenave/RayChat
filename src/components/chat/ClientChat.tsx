import React, { useState } from "react";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocketOn } from "@/hooks/socket-hooks";
import { IMessage } from "@/interfaces";
const initialMessage = [
  {
    id: "1",
    text: "سلام. اگر سوالی در مورد رایچت دارید ، از ما بپرسید! 👋",
    clientId: "123",
    timestamp: Date.now(),
    isFromAgent: true,
  },
];

const Chat = () => {
  const [textareaValue, setTextareaValue] = useState("");
  const [messages, setMessages] = useState(initialMessage);
  const user = useSelector((state: RootState) => state.auth.user);

  function handleSubmit() {
    socket.emit("user-message", { clientId: user.clientId, text: textareaValue });
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
  useSocketOn("message", (Message) => {
    // console.log(`message:${JSON.stringify(Message, undefined, 2)}`);
    const messagesCopy = [...messages];
    messagesCopy.push(Message);
    setMessages(messagesCopy);
  });
  return (
    <div>
      <div className=" text-center font-bold text-xl">{user.name}</div>
      <div className=" w-[366px] m-auto mt-2  ">
        <div className=" bg-vichatBlue border border-[#E0E0E0] rounded-t-xl h-[64px] flex items-center gap-2">
          <div className="relative mr-2 w-[36px] h-[36px] rounded-full border-2 border-white flex items-center justify-center bg-vichatPurpleLight">
            <div className=" text-[13.5px] text-vichatPurpleDark ">JD</div>
            <div className=" absolute w-[10px] h-[10px] rounded-full bg-vichatGreen border-[2.5px] border-white right-[2px] bottom-6"></div>
          </div>
          <div className=" text-[12px] ">
            <div className="text-white">پشتیبانی آنلاین</div>
            <div className=" text-white/80">پاسخگوی سوالات شما هستیم</div>
          </div>
        </div>
        <div className=" h-[550px] bg-white border border-[#E0E0E0] rounded-b-xl ">
          <div className="flex flex-col h-full bg-gray-100 rounded-b-xl p-4 ">
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isFromAgent ? "justify-start" : "justify-end"} mb-2`}>
                  <div className={`flex flex-col  ${message.isFromAgent ? " " : " items-end"}`}>
                    <p
                      className={` p-3 max-w-[15rem] text-[16px] rounded-t-[12px] ${
                        message.isFromAgent
                          ? "bg-white text-black rounded-bl-[12px]"
                          : "bg-[#5B4DFF] text-white  rounded-br-[12px] "
                      }`}
                    >
                      {message.text}
                    </p>
                    <span className={`text-[10px] text-gray-700 block mt-1`}>
                      {new Date(Number(message.timestamp)).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className=" relative ">
              <div className=" absolute w-full -bottom-2 rounded-sm bg-[#E0E0E0] pt-2 pr-6 pb-2 pl-3 flex items-center justify-between">
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
        </div>
      </div>
    </div>
  );
};

export default Chat;
