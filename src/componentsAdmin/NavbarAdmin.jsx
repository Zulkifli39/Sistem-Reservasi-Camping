import {FaAlignLeft} from "react-icons/fa";
import {Link} from "react-router-dom";

function NavbarAdmin() {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-16">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                className="p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <FaAlignLeft />
              </button>
              <Link to="/dashboard" className="ms-2 text-xl font-semibold dark:text-white">
                Sistem Reservasi Camping
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarAdmin;
