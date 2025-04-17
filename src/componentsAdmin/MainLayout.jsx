import {Outlet} from "react-router-dom";
import {useState} from "react";
import Sidebar from "./Sidebar";
import NavbarAdmin from "./NavbarAdmin";

const MainLayout = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSideMenuOpen={isSideMenuOpen} toggleSidebar={toggleSideMenu} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar harus di sini, di DALAM container utama */}
        <NavbarAdmin isSideMenuOpen={isSideMenuOpen} toggleSideMenu={toggleSideMenu} />

        {/* Konten utama */}
        <main className="flex-1 p-4 md:p-6 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
