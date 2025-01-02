import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {supabase} from "../SupabaseClient";

const Sidebar = () => {
  const [userRole, setUserRole] = useState(null);

  // Untuk Mengambil Role dan Menampilkannya sesuai yang ingin di akses
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const {
          data: {session},
        } = await supabase.auth.getSession();
        if (session) {
          setUserRole(session.user.user_metadata?.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  if (!userRole) {
    return null; // Jangan tampilkan sidebar jika role belum diketahui
  }

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-5">
      <h2 className="text-2xl font-bold mb-5">Belopa Outdoor</h2>
      <ul>
        {/* Menu yang bisa diakses oleh semua role */}
        <li className="mb-4">
          <Link to="/dashboard">Dashboard</Link>
        </li>

        {/* Menu khusus admin */}
        {userRole === "admin" && (
          <>
            <li className="mb-4">
              <Link to="/products">Products</Link>
            </li>
            <li className="mb-4">
              <Link to="/reservasi">Kelola Reservasi</Link>
            </li>
          </>
        )}

        {/* Menu untuk admin dan owner */}
        {["admin", "owner"].includes(userRole) && (
          <li className="mb-4">
            <Link to="/users">Users</Link>
          </li>
        )}

        <li className="mb-4">
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
