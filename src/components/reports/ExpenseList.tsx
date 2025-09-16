import { Download, Wallet } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useFestivalStore } from "@/store/useFestivalStore";
import { useExpenseStore } from "@/store/useExpenseStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import TableSkeleton from "./TableSkeleton";
import { EmptyStateRow } from "./EmptyStateRow";

const ExpenseList = () => {
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const currentFestival = useFestivalStore((state) => state.currentFestival);

  useEffect(() => {
    if (currentFestival?._id) {
      fetchExpenses({
        skipPagination: true,
        festivalId: currentFestival._id,
      });
    }
  }, [fetchExpenses, currentFestival]);

  return (
    <Card className="rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center space-x-3 print:text-black">
          <Wallet className="w-6 h-6 text-red-600" />
          <span>Detailed Expenses Report</span>
        </h2>
        <Button className="rounded-4xl p-5 bg-gradient-to-r from-red-500 to-pink-500">
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
                Category
              </th>
              <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                Description
              </th>
              <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                Amount
              </th>
              <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={4} />
            ) : expenses?.length === 0 ? (
              <EmptyStateRow colSpan={4} message="No expenses found" />
            ) : (
              expenses.map((expense, idx) => (
                <tr
                  key={expense?._id}
                  className={`transition-colors hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                  }`}
                >
                  {/* Category */}
                  <td className="p-3 font-medium text-gray-900 text-sm sm:text-base">
                    {expense?.category}
                  </td>

                  {/* Description */}
                  <td className="p-3 text-gray-700 text-sm sm:text-base">
                    {expense?.description}
                  </td>

                  {/* Amount */}
                  <td className="p-3 font-bold text-red-600 text-sm sm:text-base">
                    {formatCurrency(expense?.amount)}
                  </td>

                  {/* Date */}
                  <td className="p-3 text-gray-700 text-sm sm:text-base">
                    {formatDate(expense?.date)}
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

export default ExpenseList;
