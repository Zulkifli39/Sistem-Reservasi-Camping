import {useState, useEffect} from "react";
import {FaBars} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {BiSolidCartAdd} from "react-icons/bi";

const navItems = [
  {name: "Home", to: "/"},
  {name: "About Us", to: "/about"},
  {name: "Product", to: "/products"},
  {name: "Reservation", to: "/reservation"},
  {name: "Contact Us", to: "/contact"},
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = sessionStorage.getItem("email");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("email");
    setUserName("");
    navigate("/");
  };

  return (
    <nav className="bg-[#FAF7F0] dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
        </Link>

        <div className="flex md:order-2 items-center space-x-3 rtl:space-x-reverse">
          {userName ? (
            <div className="flex items-center space-x-4">
              <Link to="/shop">
                <BiSolidCartAdd className="" size={30} />
              </Link>
              <span className="text-gray-900 dark:text-white font-medium">Hello, {userName}</span>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800">
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
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
