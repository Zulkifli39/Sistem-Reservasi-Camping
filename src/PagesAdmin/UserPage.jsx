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
      fetchUsers();
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  const handleAdminAdded = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="-mt-10 lg:mt-4  min-h-screen ">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 md:mb-6">Data Users</h2>

      {currentUserRole === "owner" && (
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-green-700 transition-colors duration-200"
          onClick={() => setIsAddAdminOpen(true)}>
          Tambah Akun Admin
        </button>
      )}

      <TambahAdmin isOpen={isAddAdminOpen} onAdminAdded={handleAdminAdded} onClose={() => setIsAddAdminOpen(false)} />

      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto rounded-t-lg">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right bg-gray-200">
              <tr>
                <th className="px-4 py-2 font-medium text-center text-gray-600">Email</th>
                <th className="px-4 py-2 font-medium text-center text-gray-600">Role</th>
                <th className="px-4 py-2 font-medium text-center text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200  ">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="text-center ">
                    <td className="px-4 py-2 text-gray-700">{user.email}</td>
                    <td className="px-4 py-2 text-gray-700">{user.role}</td>
                    <td className="px-4 py-2  flex items-center justify-center gap-4">
                      {currentUserRole === "owner" && user.role !== "owner" && (
                        <button
                          onClick={() => deleteUser(user)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 flex items-center justify-center gap-1">
                          <FaTrash />
                          Delete
                        </button>
                      )}
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
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                    No users available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
