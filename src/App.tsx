import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import MessageCard from "./comp/MessageCard";

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

  const send = () => {
    // this works and send a message
    if (text !== "") {
      socket.emit("chat message", text, "react");
      setText("");
    }
  };

  useEffect(() => {
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
  }, []);

  return (
    <div className="">
      App {isConnect ? "true" : "false"}
      <div className="flex w-3/4 flex-col">
        {messages.map((e: Message) => (
          <MessageCard message={e} key={e.id} />
        ))}
      </div>
      <input onChange={(e) => setText(e.target.value)} value={text} />
      <button onClick={send}>send</button>
    </div>
  );
}
