import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {supabase} from "../SupabaseClient";
import {FaTachometerAlt, FaBox, FaCalendarAlt, FaUsers, FaChartBar, FaUserCog} from "react-icons/fa";

const Sidebar = ({isSideMenuOpen, toggleSidebar}) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true);
      try {
        const {
          data: {session},
        } = await supabase.auth.getSession();
        if (session) {
          setUserRole(session.user.user_metadata?.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  const isActive = (path) => location.pathname === path;

  if (isLoading) {
    return (
      <aside className="z-20 w-64 h-screen overflow-y-auto bg-white dark:bg-gray-800 fixed">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse h-4 w-24 bg-gray-200 rounded" />
        </div>
      </aside>
    );
  }

  if (!userRole) return null;

  const navigationItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt className="w-5 h-5" />,
      to: "/dashboard",
      roles: ["admin", "owner"],
    },
    {
      name: "Products",
      icon: <FaBox className="w-5 h-5" />,
      to: "/products",
      roles: ["admin"],
    },
    {
      name: "Kelola Reservasi",
      icon: <FaCalendarAlt className="w-5 h-5" />,
      to: "/reservasi",
      roles: ["admin"],
    },
    {
      name: "Users",
      icon: <FaUsers className="w-5 h-5" />,
      to: "/users",
      roles: ["admin", "owner"],
    },
    {
      name: "Laporan",
      icon: <FaChartBar className="w-5 h-5" />,
      to: "/laporan",
      roles: ["owner"],
    },
  ];

  return (
    <>
      <div
        onClick={toggleSidebar}
        className={`${
          isSideMenuOpen ? "block" : "hidden"
        } fixed inset-0 z-10 bg-black bg-opacity-30 md:hidden transition-opacity duration-200`}
      />

      <aside
        className={`z-20 w-64 h-screen fixed overflow-y-auto bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 transition-transform duration-300 ease-in-out ${
          isSideMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        <div className="py-4 text-gray-500 dark:text-gray-400 h-full flex flex-col">
          <div className="px-6 py-4 mb-6 border-b border-gray-100 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">BELOPA OUTDOOR</span>
            </Link>
          </div>

          <ul className="mt-2 space-y-8 px-3 flex-grow">
            {navigationItems.map(
              (item, idx) =>
                item.roles.includes(userRole) && (
                  <li key={idx} className="relative">
                    <Link
                      to={item.to}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${
                        isActive(item.to)
                          ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}>
                      {item.icon}
                      <span className="ml-4">{item.name}</span>
                      {isActive(item.to) && (
                        <span className="absolute inset-y-0 left-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-tr-lg rounded-br-lg" />
                      )}
                    </Link>
                  </li>
                )
            )}
          </ul>

          {/* <div className="px-6 py-4 mt-auto border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/profile"
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
              <span>Profile Settings</span>
              <FaUserCog className="h-5 w-5" />
            </Link>
          </div> */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
