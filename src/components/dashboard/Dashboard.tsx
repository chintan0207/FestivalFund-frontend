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

const Dashboard = () => {
  const summaryCards = [
    {
      title: "Opening Balance",
      value: 0,
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      subtitle: "Initial funds",
    },
    {
      title: "Total Collected",
      value: 6500,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      subtitle: "From contributions",
    },
    {
      title: "Total Spent",
      value: 9000,
      icon: TrendingDown,
      color: "from-red-500 to-pink-600",
      subtitle: "On expenses",
    },
    {
      title: "Current Balance",
      value: 10000,
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      subtitle: "Available funds",
    },
  ];

  const quickStats = [
    {
      label: "Pending Amount",
      value: 4000,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Total Contributors",
      value: 20,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Total Expenses",
      value: 30,
      icon: Receipt,
      color: "text-purple-600",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="heading">
          <h1>Festival Dashboard</h1>
          <p>Overview of contributions and expenses</p>
        </div>
        {/* Festival Selector */}
        <div className="relative">
          <Card className="p-3 ">
            <div className="flex items-center gap-3">
              <div className="bg-PRIMARY p-3 rounded-full">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium">Ganesh Chaturthi</p>
                <p className="text-sm muted-text">2025</p>
              </div>
              <ChevronDown className="w-5 h-5" />
            </div>
          </Card>

          {/* Always visible list */}
          {/* <div className="absolute top-full mt-2 w-full card p-2 z-10 shadow-lg">
            <div className="w-full text-left p-3 rounded-lg transition-colors bg-PRIMARY text-white">
              <p className="font-medium">Ganesh Chaturthi</p>
              <p className="text-sm opacity-75">2025</p>
            </div>

            <div className="w-full text-left p-3 rounded-lg transition-colors hover:bg-gray-100">
              <p className="font-medium">Navratri</p>
              <p className="text-sm opacity-75">2025</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Summary Cards without animation */}
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

      {/*quick overview*/}
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

      {/*Actions card*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card variant="outlined">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button className="w-full rounded-2xl h-12">
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
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="muted-text">Festival Name</span>
              <span className="font-medium">Ganesh Chaturthi</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="muted-text">Year</span>
              <span className="font-medium">2025</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="muted-text">Opening Balance</span>
              <span className="font-medium">Rs. 20,000</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
