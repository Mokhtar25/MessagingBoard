import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { socket } from "./socket";
import MessageCard from "./comp/MessageCard";
import { Header } from "./comp/Header";
import { NamePopup } from "./comp/NamePopup";

export interface Message {
  content: string;
  id: string;
  sentDate: string;
  username: string;
}

export default function App() {
  const [isConnect, setIsConnected] = useState(false);
  const [messages, setmessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  function sentTyping() {
    socket.emit("typing", { username });
  }
  function doneTyping() {
    socket.emit("typing", null);
  }

  const typeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    sentTyping();
    setTimeout(doneTyping, 2000);
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (text !== "") {
      socket.emit("chat message", text, username);
      socket.emit("typing", null);
      doneTyping();
      setText("");
    }
  };

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
    function onConnect() {
      console.log("run, connected");
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessages(value: Message) {
      const offset = value.id;
      // @ts-ignore
      socket.auth.serverOffset = offset;

      setmessages((mes) => [...mes, value]);
    }
    function onTyping(user: string) {
      console.log("user typingl", user);
      if (user === null) {
        setUserTyping("");
        setTyping(false);
        return;
      }
      setTyping(true);
      setUserTyping(user);
    }

    socket.on("connect", onConnect);
    socket.on("typing", onTyping);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onMessages);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", onMessages);
      socket.off("typing", onTyping);
    };
  }, [messages]);

  if (!username) return <NamePopup setName={setUsername} />;

  return (
    <div className="h-dvh pb-4">
      <Header />
      <div className="w-3/4">
        <div className="group flex h-[650px] flex-col overflow-scroll overflow-x-clip first:bg-red-700 odd:bg-white even:bg-slate-500">
          {messages.map((e: Message) => (
            <MessageCard message={e} key={e.id} />
          ))}
          <span ref={ref}></span>
        </div>
        <span className="h-4 w-full px-6 py-2">
          {typing ? `${userTyping}, is typing ....` : ""}
        </span>
        <form onSubmit={send} className="mb-4 flex bg-slate-200">
          <input
            className="w-full bg-slate-200 px-6 py-2 text-black"
            placeholder="your message"
            onChange={typeInput}
            value={text}
          />

          <button className="w-22 h-10 rounded-none bg-slate-800" type="submit">
            send
          </button>
        </form>
      </div>
    </div>
  );
}
