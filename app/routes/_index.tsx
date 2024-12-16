import type { MetaFunction } from "@remix-run/node";
import { PageLayout } from "~/components/PageLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "Page Editor" },
    { name: "description", content: "Welcome to the page editor!" },
  ];
};

export default function Index() {
  return <PageLayout />;
}
