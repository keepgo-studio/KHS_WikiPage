import type { OutputData } from "@editorjs/editorjs";

declare global {
  type ValidApi = 
  | "/wiki/get-all-posts"
  | "/wiki/file"
  ;

  type WikiFileJson = {
    id: number;
    title: string;
    created_at: number;
    updated_at: number;
    body_data: OutputData;
  };

  type WikiListItem = {
    /**
     * @description 
     * 
     * 파일 이름이 곧 id (e.g "0.json" -> id is 0)
     */
    id: number;
    title: string;
    desc: string;
    created_at: number;
  }
}

export {};
