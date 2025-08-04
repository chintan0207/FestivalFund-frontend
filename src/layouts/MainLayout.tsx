import { Header } from "@/components/header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="p-6 pt-22 md:pt-44">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
