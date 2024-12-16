import * as React from "react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { createPage } from "../models/page.server";
import { PageLayout } from "../components/PageLayout";
import { useCallback } from "react";
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

export default function NewPage() {
  const fetcher = useFetcher();

  const debouncedSave = useCallback(
    debounce((data: any) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      fetcher.submit(formData, { method: "post" });
    }, 1000),
    [fetcher]
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Untitled Page"
          className="text-2xl font-bold bg-transparent text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          onChange={(e) => {
            debouncedSave({
              title: e.target.value,
              blocks: [],
              initialCreate: true,
            });
          }}
        />
      </div>

      <PageLayout
        initialBlocks={[]}
        onBlocksChange={(blocks: Block[]) => {
          debouncedSave({
            title: "Untitled Page", // You might want to manage this in state
            blocks,
          });
        }}
      />
    </div>
  );
}
