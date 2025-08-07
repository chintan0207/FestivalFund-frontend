import {
  CheckCircle,
  Clock,
  Download,
  Filter,
  Plus,
  Receipt,
  Search,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { colors } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const Contributions = () => {
  const summaryCards = [
    {
      title: "Deposited",
      value: formatCurrency(6000),
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Pending",
      value: formatCurrency(3000),
      icon: Clock,
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Total",
      value: formatCurrency(9500),
      icon: Receipt,
      color: "from-blue-500 to-blue-600",
    },
  ];
  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="heading">
          <h1>Contributors </h1>
          <p>Manage festival contributors and their details</p>
        </div>
        <Button className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-purple-500 to-purple-600">
          <Plus className="h-4 w-4" />
          Add Contribution
        </Button>
      </div>

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
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-r ${card?.color} rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {card.value}
                  </p>
                  <h3 className="text-sm">{card.title}</h3>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="space-y-2 rounded-4xl">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name..."
            className="p-6 pl-12 "
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 mr-4">
            <Filter className="w-5 h-5 muted-text" />
            <span className="text-sm font-medium muted-text">Filter by:</span>
          </div>

          {/* Example Categories */}
          <Button className="px-4 py-2 rounded-xl text-sm font-medium gradient-primary text-white shadow-lg border-transparent">
            All
          </Button>
          <Button className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
            Deposited
          </Button>
          <Button className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
            Pending
          </Button>
          <Button className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
            Cancelled
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <Card variant="outlined" className="flex flex-col items-center">
          <User className="w-10 h-10 " />
          <h3 className="text-xl font-semibold">No contribution found</h3>
          <Button className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-purple-500 to-purple-600">
            <Plus className="h-4 w-4" />
            Add First Contribution
          </Button>
        </Card>

        {[1, 2, 3].map((_, index) => (
          <Card
            key={index}
            className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left: Avatar + Info */}
              <div className="flex items-start space-x-4 flex-1">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 ${
                    colors[index % colors.length]
                  } rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                >
                  J
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {/* Name + Status */}
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                      John Doe
                    </h3>
                    <span className="status-badge bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      Deposited
                    </span>
                  </div>

                  {/* Amount + Date */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="muted-text">Amount:</span>
                      <p className="font-semibold text-lg primary-text">
                        ₹15,000
                      </p>
                    </div>
                    <div>
                      <span className="muted-text">Date:</span>
                      <p className="font-medium">06/08/2025</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Status dropdown */}
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  <option value="Pending">Pending</option>
                  <option value="Deposited" selected>
                    Deposited
                  </option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Generate Slip */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate Slip</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Contributions;
