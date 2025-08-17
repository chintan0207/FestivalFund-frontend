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
import { useContributionStore } from "@/store/useContributionStore";

interface DeleteContributionDialogProps {
  contributionId?: string | undefined | null;
}

export function DeleteContributionDialog({
  contributionId,
}: DeleteContributionDialogProps) {
  const { deleteContribution, isbtnLoading } = useContributionStore();

  const handleDelete = async () => {
    await deleteContribution(contributionId);
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
          <AlertDialogTitle>Delete Contribution?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The contribution will be permanently
            deleted.
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
