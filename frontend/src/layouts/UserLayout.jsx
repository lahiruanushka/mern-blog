import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ToastComponent from "../components/ToastComponent";
import AutoScrollToTop from "../components/AutoScrollToTop";

const UserLayout = () => {
  return (
    <>
      <Header />
      <ToastComponent />
      <Outlet />
      <ScrollToTop />
      <AutoScrollToTop />
      <Footer />
    </>
  );
};

export default UserLayout;
