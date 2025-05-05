import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {supabase} from "../SupabaseClient";
import LoginBG from "../assets/Mountain.bg.avif";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({email: "", password: ""});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      const userName = data.user?.user_metadata?.full_name;
      const userRole = data.user?.user_metadata?.role;

      if (!userRole) {
        alert("Role tidak ditemukan. Silakan hubungi administrator.");
        return;
      }

      sessionStorage.setItem("email", formData.email);
      sessionStorage.setItem("username", userName);
      sessionStorage.setItem("role", userRole);

      if (userRole === "owner" || userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "user") {
        navigate("/");
      } else {
        alert("Role tidak valid.");
      }
    } catch (error) {
      alert(error.status === 400 ? "Email atau password salah." : `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100">
      {/* Login Form */}
      <div className="w-full mt-24 lg:mt-0 lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Belopa Outdoor</h2>
          <p className="text-md text-gray-600 text-center mb-8">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-md font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-md font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-lg text-white rounded-lg transition duration-300 ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } font-semibold shadow-md`}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>

      {/* Background Image + Overlay Text */}
      <div className="w-full lg:w-1/2 hidden lg:block relative">
        <img src={LoginBG} alt="Login Background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl lg:text-6xl font-bold text-center px-6">
            Hello, <br /> Welcome Back!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
