import { useState, useEffect } from "react";
import { Button, ButtonLoading } from "@/components/ui/button";
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
import { Calendar, IndianRupee, Loader2Icon, Sparkle } from "lucide-react";
import { festivalSchema } from "@/lib/validation";
import { useFestivalStore } from "@/store/useFestivalStore";

export interface FestivalData {
  name: string;
  year: number;
  openingBalance: number;
}

interface AddFestivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FestivalData) => void;
  initialData?: FestivalData;
}

export function AddFestivalModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddFestivalModalProps) {
  const { isbtnLoading } = useFestivalStore();

  const [festival, setFestival] = useState<FestivalData>({
    name: "",
    year: new Date().getFullYear(),
    openingBalance: 0,
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FestivalData, string>>
  >({});

  // Fill in values if editing
  useEffect(() => {
    if (initialData) {
      setFestival(initialData);
    } else {
      setFestival({
        name: "",
        year: new Date().getFullYear(),
        openingBalance: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFestival((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "openingBalance"
          ? value === ""
            ? ("" as unknown as number)
            : Number(value)
          : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = festivalSchema.safeParse(festival);
    if (!result.success) {
      const errors: Partial<Record<keyof FestivalData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FestivalData;
        errors[field] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    onSubmit?.(festival);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Festival" : "Add New Festival"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Update the festival details below."
                : "Enter the festival details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 mt-7">
            <div className="grid gap-2 relative">
              <Label htmlFor="name">Festival Name</Label>
              <Input
                id="name"
                name="name"
                value={festival.name}
                onChange={handleChange}
                placeholder="e.g. Ganesh Chaturthi"
                leftIcon={<Sparkle className="w-4 h-4" />}
              />
              {formErrors.name && (
                <span className="input-error">{formErrors.name}</span>
              )}
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={festival.year}
                onChange={handleChange}
                placeholder="e.g. 2025"
                leftIcon={<Calendar className="w-4 h-4" />}
              />
              {formErrors.year && (
                <span className="input-error">{formErrors.year}</span>
              )}
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="openingBalance">Opening Balance</Label>
              <Input
                id="openingBalance"
                name="openingBalance"
                type="number"
                value={festival.openingBalance}
                onChange={handleChange}
                placeholder="e.g. 15000"
                leftIcon={<IndianRupee className="w-4 h-4" />}
              />
              {formErrors.openingBalance && (
                <span className="input-error">{formErrors.openingBalance}</span>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-2xl" type="button">
                Cancel
              </Button>
            </DialogClose>
            {isbtnLoading ? (
              <ButtonLoading />
            ) : (
              <Button
                className="rounded-2xl flex items-center gap-2"
                type="submit"
              >
                {isbtnLoading && (
                  <Loader2Icon className="animate-spin w-4 h-4" />
                )}
                {initialData ? "Save Changes" : "Add Festival"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
