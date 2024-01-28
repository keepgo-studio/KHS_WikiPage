import fs from "fs/promises";
import { DATA_PATH } from "../vars";

function getFilePath(fileId: any) {
  return DATA_PATH + "/" + fileId + ".json";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("id");

  try {
    const wikiFile = await fs.readFile(getFilePath(fileId), {
      encoding: 'utf-8'
    });

    return Response.json(JSON.parse(wikiFile));
  } catch {
    return new Response('Cannot find ' + fileId, {
      status: 404
    });
  }
}

export async function POST(req: Request) {
  const reqBody = await req.json();

  // 새로 만들기
  if (!("id" in reqBody)) {
    const wikiFiles = await fs.readdir(DATA_PATH);
    let biggestIdNum = -1;

    if (wikiFiles.length > 0) {
      /**
       * id는 무한히 incremental 한 integer이므로 가장 큰 정수 id를 찾는다.
       */
      wikiFiles.sort((a, b) => {
        const aNum = Number(a.split(".json")[0]);
        const bNum = Number(b.split(".json")[0]);
        return bNum - aNum;
      });
      const biggestId = wikiFiles[0];
      biggestIdNum = Number(biggestId.split(".json")[0]);
    }

    const currentTime = Date.now();
    const newId = biggestIdNum + 1;

    const data: WikiFileJson = {
      id: newId,
      title: reqBody.title,
      created_at: currentTime,
      updated_at: currentTime,
      body_data: reqBody.bodyData,
    };

    try {
      await fs.writeFile(
        getFilePath(newId),
        JSON.stringify(data),
        {
          encoding: "utf-8",
        }
      )

      return new Response("Success", { status: 200 });
    } catch {
      return new Response("Fail", { status: 500 });
    }
  }

  // 덮어 쓰기
  try {
    const filePath = getFilePath(reqBody.id);
    const wikiFile = JSON.parse(await fs.readFile(filePath, {
      encoding: "utf-8"
    })) as WikiFileJson;

    const currentTime = Date.now();

    wikiFile.title = reqBody.title;
    wikiFile.updated_at = currentTime;
    wikiFile.body_data = reqBody.bodyData;

    await fs.writeFile(filePath, JSON.stringify(wikiFile), {
      encoding: "utf-8"
    });

    return new Response("Success", { status: 200 });
  } catch {
    return new Response("Fail", { status: 404 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("id");

  try {
    await fs.unlink(getFilePath(fileId));

    return new Response("Success", { status: 200 });
  } catch {
    return new Response("Fail", { status: 400 });
  }
}