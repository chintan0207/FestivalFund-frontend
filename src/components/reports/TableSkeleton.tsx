import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

const TableSkeleton = ({ rows = 5, cols = 4 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr
          key={rowIdx}
          className={`${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <td key={colIdx} className="p-3">
              {colIdx === 0 ? (
                // first column → name & subtitle skeleton
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ) : colIdx === cols - 1 ? (
                // last column → status pill
                <Skeleton className="h-6 w-20 rounded-full" />
              ) : (
                // middle columns → single line
                <Skeleton className="h-4 w-24" />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
