"use client";
import React from "react";
import LogoSvg from "./abstract";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Navbar() {
  const router = useRouter();
  return (
    <div className="h-14 max-w-7xl mx-auto flex items-center justify-between bg-white mt-2 px-4 rounded-xl">
      <button
        type="button"
        onClick={() => router.replace("/")}
        className="flex items-center space-x-2"
      >
        <LogoSvg className="fill-primary-blue w-8" />
        <p className="font-bold text-xl">Maail It</p>
      </button>
      <div className="flex items-center">
        <p className="font-light text-slate-600">Made by:{` `} </p>
        <div className="flex space-x-4">
          <p>
            <span className="mx-1 bg-blue-primary text-white px-2 py-1 rounded-md">
              <Link target="_blank" href={` https://github.com/nivekithan`}>
                Nivekithan
              </Link>
            </span>
            {` `}
            <span className="mx-1 bg-blue-primary text-white px-2 py-1 rounded-md">
              <Link target="_blank" href={`https://github.com/Introfect`}>
                Aayushman
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
