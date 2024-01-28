import { API_URL } from "./vars";

export function getQuery(
  apiPath: ValidApi,
  params?: { [key: string]: string },
  mode?: "encode" | "raw"
) {
  let param;
  if (params === undefined) params = {};
  if (mode === undefined) mode = "encode";

  if (mode === "encode")
    param = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params![k]))
      .join("&");
  else
    param = Object.keys(params)
      .map((k) => k + "=" + params![k])
      .join("&");

  return `${API_URL}/${apiPath}?${param}`;
}

export function filteredMatch(origin: string, keyword: string) {
  const n = keyword.length;
  const regex = new RegExp(keyword, "gi");

  const matchedData = [...origin.matchAll(regex)];

  if (matchedData.length === 0) return undefined;

  let filteredList: React.ReactNode[] = [];
  let lastIdx = 0;
  matchedData.reduce((prev, info) => {
    const prevIdx = lastIdx;
    lastIdx = info.index! + n;

    prev.push(origin.slice(prevIdx, info.index));
    prev.push(`<span style="color:red;">${origin.slice(info.index, info.index! + n)}</span>`);

    return prev;
  }, filteredList);

  filteredList.push(origin.slice(lastIdx));

  return filteredList.join("");
}

