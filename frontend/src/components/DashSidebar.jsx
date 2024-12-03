import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
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
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "");
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile" className="w-full">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              className="cursor-pointer"
              as="div"
              label={currentUser.isAdmin && "Admin"}
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=categories">
                <Sidebar.Item
                  active={tab === "categories"}
                  icon={HiOutlineTag}
                  as="div"
                >
                  Categories
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiOutlineDocumentText}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Link to="/dashboard?tab=logout" className="w-full">
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              as="div"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
