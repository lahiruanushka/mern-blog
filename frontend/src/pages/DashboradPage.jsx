import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import DashCategories from "../components/DashCategories";
import DashCreatePost from "../components/DashCreatePost";
import DashUpdatePost from "../components/DashUpdatePost";

const DashboradPage = () => {
  const location = useLocation();
  const [tab, setTab] = useState();
  const [postId, setPostId] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    const postIdFromUrl = urlParams.get("id");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    if (postIdFromUrl) {
      setPostId(postIdFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* posts */}
      {tab === "posts" && <DashPosts />}
      {tab === "create-post" && <DashCreatePost />}
      {tab === "update-post" && postId && <DashUpdatePost postId={postId} />}
      {/* Profile */}
      {tab === "profile" && <DashProfile />}
      {/* Users */}
      {tab === "users" && <DashUsers />}
      {/* comments  */}
      {tab === "comments" && <DashComments />}
      {/* categories  */}
      {tab === "categories" && <DashCategories />}
      {/* dashboard comp */}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
};

export default DashboradPage;
