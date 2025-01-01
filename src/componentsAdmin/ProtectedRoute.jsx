import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {supabase} from "../SupabaseClient";

function ProtectedRoute({children, allowedRoles}) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Mengambil session dari supabase
        const {
          data: {session},
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false); // Set loading false setelah pemeriksaan selesai
      }
    };

    checkSession();
  }, []); // Kosongkan dependensi array agar useEffect hanya berjalan sekali setelah render pertama

  // Tampilkan layar loading selama pemeriksaan session berlangsung
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Jika tidak ada session (pengguna tidak login), arahkan ke halaman login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Ambil role pengguna dari metadata
  const userRole = session.user.user_metadata?.role;

  // Jika role tidak sesuai dengan yang diizinkan, arahkan ke halaman users
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/users" replace />;
  }

  // Render komponen jika semua pemeriksaan lolos
  return children;
}

export default ProtectedRoute;
