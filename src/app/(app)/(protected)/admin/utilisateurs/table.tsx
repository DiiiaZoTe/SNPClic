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

import type { User } from "@/app/(app)/(protected)/admin/utilisateurs/page";
import {
  Loader2,
  MoreVertical,
  Shield,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utilities/format-date";
import { errorToast } from "@/components/utilities/toasts";

export const UserTable = ({ users }: { users: User[] }) => {
  const router = useRouter();

  // trpc api at api.auth.deleteUserByEmail
  // create the mutation that optimistically updates the UI
  // when the user is deleted
  const { mutate: deleteMutation, isLoading } =
    api.auth.deleteUserByEmail.useMutation({
      onMutate: () => {
        toast("Suppression...", {
          duration: 0,
        });
      },
      onSuccess: ({ email }) => {
        toast.dismiss();
        toast.success(`L'utilisateur ${email} a été supprimée avec succès.`);
        router.refresh();
      },
      onError: (error) => {
        toast.dismiss();
        errorToast({
          title: "Erreur",
          description:
            error.message ??
            "Une erreur s'est produite lors de la suppression. Veuillez réessayer.",
        });
      },
    });

  const handleDelete = (email: string) => {
    if (isLoading) return;
    deleteMutation({ email });
  };

  return (
    <div className="[--scrollbar-size:3px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-semibold min-w-[22ch]">
              Email
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Rôle
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Date de création
            </TableHead>
            <TableHead className="text-foreground font-semibold text-right rounded-tr-md">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => {
            const date = new Date(user.createdAt);
            const { formattedDate } = formatDate(date);

            return (
              <TableRow key={user.email}>
                <TableCell
                  className={cn(
                    index == users.length - 1 ? "rounded-bl-md" : ""
                  )}
                >
                  {user.email}
                </TableCell>
                <TableCell>
                  {user.role == "admin" ? (
                    <span className="flex gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </span>
                  ) : (
                    <span className="flex gap-2">
                      <UserIcon className="h-4 w-4" />
                      Utilisateur
                    </span>
                  )}
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell
                  className={cn(
                    "text-right",
                    index == users.length - 1 ? "rounded-br-md" : ""
                  )}
                >
                  <ActionDropdown
                    email={user.email}
                    role={user.role}
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
  email,
  role,
  handleDelete,
  isDeleting,
}: {
  email: string;
  role: User["role"];
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
          <DropdownMenuItem
            className="text-destructive hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10"
            onClick={() => setModalOpen(true)}
            disabled={role === "admin"}
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
              Êtes-vous sûr de vouloir supprimer cette utilisateur ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => handleDelete(email)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
