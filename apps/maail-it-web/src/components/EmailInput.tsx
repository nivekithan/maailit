"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

function EmailInput() {
  const router = useRouter();
  const [inputData, setInputData] = useState<string>("");
  const handleEnter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputData.length < 1) {
      return;
    }
    router.push(`/inbox/${inputData}`);
  };
  const handleClick = () => {
    if (inputData.length < 1) {
      return;
    }
    router.push(`/inbox/${inputData}`);
  };
  return (
    <form onSubmit={(e) => handleEnter(e)}>
      <div className="w-full px-2 py-2 bg-white justify-between flex rounded-xl">
        <input
          onChange={(e) => setInputData(e.target.value)}
          className="w-full focus:outline-none"
          type="text"
          placeholder="Enter emai placeholder"
        />
        <span onClick={handleClick}>
          <ArrowRight className="blue-primary size-10 rounded-xl bg-black p-2" />
        </span>
      </div>
    </form>
  );
}

export default EmailInput;
