import { Message } from "../App";
export default function MessageCard({ message }: { message: Message }) {
  const data = new Date(message.sentDate);

  return (
    <div className="flex items-center justify-between gap-2 border-[1px] border-white p-4 text-xl odd:bg-neutral-200">
      <div className="flex w-11/12 flex-col">
        <div className="mb-2 flex-grow break-words font-medium text-black">
          {message.content}
        </div>

        <span className="text-xs text-slate-800">{data.toLocaleString()}</span>
      </div>

      <span className="w-28 text-sm text-gray-800">{message.username}</span>
    </div>
  );
}
