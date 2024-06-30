import { Message } from "../App";
export default function MessageCard({ message }: { message: Message }) {
  const data = new Date(message.sentDate);

  return (
    <div className="flex items-center justify-between border-[1px] border-white p-4 text-xl odd:bg-neutral-200">
      <div className="flex w-full flex-col">
        <span className="mb-2 w-full flex-grow font-medium text-black">
          {message.content}
        </span>

        <span className="text-xs text-slate-800">{data.toLocaleString()}</span>
      </div>

      <span className="text-sm text-gray-800">{message.username}</span>
    </div>
  );
}
