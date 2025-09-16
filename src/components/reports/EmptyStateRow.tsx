import { FileX } from "lucide-react";

interface EmptyStateRowProps {
  colSpan: number;
  message: string;
}

export const EmptyStateRow = ({ colSpan, message }: EmptyStateRowProps) => {
  return (
    <tr>
      <td colSpan={colSpan} className="p-6 text-center text-gray-500">
        <div className="flex flex-col items-center justify-center space-y-2">
          <FileX className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );
};
