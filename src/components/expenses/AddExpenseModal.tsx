/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useFestivalStore } from "@/store/useFestivalStore";
import {
  Utensils,
  Sparkles,
  Building2,
  Volume2,
  Package,
  Loader2Icon,
} from "lucide-react";
import { useExpenseStore } from "@/store/useExpenseStore";

type AddExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
};

const categories = ["Mahaprasad", "Decoration", "Mandap", "Sound", "Other"];

export default function AddExpenseModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: AddExpenseModalProps) {
  const { currentFestival } = useFestivalStore();
  const { isbtnLoading } = useExpenseStore();

  const [form, setForm] = useState({
    festivalId: currentFestival?._id ?? "",
    category: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        festivalId: initialData.festivalId ?? currentFestival?._id ?? "",
        category: initialData.category ?? "",
        amount: Number(initialData.amount),
        description: initialData.description ?? "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      // Reset form when modal is opened without data
      setForm({
        festivalId: currentFestival?._id ?? "",
        category: "",
        amount: 0,
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData, currentFestival, open]);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "amount" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleSave = () => {
    if (!form.category || !form.amount) return;
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>

        {/* Category Selection */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleChange("category", cat)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition-all
                ${
                  form.category === cat
                    ? `border-transparent bg-gradient-to-r ${getCategoryGradient(
                        cat
                      )} text-white`
                    : "border-gray-300 dark:border-gray-600"
                }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-md bg-gradient-to-r ${getCategoryGradient(
                  cat
                )}`}
              >
                {getCategoryIcon(cat)}
              </div>
              <span className="text-sm">{cat}</span>
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Amount (₹)</label>
          <Input
            type="number"
            value={form.amount ?? ""}
            placeholder="Enter amount"
            onChange={(e) => handleChange("amount", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={form.description}
            placeholder="Enter expense description"
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-lg px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-lg px-6 bg-gradient-to-r from-pink-500 to-orange-400"
            disabled={isbtnLoading}
          >
            {isbtnLoading && <Loader2Icon className="animate-spin w-4 h-4" />}
            {initialData ? "Save Changes" : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 🔹 Helpers
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Mahaprasad":
      return <Utensils className="w-4 h-4 " />;
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
