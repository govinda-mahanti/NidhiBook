import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import AIBot from "../Components/AIBot";
const Layout = () => {
  return (
    <div className="mt-0 pt-2 overflow-hidden  bg-black h-full w-full">
      <Navbar />
      <Outlet />
      <Footer />
      <AIBot />
    </div>
  );
};

export default Layout;
