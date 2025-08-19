/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Edit,
  // Download,
  Filter,
  Plus,
  Receipt,
  Search,
  SortAsc,
  SortDesc,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
  colors,
  ContributionStatusEnum,
  contributionStatuses,
  contributorCategories,
} from "@/lib/constants";
import { createQueryParams, formatCurrency } from "@/lib/utils";
import { useFestivalStore } from "@/store/useFestivalStore";
import { AddContributionModal } from "./AddContributionModal";
import { useContributionStore } from "@/store/useContributionStore";
import type { contribution } from "@/types/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "../ui/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { DeleteContributionDialog } from "./DeleteContributionDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuthStore } from "@/store/useAuthStore";

const Contributions = () => {
  const { getFestivalStats, currentFestival, festivalStats } =
    useFestivalStore();
  const { isAdmin } = useAuthStore();
  const {
    contributions,
    fetchContributions,
    isLoading,
    updateContribution,
    addContribution,
    queryData,
    searchFilter,
    setSearchFilter,
    setQueryData,
    sorting,
    setSorting,
    numOfRecords,
  } = useContributionStore();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<contribution | null>(null);
  const [viewMode, setViewMode] = useState<"detailed" | "minimal">("detailed");

  const [searchParams, setSearchParams] = useSearchParams();
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [searchValue, setSearchValue] = useState(searchFilter?.search ?? "");
  const [status, setStatus] = useState(searchFilter?.status ?? "All");
  const [category, setCategory] = useState(searchFilter?.category ?? "All");

  const changeStatus = (status: string) => {
    setStatus(status);
    setSearchFilter({ ...searchFilter, status: status });
  };

  const summaryCards = [
    {
      title: "Deposited",
      value: formatCurrency(festivalStats?.totalCollected ?? 0),
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Pending",
      value: formatCurrency(festivalStats?.pendingAmount ?? 0),
      icon: Clock,
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Total",
      value: formatCurrency(
        (festivalStats?.totalCollected ?? 0) +
          (festivalStats?.pendingAmount ?? 0)
      ),
      icon: Receipt,
      color: "from-blue-500 to-blue-600",
    },
  ];

  useEffect(() => {
    if (currentFestival?._id) {
      getFestivalStats(currentFestival?._id);
      fetchContributions({ festivalId: currentFestival?._id });
    }
  }, [currentFestival, searchFilter, queryData, sorting]);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const statusParam = searchParams.get("status") || "";
    const status = statusParam;
    const categoryParam = searchParams.get("category") || "";
    const category = categoryParam;
    setSearchValue(search);
    setStatus(status);
    setCategory(category);
    setQueryData({ page, limit });
    setSearchFilter({
      search,
      status,
      category: category,
    });
    setQueryData({ ...queryData, page, limit });
  }, []);

  // Sync query to URL
  useEffect(() => {
    const params: Record<string, string> = {};

    if (queryData.page) params.page = queryData.page.toString();
    if (queryData.limit) params.limit = queryData.limit.toString();
    if (searchFilter.search) params.search = searchFilter.search;

    if (searchFilter.status) params.status = searchFilter.status;

    if (sorting.sortField !== "createdAt") params.sortField = sorting.sortField;
    if (sorting.sortOrder !== "desc") params.sortOrder = sorting.sortOrder;

    const query = createQueryParams(params);

    // Update URL: include query params only if there are active filters/sorting
    if (Object.keys(params).length > 0) {
      setSearchParams(query);
      navigate(`/contributions${query}`);
    } else {
      setSearchParams({});
      navigate(`/contributions`);
    }
  }, [queryData, searchFilter, sorting]);

  const handlePageChange = (newPage: number) => {
    setQueryData({ ...queryData, page: newPage });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      setSearchFilter({
        ...searchFilter,
        search: value,
      });
      setQueryData({ ...queryData, page: 1 });
    }, 300);
  };

  const changeSort = (field: string) => {
    if (sorting.sortField === field) {
      setSorting({
        sortField: field,
        sortOrder: sorting.sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      setSorting({ sortField: field, sortOrder: "asc" });
    }
  };

  const clearFilters = () => {
    setSearchValue("");
    setCategory("");
    setStatus("");
    setSearchFilter({
      search: "",
      status: "",
      category: "",
    });
    setQueryData({
      page: 1,
      limit: 10,
    });
    setSorting({
      sortField: "createdAt",
      sortOrder: "desc",
    });

    setSearchParams({});
    navigate("/contributions");
  };

  const handleSaveContribution = async (data: contribution) => {
    const success = editData
      ? await updateContribution(editData._id, data)
      : await addContribution(data);

    if (success) {
      setShowModal(false);
      setEditData(null);
    }
  };

  const handleEditContribution = (c: contribution) => {
    setEditData({
      ...c,
      _id: c._id,
      itemName: c.itemName ?? "",
      amount: c.amount ?? 0,
      type: c.type,
    });

    setShowModal(true);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: string,
    currentData: contribution
  ) => {
    const normalizedStatus = newStatus.toLowerCase();

    await updateContribution(id, {
      ...currentData,
      status: normalizedStatus,
    });
    setQueryData({ ...queryData, page: 1 });
  };

  const changeCategory = (category: string) => {
    setCategory(category);
    setSearchFilter({ ...searchFilter, category: category });
    setQueryData({ ...queryData, page: 1 });
  };

  const page = queryData.page ?? 1;
  const limit = queryData.limit ?? 10;

  return (
    <>
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="heading">
            <h1>Contributions</h1>
            <p>Manage festival contributions and their details</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                setEditData(null);
                setShowModal(true);
              }}
              className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-purple-500 to-purple-600"
            >
              <Plus className="h-4 w-4" />
              Add Contribution
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                variant="outlined"
                className="hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-r ${card.color} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-7 h-7 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">
                      {card.value}
                    </p>
                    <h3 className="text-sm">{card.title}</h3>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="space-y-3 rounded-4xl p-4 md:p-5">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="p-5 pl-12 w-full"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Status:
                </span>
              </div>
              {contributionStatuses?.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => changeStatus(item.value)}
                  variant={status === item.value ? "default" : "outline"}
                  className={`rounded-2xl text-sm ${
                    status === item.value
                      ? "bg-gradient-to-r from-purple-500 to-purple-600"
                      : "outline text-purple-500"
                  } `}
                  size={"sm"}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Category:
                </span>
              </div>
              {contributorCategories?.map((cat, index) => (
                <Button
                  key={index}
                  onClick={() => changeCategory(cat.value)}
                  variant={category === cat.value ? "default" : "outline"}
                  size={"sm"}
                  className={`rounded-2xl ${
                    category === cat.value
                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                      : "outline text-green-500"
                  } `}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Sorting */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Sort by:
              </span>
              <Button
                onClick={() => changeSort("name")}
                variant={sorting.sortField === "name" ? "default" : "outline"}
                className={`rounded-2xl flex items-center gap-1 text-sm ${
                  sorting.sortField === "name"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600"
                    : "outline text-purple-500"
                }`}
                size={"sm"}
              >
                Name{" "}
                {sorting.sortField === "name" &&
                  (sorting.sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  ))}
              </Button>
              <Button
                onClick={() => changeSort("amount")}
                variant={sorting.sortField === "amount" ? "default" : "outline"}
                className={`rounded-2xl flex items-center gap-1 text-sm ${
                  sorting.sortField === "amount"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600"
                    : "outline text-purple-500"
                }`}
                size={"sm"}
              >
                Amount{" "}
                {sorting.sortField === "amount" &&
                  (sorting.sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  ))}
              </Button>

              {/* Clear button */}
              <Button
                onClick={clearFilters}
                variant="destructive"
                className="rounded-2xl text-sm"
                size={"sm"}
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* Contributions List */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === "detailed" ? "minimal" : "detailed")
            }
          >
            {viewMode === "detailed"
              ? "Switch to Minimal View"
              : "Switch to Detailed View"}
          </Button>
        </div>
        <div className="space-y-4">
          {contributions.length === 0 ? (
            <Card variant="outlined" className="flex flex-col items-center p-6">
              <User className="w-10 h-10 mb-2" />
              <h3 className="text-xl font-semibold mb-2">
                No contributions found
              </h3>
              {isAdmin && (
                <Button
                  onClick={() => setShowModal(true)}
                  className="rounded-4xl p-5 bg-gradient-to-r from-purple-500 to-purple-600"
                >
                  <Plus className="h-4 w-4" />
                  Add First Contribution
                </Button>
              )}
            </Card>
          ) : viewMode === "minimal" ? (
            contributions.map((c) => (
              <>
                {isLoading ? (
                  <Card className="p-0 border-0">
                    <Skeleton className="h-[40px] rounded-xl" />
                  </Card>
                ) : (
                  <Card
                    key={c._id}
                    className="rounded-xl p-3 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium truncate">
                        {c?.contributor?.name}
                      </span>

                      <span className="font-semibold">
                        {c.type === "cash"
                          ? formatCurrency(c.amount)
                          : c.itemName || "N/A"}
                      </span>

                      <span
                        className={`status-badge ${
                          c.status === ContributionStatusEnum.DEPOSITED
                            ? "bg-green-100 text-green-700"
                            : c.status === ContributionStatusEnum.PENDING
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        } text-xs px-2 py-0.5 rounded-full whitespace-nowrap`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </Card>
                )}
              </>
            ))
          ) : (
            contributions.map((c, index) => (
              <>
                {isLoading ? (
                  <Card className="p-0 border-0">
                    <Skeleton className="h-[120px] rounded-xl" />
                  </Card>
                ) : (
                  <Card
                    key={c._id}
                    className="rounded-2xl p-4 shadow-sm hover:shadow-md relative"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 ${
                            colors[index % colors.length]
                          } rounded-full flex items-center justify-center text-white font-bold text-base shadow-md`}
                        >
                          {c?.contributor?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base truncate">
                            {c?.contributor?.name}
                          </h3>
                        </div>

                        <span
                          className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                            c.status === ContributionStatusEnum.DEPOSITED
                              ? "bg-green-100 text-green-700"
                              : c.status === ContributionStatusEnum.PENDING
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-gray-500 text-xs">
                            {c.type === "cash" ? "Amount" : "Item"}
                          </span>
                          <p className="font-semibold text-base">
                            {c.type === "cash"
                              ? formatCurrency(c.amount)
                              : c.itemName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Date</span>
                          <p className="font-medium text-sm">
                            {new Date(c.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="flex sm:flex-row sm:items-center justify-between gap-3">
                          <Select
                            value={c.status}
                            onValueChange={(value) =>
                              handleStatusChange(c._id, value, c)
                            }
                          >
                            <SelectTrigger className="sm:w-[180px] w-full border border-gray-200 rounded-lg text-sm">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                              {Object.values(ContributionStatusEnum).map(
                                (status) => (
                                  <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditContribution(c)}
                              className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                            >
                              <Edit className="w-5 h-5 text-blue-500" />
                            </button>
                            <DeleteContributionDialog contributionId={c._id} />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </>
            ))
          )}
        </div>

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
                    onClick={() => {
                      setQueryData({ ...queryData, limit: size, page: 1 });
                    }}
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

          {/* Pagination controls */}
          <div className="flex justify-start sm:justify-end">
            <Pagination
              currentPage={queryData?.page ?? 1}
              totalPages={Math.ceil(numOfRecords / (queryData?.limit ?? 10))}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isAdmin && (
        <AddContributionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveContribution}
          initialData={editData ?? undefined}
        />
      )}
    </>
  );
};

export default Contributions;
