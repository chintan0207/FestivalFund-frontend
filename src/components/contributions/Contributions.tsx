/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  ChevronDown,
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
import {
  colors,
  ContributionStatusEnum,
  contributionStatuses,
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

const Contributions = () => {
  const { getFestivalStats, currentFestival, festivalStats } =
    useFestivalStore();

  const {
    contributions,
    fetchContributions,
    updateContribution,
    addContribution,
    queryData,
    searchFilter,
    setSearchFilter,
    setQueryData,
    sorting,
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
    setSearchValue(search);
    setStatus(status);
    setQueryData({ page, limit });
    setSearchFilter({
      search,
      status,
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

  const handleSaveContribution = async (data: contribution) => {
    const success = editData
      ? await updateContribution(editData._id, data)
      : await addContribution(data);

    if (success) {
      setShowModal(false);
      setEditData(null);
    }
  };

  const handleStatusChange = (
    id: string,
    newStatus: string,
    currentData: contribution
  ) => {
    const normalizedStatus = newStatus.toLowerCase();

    updateContribution(id, {
      ...currentData,
      status: normalizedStatus,
    });
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

        {/* Search & Filters */}
        <Card className="space-y-2 rounded-4xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="p-6 pl-12"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2 mr-4">
              <Filter className="w-5 h-5 muted-text" />
              <span className="text-sm font-medium muted-text">Filter by:</span>
            </div>
            {contributionStatuses?.map((item, index) => (
              <Button
                key={index}
                onClick={() => changeStatus(item.value)}
                variant={status === item.value ? "default" : "outline"}
                className="rounded-2xl "
              >
                {item.label}
              </Button>
            ))}
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
              <Button
                onClick={() => setShowModal(true)}
                className="rounded-4xl p-5 bg-gradient-to-r from-purple-500 to-purple-600"
              >
                <Plus className="h-4 w-4" />
                Add First Contribution
              </Button>
            </Card>
          ) : viewMode === "minimal" ? (
            contributions.map((c) => (
              <Card
                key={c._id}
                className="rounded-2xl p-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{c?.contributor?.name}</span>

                  <span className="font-medium">
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
                    } text-xs px-2 py-0.5 rounded-full`}
                  >
                    {c.status}
                  </span>
                </div>
              </Card>
            ))
          ) : (
            contributions.map((c, index) => (
              <Card
                key={c._id}
                className="rounded-2xl p-6 shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 ${
                        colors[index % colors.length]
                      } rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {c?.contributor?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 ">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {c?.contributor?.name}
                        </h3>
                        <span
                          className={`status-badge ${
                            c.status === ContributionStatusEnum.DEPOSITED
                              ? "bg-green-100 text-green-700"
                              : c.status === ContributionStatusEnum.PENDING
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          } text-xs px-2 py-0.5 rounded-full`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="muted-text">
                            {c.type === "cash" ? "Amount" : "Item"}:
                          </span>
                          <p className="font-semibold text-lg">
                            {c.type === "cash"
                              ? formatCurrency(c.amount)
                              : c.itemName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="muted-text">Date:</span>
                          <p>{new Date(c.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end sm:flex-row gap-2 w-full">
                    <select
                      value={c.status}
                      onChange={(e) =>
                        handleStatusChange(c._id, e.target.value, c)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm  lg:w-[200px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="deposited">Deposited</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <Button variant="outline">
                      <Download className="w-5 h-5" />
                      <span>Generate Slip</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Rows per page selector */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <p className="whitespace-nowrap">Rows per page:</p>

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
      <AddContributionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveContribution}
        initialData={editData ?? undefined}
      />
    </>
  );
};

export default Contributions;
