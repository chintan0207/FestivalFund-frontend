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
import { Trash } from "lucide-react";
import { useFestivalStore } from "@/store/useFestivalStore";

interface DeleteFestivalDialogProps {
  festivalId: string;
  festivalName: string;
}

export function DeleteFestivalDialog({
  festivalId,
  festivalName,
}: DeleteFestivalDialogProps) {
  const { deleteFestival, isbtnLoading } = useFestivalStore();

  const handleDelete = async () => {
    await deleteFestival(festivalId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Trash className="w-4 h-4 text-gray-600" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Festival?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The festival <b>{festivalName}</b>{" "}
            will be permanently deleted.
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
