"use client";

import type { OutputData } from "@editorjs/editorjs";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WikiApiHandler } from "@/utils/api";
import { IoMdBackspace } from "react-icons/io";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
import { MdPublish } from "react-icons/md";
import Button from "@/components/Button";
import Blank from "@/components/Blank";

const Editor = dynamic(() => import("../../components/editor/Editor"), {
  ssr: false,
  loading: () => (
    <p className="text-prime-gray font-light text-xl ab-center">Starting Editor...</p>
  ),
});

const PublishButton = ({
  isValid,
  onClick,
}: {
  isValid: boolean;
  onClick: React.MouseEventHandler;
}) => {
  useEffect(() => {}, [isValid]);

  return (
    <Button
      shape="normal"
      className={`
        flex
        ${isValid ? "" : "bg-prime-gray cursor-not-allowed"}
      `}
      disabled={!isValid}
      onClick={onClick}
    >
      <MdPublish className="text-2xl" />
      <span>upload</span>
    </Button>
  );
};

const page = () => {
  const searchParams = useSearchParams();
  /**
   * @description
   *
   * pageId는 page의 id number (e.g 0, 1, 2...)
   */
  const pageIdStr = searchParams.get("pageid") ?? undefined;

  const router = useRouter();
  // default 값들은 "새 글 작성" 기준으로 맞춰짐. "수정"일 때는 useEffect에서 변경이 일어남
  const [data, setData] = useState<OutputData | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("New Wiki Post");

  useEffect(() => {
    if (!pageIdStr) return;

    // 기존 글에 작성 scenario
    setLoading(true);
    WikiApiHandler.getWikiFile(Number(pageIdStr))
      .then((file) => {
        setLoading(false);
        setData(file.body_data);
        setTitle(file.title);
      })
      // 만약 잘못된 id로 접근한다면 홈으로
      .catch(() => router.push("/"));
  }, []);

  async function publish() {
    let status = false;

    if (pageIdStr === undefined) {
      status = await WikiApiHandler.postWiki(title, data!, undefined);
    } else {
      const id = Number(pageIdStr);
      status = await WikiApiHandler.postWiki(title, data!, id);
    }

    if (status) router.back();
  }

  return (
    <main className="p-8 h-full flex flex-col">
      {loading ? (
        <Loading />
      ) : (
        <>
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
            <h4 className="font-bold">Title</h4>

            <Blank className="h-2" />

            <input
              className="border-b text-3xl outline-none p-2 rounded-lg shadow-sh2"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </section>

          <Blank className="h-10" />

          <section className="relative flex-1 py-8 ">
            <h4 className="font-bold">Editor</h4>

            <Blank className="h-2" />

            <Editor data={data} holder="editorjs" onChange={setData} />
          </section>

          <Blank className="h-4" />

          <section className="flex justify-end">
            <PublishButton
              isValid={Boolean(
                !loading && data?.blocks && data?.blocks.length > 0
              )}
              onClick={publish}
            />
          </section>
        </>
      )}
    </main>
  );
};

export default page;
