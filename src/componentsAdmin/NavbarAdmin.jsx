import {useState} from "react";
import Sidebar from "./Sidebar"; // Pastikan jalur import sesuai

function NavbarAdmin() {
  // State untuk menampung status toggle
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const toggleTheme = () => {
    setDark(!dark);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <>
      {/* Mobile sidebar */}
      <Sidebar isSideMenuOpen={isSideMenuOpen} />

      <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
        <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
          {/* Mobile hamburger */}
          <button
            className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
            onClick={toggleSideMenu}
            aria-label="Menu">
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"></path>
            </svg>
          </button>

          {/* Search input */}
          <h2 className=" mt-0 md:ml-72 font-bold text-xl">Sistem Reservasi </h2>
          <ul className="flex items-center flex-shrink-0 space-x-6">
            {/* Theme toggler */}
            <li className="flex">
              <button
                className="rounded-md focus:outline-none focus:shadow-outline-purple"
                onClick={toggleTheme}
                aria-label="Toggle color mode">
                {dark ? (
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                )}
              </button>
            </li>

            {/* Profile menu */}
            <li className="relative">
              <button
                className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
                onClick={toggleProfileMenu}
                aria-label="Account"
                aria-haspopup="true">
                <img
                  className="object-cover w-8 h-8 rounded-full"
                  src="https://example.com/user.jpg"
                  alt=""
                  aria-hidden="true"
                />
              </button>
              {isProfileMenuOpen && (
                <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700">
                  <li className="flex">
                    <a
                      className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      href="#">
                      <span>Profile</span>
                    </a>
                  </li>
                  <li className="flex">
                    <a
                      className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      href="#">
                      <span>Log out</span>
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default NavbarAdmin;
