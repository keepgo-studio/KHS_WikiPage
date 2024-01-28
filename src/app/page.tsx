'use client'

import Button from "@/components/Button";
import WikiList from "./WikiList";
import { useRouter } from "next/navigation";
import { VscNewFile } from "react-icons/vsc";

export default function Home() {
  const router = useRouter();

  function handleNewPost() { 
    router.push("/edit");
  }

  return (
    <main className="relative p-8 w-full h-full fcenter flex-col">
      <div className="p-8 h-full max-h-[720px]">
        <h1 className="font-bold text-5xl text-center">Wikis</h1>
        <WikiList />
      </div>

      <Button className="absolute bottom-8 right-8" onClick={() => handleNewPost()}>
        <VscNewFile className="text-2xl"/>
      </Button>
    </main>
  );
}
