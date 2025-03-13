import {FaUsers} from "react-icons/fa";
import {FaCartPlus} from "react-icons/fa";
import {GiReceiveMoney} from "react-icons/gi";
import {Bar, Pie, Line} from "react-chartjs-2";
import {supabase} from "../SupabaseClient";
import {useEffect, useState} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register all required chart elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalReservasi, setTotalReservasi] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [chartType, setChartType] = useState("bar");

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

  const labels = ["Products", "Reservasi", "Users"];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Total Count",
        data: [totalProducts, totalReservasi, totalUsers],
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(255, 206, 86, 0.7)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Overview Statistics",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Overview Statistics",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Overview Statistics",
        font: {
          size: 16,
        },
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return <Line data={chartData} options={lineOptions} />;
      case "pie":
        return <Pie data={chartData} options={pieOptions} />;
      default:
        return <Bar data={chartData} options={barOptions} />;
    }
  };

  return (
    <div className="ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl md:max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 flex items-center">
            <div className="p-3 mr-4 bg-white bg-opacity-25 rounded-full">
              <FaCartPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-100">TOTAL PRODUCTS</p>
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 flex items-center">
            <div className="p-3 mr-4 bg-white bg-opacity-25 rounded-full">
              <GiReceiveMoney className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-100">TOTAL RESERVASI</p>
              <p className="text-2xl font-bold text-white">{totalReservasi}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 flex items-center">
            <div className="p-3 mr-4 bg-white bg-opacity-25 rounded-full">
              <FaUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-100">TOTAL USERS</p>
              <p className="text-2xl font-bold text-white">{totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white  rounded-lg shadow-lg p-6">
          <div className="flex  justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Statistics Overview</h3>
            <div className="flex  space-x-2">
              <button
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  chartType === "bar" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                Bar
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  chartType === "line" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                Line
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  chartType === "pie" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                Pie
              </button>
            </div>
          </div>
          <div className="w-full h-80">{renderChart()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
