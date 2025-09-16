import { Download, Users } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useFestivalStore } from "@/store/useFestivalStore";
import { useContributorStore } from "@/store/useContributorStore"; // similar to useContributionStore
import { EmptyStateRow } from "./EmptyStateRow";
import TableSkeleton from "./TableSkeleton";
// import { formatDate } from "@/lib/utils";

const ContributorsList = () => {
  const { contributors, fetchContributors, isLoading } = useContributorStore();
  const currentFestival = useFestivalStore((state) => state.currentFestival);

  useEffect(() => {
    if (currentFestival?._id) {
      fetchContributors({
        skipPagination: true,
        festivalId: currentFestival._id,
      });
    }
  }, [fetchContributors, currentFestival]);

  return (
    <Card className="rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center space-x-3 print:text-black">
          <Users className="w-6 h-6 text-green-600" />
          <span>Detailed Contributors Report</span>
        </h2>
        <Button className="rounded-4xl p-5 bg-gradient-to-r from-green-500 to-emerald-600">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse rounded-lg shadow-sm overflow-hidden">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                Name
              </th>
              <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                Category
              </th>
              <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                Phone
              </th>
              <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={4} />
            ) : contributors?.length === 0 ? (
              <EmptyStateRow colSpan={4} message="No contributors found" />
            ) : (
              contributors.map((contributor, idx) => (
                <tr
                  key={contributor?._id}
                  className={`transition-colors hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                  }`}
                >
                  {/* Name */}
                  <td className="p-3 font-medium text-gray-900 text-sm sm:text-base">
                    {contributor?.name}
                  </td>

                  {/* Category */}
                  <td className="p-3 text-gray-700 text-sm sm:text-base">
                    {contributor?.category}
                  </td>

                  {/* Phone */}
                  <td className="p-3 text-gray-700 text-sm sm:text-base">
                    {contributor?.phoneNumber || "-"}
                  </td>

                  {/* Address */}
                  <td className="p-3 text-gray-700 text-sm sm:text-base">
                    {contributor?.address || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ContributorsList;
