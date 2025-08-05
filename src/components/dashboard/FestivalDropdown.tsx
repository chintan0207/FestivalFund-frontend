import { useEffect, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { useFestivalStore } from "@/store/useFestivalStore";
import { Card } from "@/components/ui/card";

export function FestivalDropdown() {
  const {
    festivals,
    currentFestival,
    setCurrentFestival,
    fetchFestivals,
    isLoading,
  } = useFestivalStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  // Set default festival after fetch
  useEffect(() => {
    if (festivals.length > 0 && !currentFestival) {
      setCurrentFestival(festivals[0]);
    }
  }, [festivals, currentFestival, setCurrentFestival]);

  return (
    <div className="relative w-full max-w-sm">
      {/* Trigger Card */}
      <Card
        className="p-3 cursor-pointer hover:shadow-md transition"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-PRIMARY p-3 rounded-full">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="font-medium">
              {currentFestival?.name ||
                (isLoading ? "Loading..." : "Select Festival")}
            </p>
            <p className="text-sm muted-text">{currentFestival?.year || ""}</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </Card>

      {/* Dropdown List */}
      {open && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg p-2 z-10 shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {festivals.length === 0 && !isLoading && (
            <p className="text-sm text-gray-500 p-2 text-center">
              No festivals found
            </p>
          )}
          {festivals.map((festival) => (
            <div
              key={festival._id}
              onClick={() => {
                setCurrentFestival(festival);
                setOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                currentFestival?._id === festival._id
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-medium">{festival.name}</p>
              <p className="text-sm opacity-75">{festival.year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
