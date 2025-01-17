import {Link} from "react-router-dom";
import {IoIosLogOut} from "react-icons/io";

function NavbarAdmin() {
  return (
    <nav className=" w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-16">
      <div className="w-full  px-3 py-3 lg:px-5 lg:pl-3 flex justify-between items-center">
        <Link to="/dashboard" className="ms-2 text-xl font-semibold dark:text-white">
          Sistem Reservasi Camping
        </Link>
        <Link to="/logout" className="flex items-center text-red-600 dark:text-red-400">
          <IoIosLogOut className="text-2xl mr-2" />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
