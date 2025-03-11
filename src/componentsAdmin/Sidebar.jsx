import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {supabase} from "../SupabaseClient";

const Sidebar = ({isSideMenuOpen}) => {
  const [userRole, setUserRole] = useState(null);

  // Untuk Mengambil Role dan Menampilkannya sesuai yang ingin diakses
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const {
          data: {session},
        } = await supabase.auth.getSession();
        if (session) {
          setUserRole(session.user.user_metadata?.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  if (!userRole) {
    return null; // Jangan tampilkan sidebar jika role belum diketahui
  }

  return (
    <>
      {/* Sidebar untuk desktop (selalu terlihat) dan mobile (toggle dengan hamburger) */}
      <aside
        className={`z-20 w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0 h-screen fixed ${
          isSideMenuOpen ? "block" : "hidden"
        } md:block`}>
        <div className="py-4 text-gray-500 dark:text-gray-400">
          {/* Brand Title */}
          <a className="ml-6 text-xl   text-black font-semibold dark:text-gray-200" href="#">
            BELOPA OUTDOOR
          </a>

          {/* Menu Items */}
          <ul className="mt-6  text-blue-500 ">
            {/* Menu yang bisa diakses oleh semua role */}
            <li className="relative px-6 py-6">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to="/dashboard">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </Link>
            </li>

            {/* Menu khusus admin */}
            {userRole === "admin" && (
              <>
                <li className="relative px-6 py-6">
                  <Link
                    className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                    to="/products">
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <span className="ml-4">Products</span>
                  </Link>
                </li>
                <li className="relative px-6 py-6">
                  <Link
                    className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                    to="/reservasi">
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <span className="ml-4">Kelola Reservasi</span>
                  </Link>
                </li>
              </>
            )}

            {/* Menu untuk admin dan owner */}
            {["admin", "owner"].includes(userRole) && (
              <li className="relative px-6 py-6">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  to="/users">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <span className="ml-4">Users</span>
                </Link>
              </li>
            )}

            {/* Menu untuk owner */}
            {userRole === "owner" && (
              <li className="relative px-6 py-6">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  to="/laporan">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-4">Laporan</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="px-6 my-6">
          <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-500 border border-transparent rounded-lg active:bg-black hover:bg-black focus:outline-none focus:shadow-outline-purple">
            Setting Profile
            <span className="ml-2" aria-hidden="true">
              +
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
