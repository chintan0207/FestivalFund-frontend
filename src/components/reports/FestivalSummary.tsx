import { useFestivalStore } from "@/store/useFestivalStore";
import {
  Activity,
  Calculator,
  Hourglass,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Wallet,
  Building2,
  Package,
  Sparkles,
  Utensils,
  Volume2,
} from "lucide-react";
import { Card } from "../ui/card";
import { formatCurrency } from "@/lib/utils";
import { useEffect } from "react";

const FestivalSummary = () => {
  const { festivalStats, currentFestival, getFestivalStats } =
    useFestivalStore();

  useEffect(() => {
    if (currentFestival) {
      getFestivalStats(currentFestival?._id);
    }
  }, [currentFestival]);

  // Financial Summary Cards
  const financialCards = [
    {
      title: "Opening Balance",
      value: festivalStats?.openingBalance ?? 0,
      icon: IndianRupee,
      color: "from-blue-500 to-blue-600",
      subtitle: "Initial funds",
    },
    {
      title: "Total Collected",
      value: festivalStats?.totalCollected ?? 0,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      subtitle: "From contributions",
    },
    {
      title: "Total Spent",
      value: festivalStats?.totalExpenses ?? 0,
      icon: TrendingDown,
      color: "from-red-500 to-pink-600",
      subtitle: "On expenses",
    },
    {
      title: "Current Balance",
      value: festivalStats?.currentBalance ?? 0,
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      subtitle: "Available funds",
    },
    {
      title: "Pending Amount",
      value: festivalStats?.pendingAmount ?? 0,
      icon: Hourglass,
      color: "from-yellow-500 to-amber-600",
      subtitle: "Awaiting deposit",
    },
  ];

  // Expense Category Cards
  const expenseTemplate = [
    {
      title: "Mahaprasad",
      icon: Utensils,
      color: "from-blue-500 to-blue-600",
      subtitle: "Food & Prasad expenses",
    },
    {
      title: "Decoration",
      icon: Sparkles,
      color: "from-green-500 to-emerald-600",
      subtitle: "Stage & Lighting",
    },
    {
      title: "Mandap",
      icon: Building2,
      color: "from-orange-500 to-amber-600",
      subtitle: "Stage & Mandap setup",
    },
    {
      title: "Sound",
      icon: Volume2,
      color: "from-red-500 to-pink-600",
      subtitle: "Audio arrangements",
    },
    {
      title: "Other",
      icon: Package,
      color: "from-purple-500 to-purple-600",
      subtitle: "Miscellaneous",
    },
  ];

  const expenseCards = [
    ...expenseTemplate.map((card) => ({
      ...card,
      value: festivalStats?.categoryTotals?.[card.title] || 0,
    })),
    {
      title: "Total",
      value: festivalStats?.totalExpenses || 0,
      icon: Calculator,
      color: "from-gray-500 to-gray-700",
      subtitle: "Overall Expenses",
    },
  ];

  return (
    <>
      <Card className="rounded-2xl space-y-6">
        <div className="flex items-center justify-between space-x-2 mb-4">
          <h2 className="text-xl font-semibold flex items-center space-x-3 print:text-black">
            <Wallet className="w-6 h-6 text-blue-600" />
            <span>Festival Summary</span>
          </h2>
        </div>

        {/* Festival Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-500 text-sm">Festival Name</p>
            <p className="font-medium text-gray-900 text-base">
              {currentFestival?.name}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Year</p>
            <p className="font-medium text-gray-900 text-base">
              {currentFestival?.year}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {financialCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                variant="outlined-row"
                className="hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm">{card.title}</h3>
                  <p className="text-md font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {formatCurrency(card.value)}
                  </p>
                  {/* <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p> */}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          {expenseCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 sm:px-6"
              >
                {/* Left side */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {card.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {card.subtitle}
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(card.value)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default FestivalSummary;
