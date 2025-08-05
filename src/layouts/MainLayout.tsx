import { Header } from "@/components/header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-PRIMARY-50 flex flex-col">
      <Header />
      <main className="flex-1 p-6 pt-24 md:pt-44">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
