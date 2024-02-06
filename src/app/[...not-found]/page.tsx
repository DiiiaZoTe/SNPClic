import { notFound } from "next/navigation";
import { getSharedMetadata } from "@/config/shared-metadata";

export const runtime = "edge";

const METADATA = {
  title: "Page not found",
  description: "404 - Page not found",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description),
};

export default function Page() {
  notFound();
}
