import { DownloadButton } from "./downloadButton";

export const metadata = {
  title: "Test",
  description: "Test feature",
};

export default function Page({
  searchParams: { file },
}: {
  searchParams: {
    file: string;
  };
}) {
  return (
    <div className="flex flex-col grow">
      <DownloadButton filename={file} />
    </div>
  );
}
