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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchTotalProducts(), fetchTotalReservasi(), fetchTotalUsers()]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: "Overview Statistics",
        font: {
          size: 14,
        },
      },
    },
    scales:
      chartType !== "pie"
        ? {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                font: {
                  size: 10,
                },
              },
            },
            x: {
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
          }
        : undefined,
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      );
    }

    switch (chartType) {
      case "line":
        return <Line data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="ml-0 md:ml-64 p-4 md:p-6   min-h-screen">
      <div className="max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 md:mb-6">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 md:p-6 flex items-center">
            <div className="p-2 md:p-3 mr-3 md:mr-4 bg-white bg-opacity-25 rounded-full">
              <FaCartPlus className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-blue-100">TOTAL PRODUCTS</p>
              <p className="text-xl md:text-2xl font-bold text-white">{isLoading ? "-" : totalProducts}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-4 md:p-6 flex items-center">
            <div className="p-2 md:p-3 mr-3 md:mr-4 bg-white bg-opacity-25 rounded-full">
              <GiReceiveMoney className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-emerald-100">TOTAL RESERVASI</p>
              <p className="text-xl md:text-2xl font-bold text-white">{isLoading ? "-" : totalReservasi}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-4 md:p-6 flex items-center">
            <div className="p-2 md:p-3 mr-3 md:mr-4 bg-white bg-opacity-25 rounded-full">
              <FaUsers className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-amber-100">TOTAL USERS</p>
              <p className="text-xl md:text-2xl font-bold text-white">{isLoading ? "-" : totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200">Statistics Overview</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setChartType("bar")}
                className={`px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors ${
                  chartType === "bar"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}>
                Bar
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors ${
                  chartType === "line"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}>
                Line
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors ${
                  chartType === "pie"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}>
                Pie
              </button>
            </div>
          </div>
          <div className="w-full h-64 md:h-80">{renderChart()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
