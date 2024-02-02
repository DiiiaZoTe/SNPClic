import { notFound } from "next/navigation";

export const metadata = {
  title: "Page not found",
};

export default function Page() {
  notFound();
}
