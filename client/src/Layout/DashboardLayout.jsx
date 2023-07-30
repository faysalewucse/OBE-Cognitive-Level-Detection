import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../pages/Dashboard/Sidebar";

export const DashboardLayout = () => {
  return (
    <div className="lg:flex">
      <Sidebar />
      <div className="flex-grow">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};
