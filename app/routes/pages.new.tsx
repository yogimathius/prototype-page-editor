import * as React from "react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { createPage } from "../models/page.server";
import { PageLayout } from "../components/PageLayout";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import type { Block } from "../types/Block";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = JSON.parse(formData.get("data") as string);

  const page = await createPage({
    title: data.title || "Untitled Page",
    blocks: data.blocks || [],
  });

  // If it's the initial creation, redirect to the edit page
  if (data.initialCreate) {
    return redirect(`/pages/${page.id}`);
  }

  return { success: true, page };
}

interface PageData {
  title: string;
  blocks: Block[];
}

export default function NewPage() {
  const fetcher = useFetcher();
  const [pageData, setPageData] = useState<PageData>({
    title: "",
    blocks: [],
  });

  const debouncedSave = useCallback(
    debounce((data: any) => {
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
          placeholder="Untitled Page"
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
              ...pageData,
              initialCreate: true,
            });
          }}
        >
          Save Page
        </button>
      </div>

      <PageLayout
        initialBlocks={[]}
        onBlocksChange={(blocks: Block[]) => {
          setPageData((prev) => ({ ...prev, blocks }));
        }}
      />
    </Form>
  );
}
