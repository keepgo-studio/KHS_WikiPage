import { WikiApiHandler } from "@/utils/api";
import { useEffect, useRef, useState } from "react";

export function useWikiList() {
  const REVALID_TIME = 300000; // 5 minute
  const interval = useRef<any>(null);
  const [list, setList] = useState<WikiListItem[]>([]);
  const [loading, setLoading] = useState(true);

  function update(data: WikiListItem[]) {
    setList(data);
    setLoading(false);
  };

  async function manualUpdate() {
    setLoading(true);
    update(await WikiApiHandler.getWikiList());
  }

  useEffect(() => {
    WikiApiHandler.getWikiList()
      .then((data) => update(data))
      .finally(() => {
        interval.current = setInterval(
          async () => {
            setLoading(true);
            update(await WikiApiHandler.getWikiList())
          },
          REVALID_TIME
        );
      });

    return () => {};
  }, []);

  return {
    list,
    loading,
    manualUpdate
  };
}
