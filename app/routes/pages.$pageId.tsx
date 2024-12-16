import * as React from "react";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import { getPage, updatePage } from "~/models/page.server";
import { PageLayout } from "~/components/PageLayout";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import type { Block } from "~/types/Block";

export async function loader({ params }: LoaderFunctionArgs) {
  const page = await getPage(params.pageId ?? "");
  if (!page) {
    throw new Response("Not Found", { status: 404 });
  }
  return { page };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = JSON.parse(formData.get("data") as string);

  await updatePage(params.pageId ?? "", data);
  return { success: true };
}

interface PageData {
  title: string;
  blocks: Block[];
}

export default function PageEditor() {
  const { page } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [pageData, setPageData] = useState<PageData>({
    title: page.title,
    blocks: page.blocks as Block[],
  });

  const debouncedSave = useCallback(
    debounce((data: PageData & { id?: string }) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      fetcher.submit(formData, { method: "post" });
    }, 1000),
    [fetcher]
  );

  return (
    <Form method="post" className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          name="title"
          defaultValue={page.title}
          className="text-2xl font-bold bg-transparent text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          onChange={(e) => {
            setPageData((prev) => ({ ...prev, title: e.target.value }));
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            debouncedSave({
              id: page.id,
              ...pageData,
            });
          }}
        >
          Save Changes
        </button>
      </div>

      <PageLayout
        initialBlocks={page.blocks}
        onBlocksChange={(blocks: Block[]) => {
          setPageData((prev) => ({ ...prev, blocks }));
        }}
      />
    </Form>
  );
}
