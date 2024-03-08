"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { errorToast } from "@/components/utilities/toasts";
import { api } from "@/trpc/react";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const DeleteButton = ({ submissionId }: { submissionId: string }) => {
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
        router.replace("/soumissions");
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
    <AlertDialog>
      <AlertDialogTrigger className="w-fit" asChild>
        <Button variant="destructive" className="min-w-36 text-center w-fit">
          {isLoading ? (
            <Loader2 className="w-4 h-4" />
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </>
          )}
        </Button>
      </AlertDialogTrigger>
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
  );
};
