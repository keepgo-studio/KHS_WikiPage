import fs from "fs/promises";
import { DATA_PATH } from "../vars";

export async function GET() {
  const wikiFiles = await fs.readdir(DATA_PATH);
  const result: WikiListItem[] = Array(wikiFiles.length).fill(undefined);

  /**
   * 가장 최근에 만들어진(created_at) 파일이 먼저 오도록 정렬
   * 
   * 기호에 맞게 sorting 변경하면 된다
   */
  wikiFiles.sort((a, b) => {
    const aNum = Number(a.split(".json")[0]);
    const bNum = Number(b.split(".json")[0]);
    return bNum - aNum;
  })

  await Promise.all(wikiFiles.map(async (fileName, idx) => {
    const filePath = DATA_PATH + "/" + fileName;

    try {
      const data = JSON.parse(await fs.readFile(filePath, {
        encoding: 'utf-8',
      })) as WikiFileJson;

      let desc = "";
      if (data.body_data.blocks.length > 0) {
        desc = data.body_data.blocks[0].data.text;
      }

      result[idx] = {
        id: data.id,
        created_at: data.created_at,
        desc,
        title: data.title
      };
    } catch {
      /* error handling code */
    }
  }))
 
  return Response.json(result);
}