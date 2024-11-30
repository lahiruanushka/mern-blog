import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import { signoutSuccess } from "../features/user/userSlice";
import defaultAvatar from "/src/assets/default-avatar.png";
import { useEffect, useState } from "react";

const Header = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get("searchTerm");

    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParms = new URLSearchParams(location.search);
    urlParms.set("searchTerm", searchTerm);

    const searchQuery = urlParms.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="inline-block transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 active:scale-95"
      >
        <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:shadow-md">
          ByteThoughts
        </div>
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          className="hidden lg:inline-block rounded-md p-2"
          rightIcon={FaSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <FaSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture || defaultAvatar} // Fallback image
                rounded
                className="w-full"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign Up
              </Button>
            </Link>
          </>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link
          as={Link}
          to="/"
          className={pathname === "/" ? "text-blue-500" : ""}
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          as={Link}
          to="/about"
          className={pathname === "/about" ? "text-blue-500" : ""}
        >
          About
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
