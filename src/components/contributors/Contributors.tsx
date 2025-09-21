/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronDown,
  Edit,
  Filter,
  MapPin,
  Phone,
  Plus,
  Search,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { colors, contributorCategories } from "@/lib/constants";
import { useContributorStore } from "@/store/useContributorStore";
import { useEffect, useRef, useState } from "react";
import { AddContributorModal } from "./AddContributorModal";
import type { Contributor } from "@/types/types";
import { Skeleton } from "../ui/skeleton";
import { DeleteContributorDialog } from "./DeleteContributorDialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createQueryParams } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Pagination } from "../ui/Pagination";
import { useAuthStore } from "@/store/useAuthStore";

const Contributors = () => {
  const {
    fetchContributors,
    contributors,
    updateContributor,
    addContributor,
    isLoading,
    queryData,
    searchFilter,
    setSearchFilter,
    setQueryData,
    sorting,
    numOfRecords,
  } = useContributorStore();

  const { isAdmin } = useAuthStore();

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const [searchValue, setSearchValue] = useState(searchFilter?.search ?? "");
  const [category, setCategory] = useState(searchFilter?.category ?? "All");

  const changeCategory = (category: string) => {
    setCategory(category);
    setSearchFilter({ ...searchFilter, category: category });
    setQueryData({ ...queryData, page: 1 });
  };

  // ------------------- NEW: guard for initial restore -------------------
  // We skip the automatic fetchEffect until the restore-from-URL effect finishes.
  const initialLoadRef = useRef(true);
  const restoreTimerRef = useRef<number | null>(null);
  // ---------------------------------------------------------------------

  // Fetch contributors when filters/pagination/sorting change — but only after initial restore is done
  useEffect(() => {
    if (initialLoadRef.current) return; // skip initial automatic fetch while restoring
    fetchContributors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter, queryData, sorting]);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  // Restore filters only on reload, reset on navigation back
  // We restore the filter/query state from URL, then call fetchContributors once.
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "";

    // apply restored UI values
    setSearchValue(search);
    setCategory(categoryParam);

    // set store filters and pagination
    setSearchFilter({
      search,
      category: categoryParam,
    });

    setQueryData({ page, limit });

    // schedule a single fetch on the next tick so state updates above are applied
    // then clear the `initialLoadRef` so future changes trigger fetch normally
    restoreTimerRef.current = window.setTimeout(() => {
      fetchContributors();
      initialLoadRef.current = false;
    }, 0);

    return () => {
      if (restoreTimerRef.current) {
        clearTimeout(restoreTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Update URL: include query params only if there are active filters/sorting
    if (Object.keys(params).length > 0) {
      setSearchParams(query);
      navigate(`/contributors${query}`);
    } else {
      setSearchParams({});
      navigate(`/contributors`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSaveContributor = async (data: Contributor) => {
    const success = editData
      ? await updateContributor(editData?._id, data)
      : await addContributor(data);

    if (success) {
      setShowModal(false);
      setEditData(null);
    }
  };

  const handleEditContributor = (contributor: Contributor) => {
    setEditData({
      _id: contributor._id,
      name: contributor.name,
      category: contributor.category,
      phoneNumber: contributor.phoneNumber ?? "",
      address: contributor.address ?? "",
    });

    setShowModal(true);
  };

  const page = queryData.page ?? 1;
  const limit = queryData.limit ?? 10;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="heading">
          <h1>Contributors </h1>
          <p>Manage festival contributors and their details</p>
        </div>
        <Button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-green-500 to-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Add Contributor
        </Button>
      </div>

      <Card className="space-y-2 rounded-4xl">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or address..."
            className="p-6 pl-12 "
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 mr-4">
            <Filter className="w-5 h-5 muted-text" />
            <span className="text-sm font-medium muted-text">Category:</span>
          </div>

          {/* Example Categories */}
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
      </Card>
      <div className="space-y-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="p-0 border-0">
                <Skeleton className="h-[70px] rounded-xl" />
              </Card>
            ))}
          </>
        ) : contributors?.length === 0 ? (
          // No contributors found
          <Card variant="outlined" className="flex flex-col items-center">
            <User className="w-10 h-10 " />
            <h3 className="text-xl font-semibold">No contributors found</h3>
            <Button className="w-full sm:w-auto rounded-4xl p-5 bg-gradient-to-r from-green-500 to-emerald-600">
              <Plus className="h-4 w-4" />
              Add First Contributor
            </Button>
          </Card>
        ) : (
          <>
            <div>
              {contributors?.length > 0 && (
                <Button variant={"outline"} className="rounded-2xl ">
                  Result Contributors : {numOfRecords}
                </Button>
              )}
            </div>

            {contributors?.map((contributor, index) => (
              <Card
                key={contributor?._id ?? index}
                className="rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 w-full relative"
              >
                <div className="flex flex-col md:flex-row md:items-end">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 ${
                        colors[index % colors.length]
                      } rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {contributor?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>

                    <div className="flex flex-col gap-1">
                      {contributor?.name && (
                        <h3 className="font-semibold text-base text-gray-900">
                          {contributor.name}
                        </h3>
                      )}
                      {contributor?.category && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full w-fit">
                          {contributor.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {(contributor?.phoneNumber || contributor?.address) && (
                    <div className="flex flex-col gap-2 text-sm text-gray-600 pl-1 mt-3 ml-3">
                      {contributor?.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a
                            href={`tel:${contributor.phoneNumber}`}
                            className="hover:underline focus:outline-none"
                          >
                            {contributor.phoneNumber}
                          </a>
                        </div>
                      )}
                      {contributor?.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="break-words">
                            {contributor.address}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {isAdmin && (
                    <div className="flex justify-end gap-3 md:absolute md:top-4 md:right-4">
                      <button
                        onClick={() => handleEditContributor(contributor)}
                        className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Edit className="w-5 h-5 text-blue-500" />
                      </button>
                      <DeleteContributorDialog
                        contributorId={contributor._id}
                        contributorName={contributor.name}
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </>
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

      <AddContributorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveContributor}
        initialData={editData ?? undefined}
      />
    </div>
  );
};

export default Contributors;
