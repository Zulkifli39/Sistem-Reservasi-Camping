import {Link} from "react-router-dom";
import {MdLogout} from "react-icons/md";
import {FiMenu} from "react-icons/fi";
import {supabase} from "../SupabaseClient";

function NavbarAdmin({isSideMenuOpen, toggleSideMenu}) {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-md py-3">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <button
            className="p-1 mr-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 dark:text-gray-300"
            onClick={toggleSideMenu}
            aria-label="Menu">
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
            onClick={handleLogout}>
            <MdLogout className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default NavbarAdmin;
