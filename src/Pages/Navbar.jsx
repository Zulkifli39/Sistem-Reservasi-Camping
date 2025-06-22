import {useState, useEffect} from "react";
import {FaBars, FaUserCircle} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {BiSolidCartAdd} from "react-icons/bi";
import {ProfileSetting} from "@/Profile/ProfileSetting";
import {supabase} from "@/SupabaseClient";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = sessionStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    updateCartCount(); // Panggil saat komponen dimuat
  }, []);

  // Perbarui cartCount saat localStorage berubah
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage event triggered");
      updateCartCount();
    };
    window.addEventListener("storage", handleStorageChange);
    // Polling manual sebagai cadangan (opsional, hapus jika tidak diperlukan)
    const interval = setInterval(updateCartCount, 1000); // Periksa setiap 1 detik
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval); // Bersihkan interval
    };
  }, []);

  const updateCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    // console.log("Calculated cart count:", totalCount); // Debugging
    setCartCount(totalCount);
  };

  const handleLogout = async () => {
    try {
      const {error} = await supabase.auth.signOut();
      if (error) throw error;

      sessionStorage.clear();
      setUserName("");
      setIsProfileOpen(false);
      setIsEditingProfile(false);
      localStorage.removeItem("cart");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleEditProfile = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const navItems = [
    {name: "Home", to: "/", type: "link"},
    {name: "About Us", to: "/#tentangkami", type: "link"},
    {name: "Populer", to: "/#popular", type: "link"},
    {name: "Alat Camping", to: "/#product", type: "link"},
    {name: "Cara Reservasi", to: "/caraReservasi", type: "link"},
    {name: "Status Reservasi", to: "/status", type: "link"},
  ];

  return (
    <nav className="bg-[#FAF7F0] dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/src/assets/belopa_outdoor.png" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Belopa Outdoor</span>
        </Link>

        <div className="flex md:order-2 items-center space-x-3 rtl:space-x-reverse">
          {userName ? (
            <>
              <Link to="/shop" className="relative">
                <BiSolidCartAdd size={30} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={toggleProfileMenu} className="relative">
                <FaUserCircle size={30} />
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                    <span className="block px-4 py-2 text-gray-900 dark:text-white font-medium">Hello, {userName}</span>
                    <ul className="py-1 text-gray-700">
                      <li>
                        <button
                          onClick={toggleEditProfile}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                          Edit Profile
                        </button>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </button>
              {isEditingProfile && <ProfileSetting userName={userName} onLogout={handleLogout} />}
            </>
          ) : (
            <Link
              to="/login"
              className="text-white bg-[#f19647] hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Login
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg p-2">
            <FaBars size={20} />
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? "block" : "hidden"}`}
          id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#f19647] md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={(e) => {
                    if (item.to.includes("#")) {
                      e.preventDefault();
                      const targetId = item.to.split("#")[1];
                      if (window.location.pathname !== "/") {
                        navigate("/");
                        setTimeout(() => {
                          document.getElementById(targetId)?.scrollIntoView({behavior: "smooth"});
                        }, 100);
                      } else {
                        document.getElementById(targetId)?.scrollIntoView({behavior: "smooth"});
                      }
                    }
                  }}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
