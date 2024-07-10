import { io } from "socket.io-client";

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  auth: {
    serveroffset: number;
  };
}

interface ClientToServerEvents {
  hello: () => void;
}

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";

//@ts-ignore
export const socket = io<ServerToClientEvents, ClientToServerEvents>(URL, {
  autoConnect: true,
  auth: {
    serveroffset: 0,
  },
});
