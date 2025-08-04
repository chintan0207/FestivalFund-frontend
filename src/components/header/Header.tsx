import { useState } from "react";
import {
  Home,
  Users,
  DollarSign,
  Receipt,
  FileText,
  Settings,
  Plus,
  Menu,
  X,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // get current active segment from URL
  const activeView = location.pathname.split("/")[1] || "dashboard";
  console.log("activeView", activeView);

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "text-blue-500" },
    {
      id: "contributors",
      label: "Contributors",
      icon: Users,
      color: "text-green-500",
    },
    {
      id: "contributions",
      label: "Contributions",
      icon: DollarSign,
      color: "text-purple-500",
    },
    { id: "expenses", label: "Expenses", icon: Receipt, color: "text-red-500" },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      color: "text-orange-500",
    },
  ];

  const isAdmin = user?.role === "admin";
  const quickActions = isAdmin
    ? [
        { id: "add-contributor", label: "Add Contributor", icon: Users },
        { id: "add-contribution", label: "Add Contribution", icon: DollarSign },
        { id: "add-expense", label: "Add Expense", icon: Receipt },
      ]
    : [];

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
    setShowQuickActions(false);
  };

  const handleNavigate = (path: string) => {
    navigate(`/${path}`);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 safe-area-top shadow">
        <div className="nav-card">
          <div className="px-2 md:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center text-white text-xl">
                    <Sparkles className="w-5 h-5 text-PRIMARY" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    <span className="text-black">Festival</span>{" "}
                    <span className="text-PRIMARY">Fund</span>
                  </h1>
                  <p className="text-sm muted-text">
                    Welcome back, {user?.name}
                  </p>
                </div>
              </div>

              {/* Desktop icons */}
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => handleNavigate("settings")}
                  className={`p-2 rounded-xl ${
                    activeView === "settings"
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Settings className="w-5 h-5 muted-text" />
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl hover:bg-red-100 text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide Menu */}
      {isMenuOpen && (
        <nav className="fixed top-0 left-0 h-full w-70 nav-card z-100 bg-white shadow-2xl md:hidden safe-area-top">
          <div className="p-6">
            {/* Mobile logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl">
                <Sparkles className="w-5 h-5 text-PRIMARY" />
              </div>
              <div>
                <h1 className="text-lg font-bold">
                  <span className="text-black">Festival</span>{" "}
                  <span className="text-PRIMARY">Fund</span>
                </h1>
                <p className="text-sm muted-text">{user?.name}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.label;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.label)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl ${
                      isActive ? "bg-gray-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {isAdmin && (
                <button
                  onClick={() => handleNavigate("settings")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl ${
                    activeView === "settings"
                      ? "bg-gray-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Settings
                    className={`w-5 h-5 ${
                      activeView === "settings" ? "" : "text-gray-500"
                    }`}
                  />
                  <span className="font-medium">Settings</span>
                </button>
              )}
            </div>

            {/* Logout */}
            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-24 left-4 right-4 z-40 shadow rounded-3xl">
        <div className="nav-card p-2">
          <div className="flex space-x-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.label)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl ${
                    isActive ? "bg-gray-200" : "hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="lg:block font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
        <div className="nav-card rounded-none rounded-t-3xl border-t border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-around">
              {mainNavItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.label;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.label)}
                    className={`flex flex-col items-center space-y-1 p-2 rounded-xl ${
                      isActive ? "bg-gray-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* FAB - Mobile Only */}
      {isAdmin && (
        <div className="md:hidden fixed bottom-20 right-4 z-50 space-y-2">
          {showQuickActions && (
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex items-center space-x-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-gray-200"
                  >
                    <Icon className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="w-14 h-14 gradient-primary rounded-2xl shadow-lg flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-PRIMARY" />
          </button>
        </div>
      )}
    </>
  );
}
