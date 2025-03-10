import {FaUsers} from "react-icons/fa";
import {FaCartPlus} from "react-icons/fa";
import {GiReceiveMoney} from "react-icons/gi";

const Dashboard = () => {
  return (
    <main className="w-full  h-full pb-16 ">
      <h2 className=" ml-0 md:ml-72  my-4 md:my-4 font-bold text-2xl">Dashboard</h2>
      <div className="ml-0 md:ml-96  grid gap-6  mt-12   mb-8 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center p-12    bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
            <FaCartPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold  text-gray-600  dark:text-gray-400">Total Products</p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">6389</p>
          </div>
        </div>
        <div className="flex items-center p-12 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
            <GiReceiveMoney className="w-6 h-6" />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold  text-gray-600 dark:text-gray-400">Total Reservasi</p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">$ 46,760.89</p>
          </div>
        </div>
        <div className="flex items-center p-12 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
            <FaUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold  text-gray-600 dark:text-gray-400">Total User</p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">376</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
