import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container m-auto flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-5xl font-bold text-primary">404</h1>
      <h1 className="text-3xl font-semibold">Page introuvable</h1>
      <Link href="/" className="mt-10">
        <Button variant="outline">Retourner à l'acceuil</Button>
      </Link>
    </div>
  );
}
