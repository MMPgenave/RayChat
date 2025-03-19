import { useEffect } from "react";
import { socket } from "@/socket";

export const useSocketOn = (eventName: string, callback: (data: any) => void) => {
  useEffect(() => {
    socket.on(eventName, callback as any);
    return () => socket.off(eventName, callback as any);
  }, [eventName, callback as any]);
};
