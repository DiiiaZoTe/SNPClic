"use client";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import MyLink from "@/components/utilities/link";

import type { Submission } from "@/app/(app)/(protected)/soumissions/page";
import { Download, Loader2, MoreVertical, Redo, Trash2 } from "lucide-react";
import { DownloadButton } from "@/components/utilities/downloadButton";
import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { errorToast } from "@/components/utilities/toasts";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utilities/format-date";

export const SubmissionTable = ({
  submissions,
  showEmail = false,
}: {
  submissions: Submission[];
  showEmail?: boolean;
}) => {
  const router = useRouter();

  // trpc api at api.submission.deleteSubmissionById
  // create the mutation that optimistically updates the UI
  // when the user deletes a submission
  const { mutate: deleteMutation, isLoading } =
    api.submission.deleteSubmissionById.useMutation({
      onMutate: ({ submissionId }) => {
        toast("Suppression...", {
          duration: 0,
        });
      },
      onSuccess: ({ submissionId }) => {
        toast.dismiss();
        toast.success("La soumission a été supprimée avec succès.");
        router.refresh();
      },
      onError: (error) => {
        toast.dismiss();
        errorToast({
          title: "Erreur",
          description:
            "Une erreur s'est produite lors de la suppression. Veuillez réessayer.",
        });
      },
    });

  const handleDelete = (submissionId: string) => {
    if (isLoading) return;
    deleteMutation({ submissionId });
  };

  return (
    <div className="[--scrollbar-size:3px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-semibold min-w-[15ch] rounded-tl-md">
              Identifiant
            </TableHead>
            {showEmail && (
              <TableHead className="text-foreground font-semibold min-w-[22ch]">
                Email
              </TableHead>
            )}
            <TableHead className="text-foreground font-semibold">
              Date
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Heure (GMT+1)
            </TableHead>
            <TableHead className="text-foreground font-semibold min-w-[30ch]">
              Raison d&apos;arrêt
            </TableHead>
            <TableHead className="text-foreground font-semibold text-right rounded-tr-md">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission, index) => {
            const date = new Date(submission.submittedAt);
            const { formattedDate, formattedTime } = formatDate(date);

            return (
              <TableRow key={submission.uuid}>
                <TableCell
                  className={cn(
                    index == submissions.length - 1 ? "rounded-bl-md" : ""
                  )}
                >
                  <Button asChild variant="linkForeground">
                    <MyLink
                      href={`/soumissions/${submission.uuid}`}
                      className="truncate"
                    >
                      {`${submission.uuid.slice(0, 14)}...`}
                    </MyLink>
                  </Button>
                </TableCell>
                {showEmail && (
                  <TableCell>{submission.email ?? "Non disponible"}</TableCell>
                )}
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{formattedTime}</TableCell>
                <TableCell>
                  {submission.stopReason ?? "Aucune, fin du questionnaire."}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right",
                    index == submissions.length - 1 ? "rounded-br-md" : ""
                  )}
                >
                  <ActionDropdown
                    submissionId={submission.uuid}
                    handleDelete={handleDelete}
                    isDeleting={isLoading}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const ActionDropdown = ({
  submissionId,
  handleDelete,
  isDeleting,
}: {
  submissionId: string;
  handleDelete: (submissionId: string) => void;
  isDeleting?: boolean;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <MoreVertical className="h-4 w-4 m-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <MyLink href={`/soumissions/${submissionId}`}>
              <Redo className="h-4 w-4 mr-2" />
              Voir
            </MyLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DownloadButton
              filename={submissionId}
              variant="unstyled"
              className="min-h-8"
              loader={<Loader2 className="h-4 w-4 animate-spin" />}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </DownloadButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10"
            onClick={() => setModalOpen(true)}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={modalOpen}
        onOpenChange={() => {
          setModalOpen(false);
        }}
      >
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cette soumission ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Vous ne pourrez pas récupérer les
              données supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => handleDelete(submissionId)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
