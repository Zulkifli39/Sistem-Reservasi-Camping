import {useState} from "react";
import {Link} from "react-router-dom";
import {MdLogout} from "react-icons/md";
import {FiMenu} from "react-icons/fi";
import Sidebar from "./Sidebar";
import {supabase} from "../SupabaseClient";

function NavbarAdmin() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <Sidebar isSideMenuOpen={isSideMenuOpen} toggleSidebar={toggleSideMenu} />
      <header className="fixed top-0 z-10 w-full bg-white dark:bg-gray-800 shadow-md py-3">
        <div className="container mx-auto flex items-center justify-between h-full px-2 sm:px-4">
          <div className="flex items-center">
            <button
              className="p-1 mr-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 dark:text-gray-300"
              onClick={toggleSideMenu}
              aria-label="Menu">
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              onClick={handleLogout}>
              <MdLogout className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </header>
      <div className="h-14" /> {/* Spacer for fixed header */}
    </>
  );
}

export default NavbarAdmin;
