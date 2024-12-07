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

      // Navigate based on role
      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "user") {
        navigate("/about");
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
    <>
      <div className="w-full flex items-centerbg-gray-200">
        <div className="w-1/2 flex items-center ">
          <form onSubmit={handleSubmit} className="mx-auto  rounded-lg p-8 max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-left text-gray-800 mb-6">Login to Your Account</h2>
            <p>
              If you don’t have an account register{" "}
              <Link to="/register" className="text-blue-600 hover:underline ">
                Register Here!
              </Link>{" "}
            </p>
            {/* Email Input */}
            <div className="space-y-8">
              <div className="mb-4 mt-8 ">
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-6">
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}>
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/2   ">
          <div>
            <img src={LoginBG} className="" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
