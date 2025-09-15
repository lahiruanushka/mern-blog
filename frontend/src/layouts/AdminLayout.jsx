import { Outlet } from "react-router-dom";
import { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashSidebar from "../components/dashboard/DashSidebar";
import ToastComponent from "../components/ToastComponent";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <DashboardHeader
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
        sidebarOpen={isSidebarOpen}
      />
      <ToastComponent />

      <div className="flex flex-1 pt-16">
        <div
          className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out transform ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } ${
            isSidebarCollapsed ? "w-20" : "w-64"
          } bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700`}
        >
          <DashSidebar
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
          } bg-gray-50 dark:bg-gray-900/50`}
        >
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
