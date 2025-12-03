import { Outlet } from "react-router";
import Navbar from "~/components/Navbar";

export default function Layout() {
  return (
    <div className="h-screen w-full bg-neutral-950 py-2 max-w-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full  max-w-7xl mx-auto flex flex-col items-start justify-center h-full py-10">
        <Outlet />
      </div>
    </div>
  );
}
