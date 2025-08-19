import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Phone, Home, Loader2Icon } from "lucide-react";
import { useContributorStore } from "@/store/useContributorStore";
import { contributorSchema } from "@/lib/validation";
import type { Contributor } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFestivalStore } from "@/store/useFestivalStore";

interface AddContributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Contributor) => void;
  initialData?: Contributor;
}

export function AddContributorModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddContributorModalProps) {
  const { isbtnLoading } = useContributorStore();
  const { currentFestival } = useFestivalStore();

  const [contributor, setContributor] = useState<Contributor>({
    name: "",
    phoneNumber: "",
    address: "",
    category: "",
    festivalId: currentFestival?._id ?? "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof Contributor, string>>
  >({});

  useEffect(() => {
    if (initialData) {
      setContributor(initialData);
    } else {
      setContributor({
        name: "",
        phoneNumber: "",
        address: "",
        category: "",
        festivalId: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContributor((prev) => ({
      ...prev,
      [name]: value,
      festivalId: currentFestival?._id ?? "",
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = contributorSchema.safeParse(contributor);
    if (!result.success) {
      const errors: Partial<Record<keyof Contributor, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof Contributor;
        errors[field] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    onSubmit?.(contributor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Contributor" : "Add New Contributor"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Update the contributor details below."
                : "Enter the contributor details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-7 mt-7">
            <div className="grid gap-2 relative">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={contributor?.name}
                onChange={handleChange}
                placeholder="e.g. Chintan Patel"
                leftIcon={<User className="w-4 h-4" />}
              />
              {formErrors?.name && (
                <span className="input-error">{formErrors?.name}</span>
              )}
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="category">Category</Label>
              <Select
                value={contributor.category}
                onValueChange={(value) =>
                  setContributor((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boys">Boys</SelectItem>
                  <SelectItem value="Parents">Parents</SelectItem>
                  <SelectItem value="Girls">Girls</SelectItem>
                </SelectContent>
              </Select>

              {formErrors?.category && (
                <span className="input-error">{formErrors?.category}</span>
              )}
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={contributor?.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 9624041844"
                leftIcon={<Phone className="w-4 h-4" />}
              />
              {formErrors?.phoneNumber && (
                <span className="input-error">{formErrors?.phoneNumber}</span>
              )}
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={contributor?.address}
                onChange={handleChange}
                placeholder="e.g. Dukan faliya, Ghej"
                leftIcon={<Home className="w-4 h-4" />}
              />
              {formErrors?.address && (
                <span className="input-error">{formErrors?.address}</span>
              )}
            </div>

            {/* <div className="grid gap-2 relative">
              <Label htmlFor="festivalId">Festival ID</Label>
              <Input
                id="festivalId"
                name="festivalId"
                value={contributor?.festivalId}
                onChange={handleChange}
                placeholder="Festival ID (auto-linked preferred)"
              />
              {formErrors?.festivalId && (
                <span className="input-error">{formErrors?.festivalId}</span>
              )}
            </div> */}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-2xl" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="rounded-2xl flex items-center gap-2"
              type="submit"
              disabled={isbtnLoading}
            >
              {isbtnLoading && <Loader2Icon className="animate-spin w-4 h-4" />}
              {initialData ? "Save Changes" : "Add Contributor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
