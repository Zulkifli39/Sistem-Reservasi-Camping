import {Outlet} from "react-router-dom";
import Sidebar from "./Sidebar";
import NavbarAdmin from "./NavbarAdmin";

const MainLayout = () => (
  <div className="flex min-h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content Area */}
    <div className="flex-1 flex flex-col">
      {/* Navbar */}
      <NavbarAdmin />

      {/* Dynamic Content */}
      <div className="p-5 flex-1 bg-gray-100">
        <Outlet /> {/* Komponen ini penting untuk merender rute anak */}
      </div>
    </div>
  </div>
);

export default MainLayout;
