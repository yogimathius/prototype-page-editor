import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { getPage, updatePage } from "../models/page.server";
import { PageLayout } from "../components/PageLayout";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import { Block } from "~/types/Block";

export async function loader({ params }: LoaderFunctionArgs) {
  const page = await getPage(params.pageId ?? "");
  if (!page) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ page });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = JSON.parse(formData.get("data") as string);

  await updatePage(params.pageId ?? "", data);
  return json({ success: true });
}

export default function PageEditor() {
  const { page } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((data: any) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      fetcher.submit(formData, { method: "post" });
    }, 1000),
    [fetcher]
  );

  return (
    <PageLayout
      initialBlocks={page.blocks}
      onBlocksChange={(blocks: Block[]) => {
        debouncedSave({
          id: page.id,
          title: page.title,
          blocks,
        });
      }}
    />
  );
}
