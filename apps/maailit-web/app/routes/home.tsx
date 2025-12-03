import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import EmailForm from "~/components/EmailForm";
import { DottedGlowBackground } from "components/ui/dotted-glow-background";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="relative flex flex-col   rounded-4xl p-4 w-full h-[70vh] items-center justify-center">
      <EmailForm />
    </div>
  );
}
