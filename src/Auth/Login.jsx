import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {supabase} from "../SupabaseClient";
import LoginBG from "../assets/Login.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({email: "", password: ""});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      const userRole = data.user?.user_metadata?.role;
      if (!userRole) {
        alert("Role tidak ditemukan. Silakan hubungi administrator.");
        return;
      }

      // Save user email in sessionStorage and navigate based on role
      sessionStorage.setItem("email", formData.email);
      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "user") {
        navigate("/");
      } else {
        alert("Role tidak valid. Silakan hubungi administrator.");
      }
    } catch (error) {
      if (error.status === 400) {
        alert("Email atau password salah.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login to Your Account</h2>
          <p className="mb-4">
            If you don’t have an account register{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register Here!
            </Link>
          </p>
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 bg-blue-600 text-white rounded-lg font-semibold ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>

      {/* Background Image */}
      <div className="w-full lg:w-1/2 hidden lg:block">
        <img src={LoginBG} alt="Login Background" className="object-cover h-full w-full" />
      </div>
    </div>
  );
};

export default Login;
