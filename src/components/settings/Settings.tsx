import { Calendar, Edit, Plus, Shield, User } from "lucide-react";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { AddFestivalModal } from "../dashboard/AddFestivalModal";
import { useFestivalStore } from "@/store/useFestivalStore";
import { formatCurrency } from "@/lib/utils";
import { colors } from "@/lib/constants";
import type { Festival } from "@/types/types";
import { DeleteFestivalDialog } from "./DeleteFestivalDialog";
import { useAuthStore } from "@/store/useAuthStore";

interface FestivalData {
  name: string;
  year: number;
  openingBalance: number;
}

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const {
    addFestival,
    festivals,
    fetchFestivals,
    currentFestival,
    setCurrentFestival,
    updateFestival,
  } = useFestivalStore();
  const { user, logout } = useAuthStore();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<
    null | ({ _id: string } & FestivalData)
  >(null);

  useEffect(() => {
    fetchFestivals();
  }, []);

  const handleSaveFestival = async (data: FestivalData) => {
    let success;
    if (editData) {
      success = await updateFestival(editData._id, data);
    } else {
      success = await addFestival(data);
    }
    if (success) {
      setShowModal(false);
      setEditData(null);
    }
  };

  const handleEditFestival = (festival: Festival) => {
    setEditData({
      _id: festival._id,
      name: festival.name,
      year: festival.year,
      openingBalance: festival.stats?.openingBalance ?? 0,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="heading">
          <h1>Settings</h1>
          <p>Manage your account, festivals,</p>
        </div>
      </div>

      <Card variant="outlined">
        <div className="flex justify-start gap-7 border-b-dashed border-b-1 pb-3">
          <Button
            variant={selectedTab === "profile" ? "default" : "outline"}
            onClick={() => setSelectedTab("profile")}
          >
            <User />
            <span>Profile</span>
          </Button>

          <Button
            variant={selectedTab === "festivals" ? "default" : "outline"}
            onClick={() => setSelectedTab("festivals")}
          >
            <Calendar />
            <span>Festivals</span>
          </Button>
        </div>

        {selectedTab === "profile" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>Profile Information</span>
            </h3>

            {/* Profile Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-PRIMARY rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-PRIMARY">
                    {user?.name}
                  </h4>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {user?.role === "admin" ? "Administrator" : "Viewer"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="pt-4 border-t border-border">
                <Button onClick={logout} variant="destructive">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "festivals" && (
          <>
            <div className="flex items-center justify-center flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="flex w-full items-center gap-2 text-lg font-semibold">
                <Calendar />
                Festival Management
              </h2>
              <Button
                onClick={() => {
                  setEditData(null);
                  setShowModal(true);
                }}
                className="rounded-2xl p-5 w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600"
              >
                <Plus />
                Add Festival
              </Button>
            </div>

            <div className="space-y-3">
              {festivals?.map((festival, index) => (
                <Card
                  key={festival._id}
                  className={`rounded-4xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                    currentFestival?._id === festival._id
                      ? "border-pink-500 bg-pink-50"
                      : ""
                  }`}
                >
                  {/* Left: Icon + Details */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        colors[index % colors.length]
                      }`}
                    >
                      {festival.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{festival.name}</h4>
                      <p className="text-sm font-medium text-green-600">
                        Opening Balance:{" "}
                        {formatCurrency(festival?.stats?.openingBalance ?? 0)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2">
                    {currentFestival?._id === festival._id ? (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => setCurrentFestival(festival)}
                        className="px-3 py-1 rounded-full bg-blue-50 text-PRIMARY text-sm font-medium hover:bg-blue-100"
                      >
                        Switch
                      </button>
                    )}

                    <button
                      onClick={() => handleEditFestival(festival)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>

                    <DeleteFestivalDialog
                      festivalId={festival._id}
                      festivalName={festival.name}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Modal */}
      <AddFestivalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        onSubmit={handleSaveFestival}
        initialData={editData ?? undefined}
      />
    </div>
  );
};

export default Settings;
