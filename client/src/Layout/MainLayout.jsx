import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-[90vh] dark:bg-slate-900">
        <Outlet />
      </div>
    </div>
  );
};
