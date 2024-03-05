"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef, useRef, useState } from "react";
import { errorToast } from "@/components/utilities/toasts";
import { FileX2 } from "lucide-react";

interface DownloadButtonProps extends ButtonProps {
  filename?: string;
  retryDelay?: number;
  loader?: React.ReactNode;
}

const DownloadButton = forwardRef<HTMLButtonElement, DownloadButtonProps>(
  ({ filename, retryDelay = 2000, loader, children, ...props }, ref) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const fileUrlRef = useRef<string | undefined>();

    if (!filename)
      return (
        <div className="flex items-center gap-2">
          <FileX2 className="w-4 h-4" />
          Aucun fichier
        </div>
      );

    const handleDownload = async () => {
      try {
        setIsDownloading(() => true);
        // Use the cached URL if it exists
        if (!fileUrlRef.current) {
          const response = await fetch(`/api/download/${filename}`, {
            method: "POST",
          });
          if (!response.ok) throw new Error("Failed to download file");
          const blob = await response.blob();
          fileUrlRef.current = window.URL.createObjectURL(blob); // Cache the blob URL
        }

        // Create an anchor element and simulate a click to download the file
        const anchor = document.createElement("a");
        anchor.href = fileUrlRef.current;
        anchor.download = `snpclic-${filename}.pdf`;
        anchor.click();
        anchor.remove();

        // Reset button state after a delay, keeping the cached URL for future downloads
        setTimeout(() => {
          setIsDownloading(() => false);
        }, retryDelay);
      } catch (error) {
        setIsDownloading(() => false);
        errorToast({
          title: "Erreur lors du téléchargement",
          description:
            "Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
          actionButton: {
            action: handleDownload,
            buttonLabel: "Réessayer",
            buttonVariant: "black",
          },
        });
      }
    };

    return (
      <Button
        ref={ref}
        {...props}
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading && loader ? loader : children || "Télécharger"}
      </Button>
    );
  }
);

DownloadButton.displayName = "DownloadButton";

export { DownloadButton };
