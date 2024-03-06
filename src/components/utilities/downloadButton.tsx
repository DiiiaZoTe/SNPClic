"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef, useRef, useState } from "react";
import { errorToast } from "@/components/utilities/toasts";
import { FileX2 } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface DownloadButtonProps extends ButtonProps {
  filename: string;
  retryDelay?: number;
  loader?: React.ReactNode;
}

const DownloadButton = forwardRef<HTMLButtonElement, DownloadButtonProps>(
  ({ filename, retryDelay = 2000, loader, children, ...props }, ref) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const fileUrlRef = useRef<string | undefined>();

    const {
      mutate: generateFile,
      isLoading: isGenerating,
      isSuccess: isGenerateSuccess,
      isIdle: isGenerateIdle,
    } = api.questionnaire.generatePDF.useMutation({
      onSuccess: () => {
        toast.success("Le fichier a été généré avec succès");
      },
      onError: () => {
        errorToast({
          title: "Erreur lors de la génération du fichier",
          description:
            "Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
          actionButton: {
            action: () => generateFile(filename),
            buttonLabel: "Réessayer",
            buttonVariant: "black",
          },
        });
      },
    });

    if (filename === "" || filename === undefined || filename === null)
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
            "Essayer de regénérer le fichier. Si le problème persiste, veuillez nous contacter.",
          actionButton: {
            action: () => generateFile(filename),
            buttonLabel: "Régénérer",
            buttonVariant: "black",
          },
        });
      }
    };

    const isLoading = isGenerating || isDownloading;
    const canDownload = isGenerateIdle || isGenerateSuccess;
    const btnFunction = canDownload
      ? handleDownload
      : () => generateFile(filename);

    return (
      <Button
        ref={ref}
        {...props}
        onClick={btnFunction}
        disabled={isDownloading}
      >
        {isLoading && loader ? loader : children || "Télécharger"}
      </Button>
    );
  }
);

DownloadButton.displayName = "DownloadButton";

export { DownloadButton };
