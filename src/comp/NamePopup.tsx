import { DialogHTMLAttributes, FormEvent, useRef, useState } from "react";

export const NamePopup = ({ setName }: { setName: any }) => {
  const [field, setF] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (field) {
      setName(field);
    }
  };
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="mb-40 flex h-fit w-2/4 flex-col gap-4 rounded bg-slate-600 p-10 text-center">
        <h1 className="text-center text-4xl">Please enter a username </h1>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {" "}
          <input
            className="h-12 rounded px-4 py-2"
            type="text"
            value={field}
            onClick={submit}
            onChange={(e) => setF(e.target.value)}
          />
          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  );
};
