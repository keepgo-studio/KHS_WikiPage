import type { OutputData } from "@editorjs/editorjs";

import { getQuery } from "./utils";

export class WikiApiHandler {
  static async getWikiList() {
    return (await fetch(getQuery("/wiki/get-all-posts"))
      .then((res) => res.json())
      .catch(() => [])) as WikiListItem[];
  }

  /**
   *
   * @param data
   * @param id undefined라면 새로운 글 작성, 값이 있다면 기존 글에 덮어쓰기
   * @returns 해당 파일에 쓰는게 성공하면 true, 실패하면 false
   */
  static async postWiki(title: string, data: OutputData, id?: number) {
    return await fetch(getQuery("/wiki/file"), {
      method: "POST",
      body: JSON.stringify({
        id,
        title,
        bodyData: data,
      }),
    })
      .then((res) => res.ok)
      .catch(() => false);
  }

  static async getWikiFile(pageId: number) {
    return await fetch(getQuery("/wiki/file", { id: pageId.toString() }))
      .then((res) => res.json())
      .then((data) => data as WikiFileJson);
  }

  static async removeWikiFile(pageId: number) {
    return await fetch(getQuery("/wiki/file", { id: pageId.toString() }), {
      method: "DELETE",
    })
      .then((res) => res.ok)
      .catch(() => false);
  }
}
