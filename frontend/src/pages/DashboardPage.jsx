import { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashCategories from "../components/DashCategories";
import DashboardComp from "../components/DashboardComp";
import DashProfile from "../components/DashProfile";
import DashCreatePost from "../components/DashCreatePost";
import DashUpdatePost from "../components/DashUpdatePost";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const [postId, setPostId] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    const postIdFromUrl = urlParams.get("id");

    if (!currentUser?.isAdmin && isAdminTab(tabFromUrl)) {
      navigate("/dashboard?tab=profile");
      return;
    }

    setTab(tabFromUrl || "");
    setPostId(postIdFromUrl || "");
  }, [location.search, currentUser, navigate]);

  const isAdminTab = (tabName) => {
    return ["dash", "posts", "users", "comments", "categories"].includes(
      tabName
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <HiMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex">
        <DashSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {tab === "profile" && <DashProfile />}
            {currentUser?.isAdmin && (
              <>
                {tab === "dash" && <DashboardComp />}
                {tab === "posts" && <DashPosts />}
                {tab === "create-post" && <DashCreatePost />}
                {tab === "update-post" && postId && (
                  <DashUpdatePost postId={postId} />
                )}
                {tab === "users" && <DashUsers />}
                {tab === "comments" && <DashComments />}
                {tab === "categories" && <DashCategories />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
