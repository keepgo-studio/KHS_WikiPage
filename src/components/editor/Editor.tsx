"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWikiList } from "@/hooks/useWikiList";
import { filteredMatch } from "@/utils/utils";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import EditorTools from "./EditorTools.js";
import Blank from "../Blank";


type FilterItem = {
  id: number;
  text: string;
};

const SnippetList = ({
  keyword,
  select,
  onSelect,
  renderList
}: { 
  keyword: string;
  select: number;
  onSelect: (idx: number) => void;
  renderList: FilterItem[]
}) => {
  useEffect(() => {}, [renderList, keyword]);

  return (
    <ul className="flex flex-col gap-1 text-sm">
      {renderList.map((item, idx) => (
        <li 
          key={item.id} 
          className={`
            p-1 font-light border rounded-md left-theme tracking-tight cursor-pointer duration-200
            ${select === idx && "bg-deem text-white "}
          `}
          onClick={() => onSelect(idx)}
          dangerouslySetInnerHTML={{ __html: item.text }}
        />
      ))}
    </ul>
  );
};

type SnippetProps = React.ComponentPropsWithoutRef<"div"> & {
  open: boolean;
  onSelectLink: (id?: number, title?: string) => void;
};

const Snippet = ({ open, onSelectLink, ...rest }: SnippetProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");
  const [select, setSelect] = useState(0);
  const [renderList, setRenderList] = useState<FilterItem[]>([]);
  
  const { list, loading } = useWikiList();

  useEffect(() => {
    function render() {
      const newList: FilterItem[] = [];
  
      list.reduce((prev, item) => {
        // 검색어가 없을시
        if (!keyword) {
          prev.push({
            id: item.id,
            text: item.title,
          });
          return prev;
        }
        // 검색어가 있을시
        const text = filteredMatch(item.title, keyword);
  
        if (text) {
          prev.push({
            id: item.id,
            text,
          });
        }
  
        return prev;
      }, newList);
  
      setRenderList(newList);
    }

    if (open && inputRef.current) {
      inputRef.current.focus();
      render();
    }
  }, [open, list, keyword]);

  function submit() {
    try {
      const { id, title } = list.find(item => item.id === renderList[select].id)!;
      onSelectLink(id, title);
      setKeyword("");
    } catch {}
  }

  function terminate() {
    onSelectLink(undefined);
  }

  function keydownHandler(e: React.KeyboardEvent) {    
    if (!open) return;
    e.stopPropagation();

    const n = renderList.length;
    inputRef.current?.focus();

    if (e.code === "ArrowDown") {
      setSelect(prev => prev + 1 < n ? prev + 1 : 0)
    } else if (e.code === "ArrowUp") {
      setSelect(prev => prev - 1 >= 0 ? prev - 1 : n - 1);
    } else if (e.code === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.code === "Escape") {
      terminate();
    }
  }

  return (
    <div
      className={`
        bg-white fixed mt-1 border border-black rounded-lg p-2 duration-200 transition-opacity text-sm
        ${open ? "opacity-100 z-50" : "opacity-0 -z-10"}
      `}
      {...rest}
      onKeyDown={keydownHandler}
    >
      <input
        className="w-[180px] border-b bg-gray-100 p-1"
        value={keyword}
        onChange={(e) => setKeyword(e.currentTarget.value)}
        ref={inputRef}
      />

      <Blank className="h-2" />

      <div className="max-h-48 overflow-auto">
        <SnippetList
          renderList={renderList}
          select={select}
          onSelect={() => submit()}
          keyword={keyword} 
        />
      </div>

    </div>
  );
};

const Editor = ({
  holder,
  data,
  onChange,
}: {
  holder: string;
  data?: OutputData;
  onChange: (data: OutputData) => void;
}) => {
  const editorRef = useRef<EditorJS>();
  const markerRef = useRef(null);
  const [coor, setCoor] = useState({
    top: 0,
    left: 0,
    open: false,
  });

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder,
        tools: EditorTools,
        data,
        autofocus: true,
        onChange: async (api, event) => {
          const data = await api.saver.save();
          onChange(data);
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, []);

  function keydownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;

    setCoor((prev) => ({ ...prev, open: false }));

    if (e.code === "Digit2" && markerRef.current) {
      e.preventDefault();
      target.append("@");
      const div = markerRef.current as HTMLElement;
      target.append(div);
      const info = div.getBoundingClientRect();

      setCoor({
        top: info.top + info.height,
        left: info.left,
        open: true,
      });
    }
  }

  function selectSnippetHandler(id?: number, title?: string) {
    setCoor(prev => ({ ...prev, open: false }));

    if (id && markerRef.current) {
      const div = markerRef.current as HTMLElement;
      const target = div.parentElement!;
      
      target.innerHTML = target.innerHTML.replace("@", "");

      const a = document.createElement('a');
      a.href=`/post/${id}`;
      a.innerText = title ?? "";

      target.appendChild(a);
      div.remove();

      editorRef.current?.caret.focus(true);
    }
  }

  return (
    <section className="relative h-full">
      <div
        id={holder}
        className="prose max-w-full border py-4 px-16 rounded-2xl bg-white shadow-sh2 h-[740px] overflow-auto"
        onKeyDown={keydownHandler}
      />

      <Snippet
        onSelectLink={selectSnippetHandler}
        open={coor.open}
        style={{
          top: coor.top,
          left: coor.left,
        }}
      />

      <i ref={markerRef} />
    </section>
  );
};

export default Editor;
