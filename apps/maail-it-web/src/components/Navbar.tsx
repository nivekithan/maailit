"use client";
import React from "react";
import LogoSvg from "./abstract";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  return (
    <div className="h-14 max-w-7xl mx-auto flex items-center justify-center bg-white mt-2 px-4 rounded-xl">
      <button
        type="button"
        onClick={() => router.replace("/")}
        className="flex items-center space-x-2"
      >
        <LogoSvg className="fill-primary-blue w-8" />
        <p className="font-bold text-xl">Maail It</p>
      </button>
    </div>
  );
}

export default Navbar;
