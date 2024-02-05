"use client";

export const DownloadButton = ({ filename }: { filename: string }) => {
  if (!filename) return "No file specified";

  const handleDownload = async () => {
    const response = await fetch(`/api/download/${filename}`);
    if (!response.ok) return alert("Failed to download file");
    const blob = await response.blob();
    const fileURL = window.URL.createObjectURL(blob);
    let anchor = document.createElement("a");
    anchor.href = fileURL;
    anchor.download = `${filename}.png`;
    anchor.click();
    anchor.remove();
  };

  return (
    <button
      type="button"
      className="rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
      onClick={
        () => alert("enable download in the code (prevent accidental downloads)")
        // handleDownload
      }
    >
      Download
    </button>
  );
};
