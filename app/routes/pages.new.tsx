import * as React from "react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useFetcher, Link } from "@remix-run/react";
import { createPage } from "../models/page.server";
import { PageLayout } from "../components/PageLayout";
import { useCallback, useState, useRef } from "react";
import debounce from "lodash/debounce";
import type { Block } from "../types/Block";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = JSON.parse(formData.get("data") as string);

  if (!data.title && !data.blocks?.length) {
    return json({ success: false });
  }

  const page = await createPage({
    title: data.title || "Untitled Page",
    blocks: data.blocks || [],
  });

  if (data.initialCreate) {
    return redirect(`/pages/${page.id}`);
  }

  return json({ success: true, page });
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

  // Use ref to track if we should update
  const shouldUpdate = useRef(false);

  const debouncedSave = useCallback(
    debounce((data: PageData & { initialCreate?: boolean }) => {
      if (!shouldUpdate.current) return;

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      fetcher.submit(formData, { method: "post" });
    }, 1000),
    [fetcher]
  );

  const handleBlocksChange = useCallback(
    (blocks: Block[]) => {
      if (JSON.stringify(blocks) !== JSON.stringify(pageData.blocks)) {
        shouldUpdate.current = true;
        setPageData((prev) => ({ ...prev, blocks }));
      }
    },
    [pageData.blocks]
  );

  return (
    <Form method="post" className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Pages
          </Link>
          <input
            type="text"
            name="title"
            placeholder="Untitled Page"
            className="text-2xl font-bold bg-transparent text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            onChange={(e) => {
              shouldUpdate.current = true;
              setPageData((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            shouldUpdate.current = true;
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
        initialBlocks={pageData.blocks}
        onBlocksChange={handleBlocksChange}
      />
    </Form>
  );
}
