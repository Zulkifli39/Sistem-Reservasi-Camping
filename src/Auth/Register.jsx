import {useState} from "react";
import {Link} from "react-router-dom";
import {supabase} from "../SupabaseClient";
import Swal from "sweetalert2";
import RegisterBg from "../assets/Mountain.bg.avif";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const role = formData.email.endsWith("@admin.com") ? "admin" : "user";

      const {error} = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role,
          },
        },
      });

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created. Please log in.",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-indigo-100 via-white to-indigo-100">
      {/* Background Image */}
      <div className="w-full lg:w-1/2 hidden lg:block relative">
        <img src={RegisterBg} alt="Register Background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl lg:text-6xl font-bold text-center px-6">Belopa Outdoor</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full mt-12 lg:mt-6 lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Daftar</h2>
          <p className="text-md text-gray-600 text-center mb-8">
            Sudah Punya Akun?{" "}
            <Link to="/login" className="text-[#f19647] font-semibold hover:underline">
              Login disini
            </Link>
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-md font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Your Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19647]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-md font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19647]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-md font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19647]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-lg text-white bg-[#f19647] hover:bg-[#f19647] rounded-lg font-semibold shadow-md transition duration-300">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
