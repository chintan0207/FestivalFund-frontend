/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AvailableContributionTypes,
  ContributionStatusEnum,
  AvailableContributorCategories,
  ContributionTypeEnum,
} from "@/lib/constants";
import type { contribution } from "@/types/types";
import { useContributorStore } from "@/store/useContributorStore";
import { useFestivalStore } from "@/store/useFestivalStore";

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData?: contribution;
}

export function AddContributionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddContributionModalProps) {
  const { fetchContributors, contributors } = useContributorStore();
  const { currentFestival } = useFestivalStore();

  const emptyContribution: contribution = {
    contributorId: "",
    festivalId: currentFestival?._id ?? "",
    type: ContributionTypeEnum.CASH,
    status: ContributionStatusEnum.PENDING, // default
    amount: null,
    date: new Date().toISOString(),
    itemName: "",
  };

  const [contribution, setContribution] =
    useState<contribution>(emptyContribution);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isNewContributor, setIsNewContributor] = useState(false);
  const [newContributor, setNewContributor] = useState({
    name: "",
    category: AvailableContributorCategories[0],
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    if (initialData) {
      setContribution({
        ...initialData,
        date:
          typeof initialData.date === "string"
            ? initialData.date
            : new Date(initialData.date).toISOString(),
      });
      setSearchTerm(initialData.contributor?.name ?? "");
    } else {
      setContribution(emptyContribution);
      setSearchTerm("");
      setIsNewContributor(false);
      setNewContributor({
        name: "",
        category: AvailableContributorCategories[0],
        phoneNumber: "",
        address: "",
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (searchTerm.trim().length >= 1) {
      fetchContributors({ search: searchTerm });
    }
  }, [searchTerm, fetchContributors]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    const results = contributors.filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(results);
  };

  const selectContributor = (contributor: any) => {
    setContribution((prev) => ({ ...prev, contributorId: contributor._id }));
    setIsNewContributor(false);
    setSearchTerm(contributor.name);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      ...contribution,
      ...(isNewContributor && newContributor),
    };

    if (!payload.contributorId) {
      delete payload.contributorId;
    }

    onSubmit?.(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Contribution" : "Add New Contribution"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Update the contribution details."
                : "Search for a contributor or add a new one."}
            </DialogDescription>
          </DialogHeader>

          {/* Contributor Search */}
          <div className="grid gap-2 mt-4 relative">
            <Label>Contributor</Label>
            <Input
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search contributor by name"
            />
            {suggestions.length > 0 && (
              <div className="z-10 bg-white border rounded-md mt-1 w-full shadow-lg max-h-40 overflow-auto">
                {suggestions.map((c) => (
                  <div
                    key={c._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectContributor(c)}
                  >
                    {c.name} ({c.category})
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="mt-4 rounded-2xl mb-4"
              onClick={() => {
                setIsNewContributor(true);
                setContribution((prev) => ({ ...prev, contributorId: "" }));
              }}
            >
              + Add New Contributor
            </Button>
          </div>

          {/* New Contributor Fields */}
          {isNewContributor && (
            <div className="mb-6 space-y-2 p-4 rounded-md border border-gray-100">
              <div className="grid gap-2 mb-4">
                <Label>Name</Label>
                <Input
                  value={newContributor.name}
                  placeholder="e.g. Chintan Patel"
                  onChange={(e) =>
                    setNewContributor({
                      ...newContributor,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2 mb-4">
                <Label>Category</Label>
                <Select
                  value={newContributor.category}
                  onValueChange={(val) =>
                    setNewContributor({ ...newContributor, category: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {AvailableContributorCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 mb-4">
                <Label>Phone</Label>
                <Input
                  value={newContributor.phoneNumber}
                  placeholder="e.g. 7624041844"
                  onChange={(e) =>
                    setNewContributor({
                      ...newContributor,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2 mb-4">
                <Label>Address</Label>
                <Input
                  value={newContributor.address}
                  placeholder="e.g. Dukan faliya, Ghej"
                  onChange={(e) =>
                    setNewContributor({
                      ...newContributor,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Contribution Details */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3">
              {/* Type */}
              <div className="grid gap-2 w-full">
                <Label>Contribution Type</Label>
                <Select
                  value={contribution.type}
                  onValueChange={(value) =>
                    setContribution((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {AvailableContributionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="grid gap-2 w-full">
                <Label>Status</Label>
                <Select
                  value={contribution.status}
                  onValueChange={(value) =>
                    setContribution((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {Object.values(ContributionStatusEnum).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount (if cash) */}
            {contribution.type === "cash" && (
              <div className="grid gap-2 w-full">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={contribution.amount ?? ""}
                  placeholder="₹ 1001"
                  onChange={(e) => {
                    const value = e.target.value;
                    setContribution((prev) => ({
                      ...prev,
                      amount: value === "" ? undefined : Number(value),
                    }));
                  }}
                />
              </div>
            )}

            {/* Item Name (if item) */}
            {contribution.type === "item" && (
              <div className="grid gap-2 w-full">
                <Label>Item Name</Label>
                <Input
                  value={contribution.itemName || ""}
                  onChange={(e) =>
                    setContribution((prev) => ({
                      ...prev,
                      itemName: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 ">
            <DialogClose asChild>
              <Button className="rounded-2xl" variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button className="rounded-2xl mb-3" type="submit">
              <Loader2Icon className="animate-spin w-4 h-4 hidden" />
              {initialData ? "Save Changes" : "Add Contribution"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
