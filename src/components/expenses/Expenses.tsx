/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Utensils,
  Sparkles,
  Volume2,
  Package,
  Plus,
  Building2,
  Search,
  Filter,
  Receipt,
  Edit,
  ChevronDown,
  Calculator,
} from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency, createQueryParams } from "@/lib/utils";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { expenseCategories } from "@/lib/constants";
import AddExpenseModal from "./AddExpenseModal";
import { useEffect, useRef, useState } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { Expense } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Pagination } from "../ui/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DeleteExpenseDialog } from "./DeleteExpenseDialog";
import { useFestivalStore } from "@/store/useFestivalStore";

const Expenses = () => {
  const { getFestivalStats, currentFestival, festivalStats } =
    useFestivalStore();

  const summaryCards = [
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
    ...summaryCards.map((card) => ({
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

  const {
    expenses,
    addExpense,
    updateExpense,
    fetchExpenses,
    searchFilter,
    setSearchFilter,
    queryData,
    setQueryData,
    sorting,
    numOfRecords,
  } = useExpenseStore();

  const { isAdmin } = useAuthStore();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [searchValue, setSearchValue] = useState(searchFilter?.search ?? "");
  const [category, setCategory] = useState(searchFilter?.category ?? "All");

  // Category change
  const changeCategory = (cat: string) => {
    setCategory(cat);
    setSearchFilter({ ...searchFilter, category: cat });
    setQueryData({ ...queryData, page: 1 });
  };

  useEffect(() => {
    getFestivalStats(currentFestival?._id);
  }, []);

  // Fetch expenses on changes
  useEffect(() => {
    fetchExpenses();
  }, [searchFilter, queryData, sorting]);

  // Cleanup debounce
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  // Restore filters only on reload
  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    const isReload =
      navEntries.length > 0 &&
      (navEntries[0] as PerformanceNavigationTiming).type === "reload";

    if (isReload) {
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const search = searchParams.get("search") || "";
      const categoryParam = searchParams.get("category") || "";

      setSearchValue(search);
      setCategory(categoryParam);
      setSearchFilter({ search, category: categoryParam });
      setQueryData({ ...queryData, page, limit });
    } else {
      setSearchValue("");
      setCategory("");
      setSearchFilter({ search: "", category: "" });
      setQueryData({ page: 1, limit: 10 });
    }
  }, []);

  // Sync query to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (queryData.page) params.page = queryData.page.toString();
    if (queryData.limit) params.limit = queryData.limit.toString();
    if (searchFilter.search) params.search = searchFilter.search;
    if (searchFilter.category) params.category = searchFilter.category;
    if (sorting.sortField !== "createdAt") params.sortField = sorting.sortField;
    if (sorting.sortOrder !== "desc") params.sortOrder = sorting.sortOrder;

    const query = createQueryParams(params);

    if (Object.keys(params).length > 0) {
      setSearchParams(query);
      navigate(`/expenses${query}`);
    } else {
      setSearchParams({});
      navigate(`/expenses`);
    }
  }, [queryData, searchFilter, sorting]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      setSearchFilter({ ...searchFilter, search: value });
      setQueryData({ ...queryData, page: 1 });
    }, 300);
  };

  const handlePageChange = (newPage: number) => {
    setQueryData({ ...queryData, page: newPage });
  };

  const handleSaveExpense = async (expense: Expense) => {
    const success = editData
      ? await updateExpense(editData?._id, expense)
      : await addExpense(expense);

    if (success) {
      setShowModal(false);
      setEditData(null);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setShowModal(true);
    setEditData(expense);
  };

  const page = queryData.page ?? 1;
  const limit = queryData.limit ?? 10;

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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="heading">
          <h1>Expenses</h1>
          <p>Track and manage festival expenses</p>
        </div>
        <Button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-red-500 to-pink-600"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
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

      {/* Search + Filters */}
      <Card className="space-y-3 rounded-4xl p-4 md:p-5">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by description..."
            className="p-5 pl-12 w-full"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Category:</span>
          </div>
          {expenseCategories?.map((item, index) => (
            <Button
              key={index}
              onClick={() => changeCategory(item.value)}
              variant={category === item.value ? "default" : "outline"}
              size="sm"
              className={`rounded-2xl ${
                category === item.value
                  ? "bg-gradient-to-r from-red-500 to-pink-600"
                  : "outline text-red-500"
              }`}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Expense list */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <Card className="flex flex-col items-center p-12">
            <Receipt className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold">No expenses found</h3>
            {isAdmin && (
              <Button
                onClick={() => {
                  setEditData(null);
                  setShowModal(true);
                }}
                className="mt-4 rounded-4xl p-5 bg-gradient-to-r from-red-500 to-pink-600"
              >
                <Plus className="w-5 h-5" />
                Add First Expense
              </Button>
            )}
          </Card>
        ) : (
          expenses.map((expense: Expense) => (
            <Card key={expense._id} className="rounded-2xl p-4 gap-2">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-r ${getCategoryGradient(
                    expense?.category
                  )} flex items-center justify-center text-white shadow-md`}
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
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditExpense(expense)}
                    className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit className="w-5 h-5 text-blue-500" />
                  </button>
                  <DeleteExpenseDialog expenseId={expense._id} />
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Pagination + Page size */}
      <div className="mt-8 flex sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="min-w-[64px] justify-between"
              >
                {queryData?.limit}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {[2, 5, 10, 20, 50].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() =>
                    setQueryData({ ...queryData, limit: size, page: 1 })
                  }
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="text-xs sm:text-sm">
            {queryData
              ? `${Math.min((page - 1) * limit + 1, numOfRecords)}–${Math.min(
                  page * limit,
                  numOfRecords
                )} of ${numOfRecords}`
              : `0 of ${numOfRecords}`}
          </div>
        </div>

        <Pagination
          currentPage={queryData?.page ?? 1}
          totalPages={Math.ceil(numOfRecords / (queryData?.limit ?? 10))}
          onPageChange={handlePageChange}
        />
      </div>

      <AddExpenseModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveExpense}
        initialData={editData ?? undefined}
      />
    </div>
  );
};

export default Expenses;
