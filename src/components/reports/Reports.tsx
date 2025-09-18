import {
  Download,
  FileText,
  Loader2Icon,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Card } from "../ui/card";
import ContributionsList from "./ContributionsList";
import ExpenseList from "./ExpenseList";
import ContributorsList from "./ContributorsList";
import FestivalSummary from "./FestivalSummary";
import { useFestivalStore } from "@/store/useFestivalStore";
import { downloadFile } from "@/lib/utils";

const Reports = () => {
  const { currentFestival, getFestivalReport, isPdfLoading } =
    useFestivalStore();
  const [reportType, setReportType] = useState("summary");

  const reportTypes = [
    {
      id: "summary",
      label: "Festival Summary",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "contributions",
      label: "Contributions Report",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "expenses",
      label: "Expenses Report",
      icon: TrendingDown,
      color: "from-red-500 to-pink-600",
    },
    {
      id: "contributors",
      label: "Contributors Report",
      icon: Users,
      color: "from-green-500 to-emerald-600",
    },
  ];

  const handleExportPDF = async () => {
    if (!currentFestival?._id) return;

    try {
      const success: boolean = await getFestivalReport(currentFestival._id);
      if (!success) {
        alert("Failed to generate PDF report.");
        return;
      }
      const pdfUrl = useFestivalStore.getState().pdfUrl;
      const fileName = `Festival_Report_${currentFestival.name}_${currentFestival.year}.pdf`;

      downloadFile(pdfUrl, fileName);
    } catch (err) {
      console.error("Error exporting PDF", err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="heading">
          <h1>Reports & Analytics</h1>
          <p>
            Comprehensive festival financial reports with export functionality
          </p>
        </div>
        <Button
          onClick={handleExportPDF}
          disabled={isPdfLoading}
          className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-orange-500 to-amber-500 "
        >
          {isPdfLoading ? (
            <Loader2Icon className="animate-spin w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Export Complete Report
        </Button>
      </div>

      {/* Report Type Selector */}
      <Card className="rounded-xl ">
        <h3 className="font-semibold text-sm text-gray-700">
          Choose Report Type
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            const isActive = reportType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex flex-col items-center justify-center rounded-lg px-3 py-3 border text-xs transition
            ${
              isActive
                ? `bg-gradient-to-r ${type.color} text-white border-transparent`
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
              >
                <Icon
                  className={`w-5 h-5 mb-1 ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                />
                <span className="font-semibold text-xs text-center">
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Contributions Report */}
      {reportType === "summary" && <FestivalSummary />}
      {reportType === "contributions" && <ContributionsList />}
      {reportType === "expenses" && <ExpenseList />}
      {reportType === "contributors" && <ContributorsList />}
    </div>
  );
};

export default Reports;
