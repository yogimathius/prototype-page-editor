import { Link, useLoaderData } from "@remix-run/react";
import { getPages } from "~/models/page.server";

export async function loader() {
  const pages = await getPages();
  return { pages };
}

export default function Index() {
  const { pages } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Pages</h1>
        <Link
          to="/pages/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          New Page
        </Link>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <Link
            key={page.id}
            to={`/pages/${page.id}`}
            className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <h2 className="text-lg font-medium text-white">{page.title}</h2>
            <p className="text-sm text-gray-400">
              {page.blocks.length} blocks • Updated{" "}
              {new Date(page.updatedAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
