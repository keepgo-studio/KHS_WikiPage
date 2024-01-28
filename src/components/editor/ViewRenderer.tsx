import type { OutputData } from "@editorjs/editorjs";

import React, { useEffect, useRef, useState } from "react";
import editorJsHtml from "editorjs-html";

const ViewRenderer = ({ data }: { data: OutputData }) => {
  const service = useRef(editorJsHtml());
  const [html, setHtml] = useState<string[]>([]);

  useEffect(() => {
    if (service.current && service.current.parse) {
      setHtml(service.current.parse(data));
    }
  }, [data]);

  return (
    <div className="prose max-w-full">
      {html.map((item, idx) => {
        if (typeof item === "string") {
          return (
            <div dangerouslySetInnerHTML={{ __html: item }} key={idx}/>
          )
        }

        return item;
      })}
    </div>
  )
};


export default ViewRenderer