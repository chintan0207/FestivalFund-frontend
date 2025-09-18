import { Download, Loader2Icon, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import { useContributionStore } from "@/store/useContributionStore";
import { useEffect } from "react";
import {
  capitalize,
  downloadFile,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { ContributionStatusEnum } from "@/lib/constants";
import { useFestivalStore } from "@/store/useFestivalStore";
import { Button } from "../ui/button";
import TableSkeleton from "./TableSkeleton";
import { EmptyStateRow } from "./EmptyStateRow";

const ContributionsList = () => {
  const {
    contributions,
    fetchContributions,
    isLoading,
    getContributionPdf,
    isPdfLoading,
  } = useContributionStore();
  const currentFestival = useFestivalStore((state) => state.currentFestival);

  useEffect(() => {
    fetchContributions({
      skipPagination: true,
      festivalId: currentFestival?._id,
    });
  }, [fetchContributions]);

  const handleExportPDF = async () => {
    if (!currentFestival?._id) return;

    try {
      const success = await getContributionPdf(currentFestival._id);
      if (!success) {
        alert("Failed to generate PDF report.");
        return;
      }

      const pdfUrl = useContributionStore.getState().pdfUrl;
      const fileName = `Contributions_Report_${currentFestival.name}_${currentFestival.year}.pdf`;

      downloadFile(pdfUrl, fileName);
    } catch (err) {
      console.error("Error exporting PDF", err);
    }
  };

  return (
    <>
      <Card className="rounded-2xl">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-semibold flex items-center space-x-3 print:text-black">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <span>Detailed Contributions Report</span>
          </h2>
          <Button
            disabled={isPdfLoading}
            onClick={handleExportPDF}
            className="rounded-4xl p-5 bg-gradient-to-r from-purple-500 to-purple-600"
          >
            {isPdfLoading ? (
              <Loader2Icon className="animate-spin w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg shadow-sm overflow-hidden">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                  Contributor
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                  Amount / Item
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                  Date
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton rows={5} cols={4} />
              ) : contributions?.length === 0 ? (
                <EmptyStateRow colSpan={4} message="No contributions found." />
              ) : (
                contributions.map((contribution, idx) => (
                  <tr
                    key={contribution?._id}
                    className={`transition-colors hover:bg-gray-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    }`}
                  >
                    {/* Contributor */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {contribution?.contributor?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {contribution?.contributor?.category}
                        </p>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-3 font-bold text-green-600 text-sm sm:text-base">
                      {formatCurrency(contribution?.amount)}
                    </td>

                    {/* Date */}
                    <td className="p-3 text-gray-700 text-sm sm:text-base">
                      {formatDate(contribution?.date)}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium tracking-wide ${
                          contribution?.status ===
                          ContributionStatusEnum.DEPOSITED
                            ? "bg-green-100 text-green-700"
                            : contribution?.status ===
                              ContributionStatusEnum.PENDING
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {capitalize(contribution?.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default ContributionsList;
