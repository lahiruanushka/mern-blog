import { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import DashCategories from "../components/DashCategories";
import DashCreatePost from "../components/DashCreatePost";
import DashUpdatePost from "../components/DashUpdatePost";
import { Menu } from "lucide-react";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const [postId, setPostId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    const postIdFromUrl = urlParams.get("id");

    // Redirect non-admin users trying to access admin tabs
    if (!currentUser?.isAdmin && isAdminTab(tabFromUrl)) {
      navigate("/dashboard?tab=profile");
      return;
    }

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    if (postIdFromUrl) {
      setPostId(postIdFromUrl);
    }
  }, [location.search, currentUser, navigate]);

  const isAdminTab = (tabName) => {
    const adminTabs = ["dash", "posts", "users", "comments", "categories"];
    return adminTabs.includes(tabName);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="md:hidden p-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-1 relative">
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 absolute md:relative z-50 transition-transform duration-300 ease-in-out w-56 h-screen bg-white shadow-lg md:shadow-none`}
        >
          <DashSidebar closeSidebar={() => setIsSidebarOpen(false)} />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 p-4">
          {/* Profile tab - accessible to all users */}
          {tab === "profile" && <DashProfile />}

          {/* Admin-only tabs */}
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
      </div>
    </div>
  );
};

export default DashboardPage;
