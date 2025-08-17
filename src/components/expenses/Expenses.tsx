/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Utensils,
  Sparkles,
  Volume2,
  Package,
  Plus,
  Tag,
  Building2,
  Calculator,
  Search,
  Filter,
  Receipt,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "@/lib/utils";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { expenseCategories } from "@/lib/constants";
import AddExpenseModal from "./AddExpenseModal";
import { useState } from "react";

const Expenses = () => {
  const summaryCards = [
    {
      title: "Mahaprasad",
      value: 8000,
      icon: Utensils,
      color: "from-blue-500 to-blue-600",
      subtitle: "Food & Prasad expenses",
    },
    {
      title: "Decoration",
      value: 15000,
      icon: Sparkles,
      color: "from-green-500 to-emerald-600",
      subtitle: "Stage & Lighting",
    },
    {
      title: "Mandap",
      value: 10000,
      icon: Building2,
      color: "from-orange-500 to-amber-600",
      subtitle: "Stage & Mandap setup",
    },

    {
      title: "Sound System",
      value: 12000,
      icon: Volume2,
      color: "from-red-500 to-pink-600",
      subtitle: "Audio arrangements",
    },
    {
      title: "Other",
      value: 0.0,
      icon: Package,
      color: "from-purple-500 to-purple-600",
      subtitle: "Miscellaneous",
    },
    {
      title: "Total",
      value: 35000.0,
      icon: Calculator,
      color: "from-gray-500 to-gray-700",
      subtitle: "Overall Expenses",
    },
  ];

  const dummyExpenses = [
    {
      id: 1,
      description: "Mahaprasad Lunch",
      category: "Mahaprasad",
      amount: 8000,
      date: "2025-08-10",
    },
    {
      id: 2,
      description: "Stage Decoration",
      category: "Decoration",
      amount: 15000,
      date: "2025-08-12",
    },
    {
      id: 3,
      description: "Mandap Setup",
      category: "Mandap",
      amount: 10000,
      date: "2025-08-13",
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Mahaprasad":
        return <Utensils className="w-4 h-4" />;
      case "Decoration":
        return <Sparkles className="w-4 h-4" />;
      case "Mandap":
        return <Building2 className="w-4 h-4" />;
      case "Sound":
        return <Volume2 className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "Mahaprasad":
        return "from-blue-500 to-blue-600";
      case "Decoration":
        return "from-green-500 to-emerald-600";
      case "Mandap":
        return "from-orange-500 to-amber-600";
      case "Sound":
        return "from-red-500 to-pink-600";
      default:
        return "from-purple-500 to-purple-600";
    }
  };

  const isAdmin = true;

  const [showModal, setShowModal] = useState(false);

  const handleAddExpense = (expense: any) => {
    console.log("New expense added:", expense);
    // call API
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="heading">
          <h1>Expense</h1>
          <p>Track and manage festival expenses</p>
        </div>
        <Button
          onClick={() => {
            // setEditData(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-red-500 to-pink-600"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Tag className="w-5 h-5 text-red-500" />
        <span>Expense by Category</span>
      </h2>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`flex items-center justify-between px-4 py-3 sm:px-6 ${
                card.title === "Total"
                  ? "bg-gray-50 dark:bg-gray-800 font-semibold"
                  : ""
              }`}
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

      <Card className="space-y-3 rounded-4xl p-4 md:p-5">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="p-5 pl-12 w-full"
            // value={searchValue}
            // onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">
                Category:
              </span>
            </div>
            {expenseCategories?.map((item, index) => (
              <Button
                key={index}
                // onClick={() => changeStatus(item.value)}
                variant={status === item.value ? "default" : "outline"}
                className="rounded-2xl text-sm"
                size={"sm"}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {dummyExpenses.length === 0 ? (
          <div className="modern-card p-12 text-center">
            <Receipt className="w-16 h-16 mx-auto muted-text mb-4" />
            <h3 className="text-xl font-semibold mb-2">No expenses found</h3>
            <p className="muted-text max-w-md mx-auto">
              Get started by adding your first expense record
            </p>
            {isAdmin && (
              <button className="btn-primary mt-6 inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add First Expense</span>
              </button>
            )}
          </div>
        ) : (
          dummyExpenses.map((expense) => (
            <Card key={expense.id} className="rounded-2xl p-4 gap-2  ">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-r ${getCategoryGradient(
                    expense?.category
                  )} flex items-center justify-center text-white text-base shadow-md`}
                >
                  {getCategoryIcon(expense?.category)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-base text-gray-900">
                      {expense?.description}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {expense?.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="muted-text block text-xs">Amount</span>
                  <p className="font-bold text-lg text-red-600">
                    {formatCurrency(expense?.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="muted-text block text-xs">Date</span>
                  <p className="font-medium text-gray-900">
                    {new Date(expense?.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="flex justify-end gap-2 border-gray-100">
                  <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <Edit className="w-5 h-5 text-blue-500" />
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <AddExpenseModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
};

export default Expenses;
