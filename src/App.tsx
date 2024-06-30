import React, { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import MessageCard from "./comp/MessageCard";
import { Header } from "./comp/Header";

export interface Message {
  content: string;
  id: string;
  sentDate: string;
  username: string;
}

export default function App() {
  const [isConnect, setIsConnected] = useState(false);
  const [messages, setmessages] = useState([]);
  const [text, setText] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  ref.current?.scrollIntoView();
  const send = () => {
    // this works and send a message
    if (text !== "") {
      socket.emit("chat message", text, "react");
      setText("");
    }
  };

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    socket.connect();
    function onConnect() {
      console.log("run, connected");
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessages(value: Message) {
      console.log(value);
      // @ts-ignore
      setmessages((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onMessages);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("messages", (e) => {
        socket.disconnect();
        console.log(e, "this off-----");
        setmessages([]);
      });
    };
  }, [messages]);

  return (
    <div className="">
      <Header />
      App {isConnect ? "true" : "false"}
      <div className="flex h-[650px] w-3/4 flex-col overflow-scroll">
        {messages.map((e: Message) => (
          <MessageCard message={e} key={e.id} />
        ))}
        <span ref={ref}>s</span>
      </div>
      <input onChange={(e) => setText(e.target.value)} value={text} />
      <button onClick={send}>send</button>
    </div>
  );
}
