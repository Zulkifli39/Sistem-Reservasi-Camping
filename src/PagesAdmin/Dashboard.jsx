import {FaUsers} from "react-icons/fa";
import {FaCartPlus} from "react-icons/fa";
import {GiReceiveMoney} from "react-icons/gi";
import {Doughnut} from "react-chartjs-2";
import {supabase} from "../SupabaseClient";
import {useEffect, useState} from "react";
import {
  Chart as ChartJS,
  ArcElement, // Daftarkan elemen Arc
  Tooltip,
  Legend,
} from "chart.js";

// Register elemen yang diperlukan
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalReservasi, setTotalReservasi] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchTotalProducts();
    fetchTotalReservasi();
    fetchTotalUsers();
  }, []);

  const fetchTotalProducts = async () => {
    try {
      const {data, error} = await supabase.from("products").select("id");
      if (error) throw error;
      setTotalProducts(data.length);
    } catch (error) {
      console.error("Error fetching total products:", error);
    }
  };

  const fetchTotalReservasi = async () => {
    try {
      const {data, error} = await supabase.from("reservasi_data").select("id");
      if (error) throw error;
      setTotalReservasi(data.length);
    } catch (error) {
      console.error("Error fetching total reservasi:", error);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const {data, error} = await supabase.from("user_data").select("id");
      if (error) throw error;
      setTotalUsers(data.length);
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };

  const labels = ["Total Products", "Total Reservasi", "Total Users"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Statistics",
        data: [totalProducts, totalReservasi, totalUsers],
        backgroundColor: ["rgba(89, 190, 37, 1)", "rgba( 12, 167, 249, 1)", "rgba(249, 240, 12, 1)"],
        borderColor: ["rgba( 0, 0, 0, 1)", "rgba( 0, 0, 0, 1)", "rgba( 0, 0, 0, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <main className="w-full h-full  pb-16">
        <h2 className="ml-0 md:ml-72 my-4 md:my-4 font-bold text-2xl">Dashboard</h2>
        <div className=" w-10/12  ml-6  md:ml-64  flex-col md:flex-row flex gap-4 md:gap-12  justify-center  mt-12 mb-8   ">
          <div className="flex items-center  w-full md:w-1/4  p-12 bg-blue-700  rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
              <FaCartPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-white">TOTAL PRODUCT</p>
              <p className="text-lg font-semibold text-white">{totalProducts}</p>
            </div>
          </div>

          <div className="flex items-center w-full md:w-1/4 p-12 bg-blue-700 rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
              <GiReceiveMoney className="w-6 h-6" />
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-white ">TOTAL RESERVASI</p>
              <p className="text-lg font-semibold text-white ">{totalReservasi}</p>
            </div>
          </div>

          <div className="flex items-center w-full md:w-1/4 p-12 bg-blue-700 rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
              <FaUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-white ">TOTAL USERS</p>
              <p className="text-lg font-semibold text-white ">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="ml-0 md:ml-96 p-8">
          <h3 className="text-lg font-bold mb-4">Statistics Chart</h3>
          <div className="w-full  max-w-md mx-auto">
            <Doughnut data={data} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
