import {useEffect, useState} from "react";
import {FaTrash} from "react-icons/fa";
import Swal from "sweetalert2";
import {supabase} from "@/SupabaseClient";
import TambahAdmin from "./FormAdmin/TambahAdmin";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // Fungsi untuk mengambil data user dan role pengguna saat ini
  const fetchUsers = async () => {
    try {
      const {data: userSession, error: sessionError} = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const {data: roleData, error: roleError} = await supabase
        .from("user_data")
        .select("role")
        .eq("id", userSession?.session?.user?.id)
        .single();
      if (roleError) throw roleError;

      setCurrentUserRole(roleData.role);

      const {data, error} = await supabase.from("user_data").select("id, email, role");
      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi untuk menghapus user
  const deleteUser = async (user) => {
    if (currentUserRole === "admin" && user.role === "owner") {
      Swal.fire("Error!", "Admin tidak dapat menghapus Owner.", "error");
      return;
    }

    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!confirmation.isConfirmed) return;

      const {error} = await supabase.from("user_data").delete().eq("id", user.id);
      if (error) throw error;

      Swal.fire("Deleted!", "The user has been deleted.", "success");
      fetchUsers(); // Refresh data setelah penghapusan
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  const handleAdminAdded = () => {
    fetchUsers(); // Refresh setelah menambah admin
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">User List</h2>

      {currentUserRole === "owner" && (
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setIsAddAdminOpen(true)}>
          Tambah Akun Admin
        </button>
      )}

      <TambahAdmin isOpen={isAddAdminOpen} onAdminAdded={handleAdminAdded} onClose={() => setIsAddAdminOpen(false)} />

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold uppercase">Email</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold uppercase">Role</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-100 transition-colors duration-150">
                <td className="px-6 py-4 text-center text-gray-800">{user.email}</td>
                <td className="px-6 py-4 text-center text-gray-800">{user.role}</td>
                <td className="px-6 py-4 text-center">
                  {/* Tampilkan tombol delete untuk Owner jika role bukan Owner(menghapus admin dan user) */}
                  {currentUserRole === "owner" && user.role !== "owner" && (
                    <button
                      onClick={() => deleteUser(user)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 flex items-center justify-center gap-1">
                      <FaTrash />
                      Delete
                    </button>
                  )}
                  {/* Tampilkan tombol delete untuk Admin jika role adalah user */}
                  {currentUserRole === "admin" && user.role === "user" && (
                    <button
                      onClick={() => deleteUser(user)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 flex items-center justify-center gap-1">
                      <FaTrash />
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPage;
