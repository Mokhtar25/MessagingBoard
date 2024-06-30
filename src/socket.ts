import { io } from "socket.io-client";

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

const URL = "http://localhost:4000";

//@ts-ignore
export const socket = io<ServerToClientEvents, ClientToServerEvents>(URL, {
  autoConnect: true,
  auth: {
    serveroffset: 0,
  },
});
