"use client";

import Blank from "@/components/Blank";
import Loading from "@/components/Loading";
import { useWikiList } from "@/hooks/useWikiList";
import { WikiApiHandler } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

const ListItem = ({ 
  title, 
  desc,
  onRemove
}: { 
  title: string; 
  desc: string;
  onRemove: () => void;
}) => {
  useEffect(() => {}, [title, desc]);

  function removeHandler(e: React.MouseEvent) {
    e.stopPropagation();

    if (confirm("Do you want to remove?")) {
      onRemove();
    }
  }

  return (
    <div className="relative group">
      <div className="w-[420px] h-20 p-4 shadow-sh2 rounded-xl duration-200 hover:scale-[1.02] cursor-pointer left-theme bg-white">
        <h4 className="text-xl font-bold">{title}</h4>

        <Blank className="h-1" />

        <p
          className="text-sm text-prime-gray pointer-events-none truncate"
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      </div>

      <button 
        className="absolute duration-200 text-2xl top-1 left-1 -translate-x-1/2 -translate-y-1/2 text-red-500 bg-white rounded-full opacity-0 group-hover:opacity-100"
        onClick={removeHandler}
      >
        <IoIosCloseCircle />
      </button>
    </div>
  );
};

const List = ({ data, manualUpdate }: { data: WikiListItem[]; manualUpdate: () => void }) => {
  const router = useRouter();

  return (
    <ul className="flex flex-col gap-4">
      {data.map((item, idx) => (
        <li key={idx} onClick={() => router.push("/post" + "/" + item.id)}>
          <ListItem onRemove={async () => {
            if (await WikiApiHandler.removeWikiFile(item.id)) {
              manualUpdate();
            }
          }} title={item.title} desc={item.desc} />
        </li>
      ))}
    </ul>
  );
};

const ListCounter = ({
  pageIdx,
  maxPage,
  onChange,
}: {
  pageIdx: number;
  maxPage: number;
  onChange: (pageIdx: number) => void;
}) => {
  return (
    <section className="text-xl w-[470px] overflow-auto text-center">
      <ul className="inline-flex gap-3">
        {[...Array(maxPage).keys()].map((idx) => {
          const isCurrent = idx === pageIdx;
          return (
            <li
              key={idx}
              onClick={() => onChange(idx)}
              className={`
                ${isCurrent ? "text-prime-blue font-bold" : "cursor-pointer"} 
              `}
            >
              {idx + 1}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const WikiList = () => {
  const ITEMS_COUNT = 5;

  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [renderList, setRenderList] = useState<WikiListItem[]>([]);

  const { list, loading, manualUpdate } = useWikiList();

  useEffect(() => {
    const startIdx = currentPageIdx * ITEMS_COUNT;
    setRenderList(list.slice(startIdx, startIdx + ITEMS_COUNT));
    setMaxPage(Math.ceil(list.length / 5));
  }, [list, loading, currentPageIdx]);

  function counterClickHandler(pageNum: number) {
    setCurrentPageIdx(pageNum);
  }

  return (
    <div className="h-full flex flex-col justify-between items-center py-8">
      {loading ? (
        <Loading />
      ) : (
        <>
          <List 
            data={renderList}
            manualUpdate={manualUpdate}
          />
          <ListCounter
            pageIdx={currentPageIdx}
            maxPage={maxPage}
            onChange={counterClickHandler}
          />
        </>
      )}
    </div>
  );
};

export default WikiList;
