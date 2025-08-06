import {
  Edit,
  Filter,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash,
  User,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { colors } from "@/lib/constants";

const Contributors = () => {
  const summaryCards = [
    {
      title: "Total",
      value: 5,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Parents",
      value: 2,
      icon: User,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Boys",
      value: 2,
      icon: User,
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Girls",
      value: 1,
      icon: User,
      color: "from-purple-500 to-purple-600",
    },
  ];
  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="heading">
          <h1>Contributors </h1>
          <p>Manage festival contributors and their details</p>
        </div>
        <Button className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-green-500 to-emerald-600">
          <Plus className="h-4 w-4" />
          Add Contributor
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
                  className={`w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-r ${card.color} rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300`}
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
            placeholder="Search by name or address..."
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
            Category 1
          </Button>
          <Button className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
            Category 2
          </Button>
          <Button className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
            Category 3
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <Card variant="outlined" className="flex flex-col items-center">
          <User className="w-10 h-10 " />
          <h3 className="text-xl font-semibold">No contributors found</h3>
          <Button className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-green-500 to-emerald-600">
            <Plus className="h-4 w-4" />
            Add First Contributor
          </Button>
        </Card>

        {[1, 2, 3].map((_, index) => (
          <Card
            key={index}
            className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                      John Doe
                    </h3>
                    <span className="status-badge bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      Category
                    </span>
                  </div>

                  {/* Contact Info - responsive */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>+91 9876543210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">123 Main Street, City</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {/* Edit */}
                <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                  <Edit className="w-5 h-5 text-blue-500" />
                </button>

                {/* Delete */}
                <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                  <Trash className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
