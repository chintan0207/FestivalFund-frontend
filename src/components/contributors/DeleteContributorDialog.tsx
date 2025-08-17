import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useContributorStore } from "@/store/useContributorStore";

interface DeleteContributorDialogProps {
  contributorId?: string | undefined | null;
  contributorName: string;
}

export function DeleteContributorDialog({
  contributorId,
  contributorName,
}: DeleteContributorDialogProps) {
  const { deleteContributor, isbtnLoading } = useContributorStore();

  const handleDelete = async () => {
    await deleteContributor(contributorId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="p-2 hover:bg-red-50 rounded-full">
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contributor?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The contributor{" "}
            <b>{contributorName}</b> will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isbtnLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isbtnLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isbtnLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
