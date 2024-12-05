import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiOutlineTag,
  HiOutlineDocumentText,
} from "react-icons/hi";

const DashSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setActiveTab(tabFromUrl || "");
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const NavItem = ({ to, icon: Icon, label, active }) => {
    const isActive = active || activeTab === to.split("=")[1];

    return (
      <Link
        to={to}
        className="w-full"
        onClick={() => {
          if (window.innerWidth < 768) onClose?.();
        }}
      >
        <div
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg
            transition-colors duration-200
            ${
              isActive
                ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }
          `}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-50
      w-64 bg-white dark:bg-gray-900
      shadow-lg border-r border-gray-200 dark:border-gray-800
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0
    `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Dashboard
          </h2>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentUser?.isAdmin && (
            <NavItem
              to="/dashboard?tab=dash"
              icon={HiChartPie}
              label="Overview"
              active={!activeTab || activeTab === "dash"}
            />
          )}

          <NavItem
            to="/dashboard?tab=profile"
            icon={HiUser}
            label={`Profile`}
          />

          {currentUser?.isAdmin && (
            <>
              <NavItem
                to="/dashboard?tab=posts"
                icon={HiAnnotation}
                label="Posts"
              />
              <NavItem
                to="/dashboard?tab=users"
                icon={HiOutlineUserGroup}
                label="Users"
              />
              <NavItem
                to="/dashboard?tab=categories"
                icon={HiOutlineTag}
                label="Categories"
              />
              <NavItem
                to="/dashboard?tab=comments"
                icon={HiOutlineDocumentText}
                label="Comments"
              />
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleSignout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <HiArrowSmRight className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashSidebar;
