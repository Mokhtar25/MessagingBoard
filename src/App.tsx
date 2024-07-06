import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState("");
  const [time, setTime] = useState<NodeJS.Timeout>();

  const ref = useRef<HTMLDivElement>(null);

  function sentTyping() {
    socket.emit("typing", { username });
  }
  function doneTyping() {
    socket.emit("typing", null);
  }

  const typeInput = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(time);
    setText(e.target.value);
    sentTyping();
    const x = setTimeout(doneTyping, 3000);
    setTime(x);
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

  if (username) {
    setTimeout(scrollToBottom, 100);
    window.localStorage.setItem("usernameMessage", username);
  }

  useEffect(() => {
    const userLocal = window.localStorage.getItem("usernameMessage");
    if (userLocal) {
      setUsername(userLocal);
    }

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

      setMessages((mes) => [...mes, value]);
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
  }, []);
  useEffect(() => {
    if (username) {
      window.localStorage.setItem("usernameMessage", username); // Only set username if it's not empty
    }
    scrollToBottom();
  }, [messages, username]);

  return (
    <div className="h-screen pb-4">
      <Header />
      {username === "" && <NamePopup setName={setUsername} />}
      <div className={"w-3/4" + (username === "" && " hidden")}>
        <div className="group flex min-h-[90dvh] flex-col overflow-scroll overflow-x-clip first:bg-red-700 odd:bg-white even:bg-slate-500">
          {messages.map((e: Message) => (
            <MessageCard message={e} key={e.id} />
          ))}
          <span ref={ref}></span>
        </div>
        <div className="sticky bottom-0 w-full bg-[#242424]">
          <span className="flex h-10 w-full justify-around px-6 py-2">
            {typing
              ? `${userTyping}, is typing ....`
              : "No one is currently typing"}
            <span
              className={
                "ml-auto text-sm after:ml-1 after:inline-block after:size-2 after:rounded-full after:content-['']" +
                (isConnect ? " after:bg-green-600" : " after:bg-red-500")
              }
            >
              {isConnect ? "Connected" : "Disconnected"}
            </span>
          </span>
          <form onSubmit={send} className="mb-4 flex bg-slate-200">
            <input
              className="w-full bg-slate-200 px-6 py-2 text-black"
              placeholder="your message"
              onChange={typeInput}
              value={text}
            />

            <button
              className="w-22 h-10 rounded-none bg-slate-800"
              type="submit"
            >
              send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
