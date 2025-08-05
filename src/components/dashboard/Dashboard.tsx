/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Activity,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Eye,
  Receipt,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AddFestivalModal } from "./AddFestivalModal";
import { useState } from "react";
import { useFestivalStore } from "@/store/useFestivalStore";
import { FestivalDropdown } from "./FestivalDropdown";

const Dashboard = () => {
  const { addFestival, currentFestival } = useFestivalStore();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<null | {
    name: string;
    year: number;
    openingBalance: number;
  }>(null);

  const handleAddFestival = async (data: {
    name: string;
    year: number;
    openingBalance: number;
  }) => {
    const success = await addFestival(data);
    if (success) setShowModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const summaryCards = [
    {
      title: "Opening Balance",
      value: currentFestival?.stats?.openingBalance ?? 0,
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      subtitle: "Initial funds",
    },
    {
      title: "Total Collected",
      value: currentFestival?.stats?.totalCollected ?? 0,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      subtitle: "From contributions",
    },
    {
      title: "Total Spent",
      value: currentFestival?.stats?.totalExpenses ?? 0,
      icon: TrendingDown,
      color: "from-red-500 to-pink-600",
      subtitle: "On expenses",
    },
    {
      title: "Current Balance",
      value: currentFestival?.stats?.currentBalance ?? 0,
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      subtitle: "Available funds",
    },
  ];

  const quickStats = [
    {
      label: "Pending Amount",
      value: currentFestival?.stats?.pendingAmount ?? 0,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Total Contributors",
      value: 20, // replace with actual count from API if available
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Total Expenses",
      value: 30, // replace with actual count from API if available
      icon: Receipt,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="heading">
          <h1>Festival Dashboard</h1>
          <p>Overview of contributions and expenses</p>
        </div>
        {/* Festival Selector */}
        <FestivalDropdown />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              variant="outlined"
              className="hover:shadow-lg transition-all duration-300 "
            >
              {/* Top section with icon */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>

              {/* Title, value, subtitle */}
              <div>
                <h3 className="text-sm">{card.title}</h3>
                <p className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                  {formatCurrency(card.value)}
                </p>
                <p className="text-xs text-gray-400 mt-2">{card.subtitle}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Overview */}
      <div>
        <Card
          variant="outlined"
          className="hover:shadow-lg transition-all duration-300 "
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-PRIMARY" />
            <span>Quick Overview</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickStats?.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {stat.label.includes("Amount")
                        ? formatCurrency(stat.value)
                        : stat.value}
                    </p>
                    <p className="text-sm muted-text">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Actions and Festival Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card variant="outlined">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setEditData(null);
                setShowModal(true);
              }}
              className="w-full rounded-2xl h-12"
            >
              <Sparkles className="w-5 h-5" />
              Create New Festival
            </Button>
            <Button className="w-full rounded-2xl h-12 bg-green-600 hover:bg-green-600/90">
              <Download className="w-5 h-5" />
              Export Summary PDF
            </Button>
            <Button className="w-full rounded-2xl h-12 bg-pink-700 hover:bg-pink-700/90">
              <Eye className="w-5 h-5" />
              Print Report
            </Button>
          </div>
        </Card>

        {/* Festival Info */}
        <Card variant="outlined">
          <h2 className="text-lg font-semibold mb-4">Festival Details</h2>
          {currentFestival ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="muted-text">Festival Name</span>
                <span className="font-medium">{currentFestival.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="muted-text">Year</span>
                <span className="font-medium">{currentFestival.year}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="muted-text">Opening Balance</span>
                <span className="font-medium">
                  {formatCurrency(currentFestival.stats?.openingBalance ?? 0)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No festival selected</p>
          )}
        </Card>
      </div>

      <AddFestivalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddFestival}
        initialData={editData ?? undefined}
      />
    </div>
  );
};

export default Dashboard;
