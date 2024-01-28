import Loading from "@/components/Loading";
import { WikiApiHandler } from "@/utils/api";
import dynamic from "next/dynamic";

const EditorViewer = dynamic(() => import("../../../components/editor/EditorViewer"), {
  ssr: false,
  loading: () => (
    <div className="ab-center">
      <Loading />
    </div>
  )
})

export async function generateStaticParams() {
  return (await WikiApiHandler.getWikiList()).map((file) => ({
    id: file.id,
  }));
}

const page = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  return (
    <main className="relative p-8 w-full h-full">
      <EditorViewer id={id}/>
    </main>
  );
};

export default page;
