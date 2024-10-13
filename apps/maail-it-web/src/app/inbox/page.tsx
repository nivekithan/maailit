"use client";
import { useFetchMails } from "@/lib/queryHooks";
import React from "react";

function Home() {
  const { data, isFetching } = useFetchMails();
  return <div>page</div>;
}

export default Home;
