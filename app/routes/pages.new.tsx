import { redirect } from "@remix-run/node";
import { createPage } from "../models/page.server";

export async function action() {
  const page = await createPage({
    title: "New Page",
    blocks: [],
  });
  return redirect(`/pages/${page.id}`);
}
