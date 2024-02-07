import { Button } from "@/components/ui/button";
import MyLink from "@/components/utilities/link";

export default function NotFound() {
  return (
    <div className="container m-auto flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-5xl font-bold text-primary">404</h1>
      <h1 className="text-3xl font-semibold">Page introuvable</h1>
      <MyLink href="/">
        <Button variant="black">Retourner à l&apos;acceuil</Button>
      </MyLink>
    </div>
  );
}
