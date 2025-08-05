import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./components/dashboard/Dashboard";
import Contributions from "./components/contributions/Contributions";
import Contributors from "./components/contributors/Contributors";
import Expenses from "./components/expenses/Expenses";
import Reports from "./components/reports/Reports";
import ProtectedRoute from "./lib/ProtectedRoute";
import Settings from "./components/settings/Settings";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="contributions" element={<Contributions />} />
              <Route path="contributors" element={<Contributors />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center" duration={1000} />
    </>
  );
};

export default App;
