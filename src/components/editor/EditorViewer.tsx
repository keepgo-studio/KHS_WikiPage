"use client";

import { WikiApiHandler } from "@/utils/api";
import { useEffect, useState } from "react";
import ViewRenderer from "./ViewRenderer";
import { useRouter } from "next/navigation";
import { IoMdBackspace } from "react-icons/io";
import Blank from "../Blank";
import Button from "../Button";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const EditorViewer = ({ id }: { id: number }) => {
  const router = useRouter();
  const [data, setData] = useState<WikiFileJson>();

  useEffect(() => {
    try {
      WikiApiHandler.getWikiFile(id).then((res) => {
        if (res) {
          setData(res);
        }
      });
    } catch { /* if wrong id entered */}
  }, [id]);

  function handleEditPost() { 
    if (data?.id) {
      router.push(`/edit?pageid=${data?.id}`);
    }
  }


  return (
    <div className="w-full h-full flex flex-col">
      <section>
        <button
          onClick={() => router.push("/")}
          className="hover:text-red-500 duration-200"
        >
          <IoMdBackspace className="text-3xl" />
        </button>
      </section>

      <Blank className="h-10" />

      <section className="w-full">
        <h1 className="border-b text-3xl outline-none p-2">{data?.title}</h1>
      </section>

      <Blank className="h-10" />

      <section className="relative bg-white border py-4 px-16 rounded-2xl shadow-sh2 h-full overflow-auto">
        {data?.body_data && <ViewRenderer data={data.body_data} />}

      </section>

      <Button className="sticky left-full bottom-8" onClick={handleEditPost}>
        <HiOutlinePencilSquare className="text-2xl"/>
      </Button>
    </div>
  );
};

export default EditorViewer;
