import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "");
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Wrap Sidebar.Item inside Link to avoid nesting issues */}
          <Link to="/dashboard?tab=profile" className="w-full">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              className="cursor-pointer"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=logout" className="w-full">
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              as="div"
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
