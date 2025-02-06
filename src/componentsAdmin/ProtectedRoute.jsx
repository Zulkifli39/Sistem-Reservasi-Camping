import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {supabase} from "../SupabaseClient";

function ProtectedRoute({children, allowedRoles}) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Ambil session dari Supabase
        const {
          data: {session},
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Tambahkan listener untuk perubahan session (misalnya, saat login/logout)
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Bersihkan listener saat komponen di-unmount
    return () => subscription?.unsubscribe();
  }, []);

  // Tampilkan loading spinner saat memeriksa session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Jika tidak ada session, arahkan ke halaman login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Ambil role pengguna dari metadata session
  const userRole = session.user.user_metadata?.role;

  // Jika role pengguna tidak diizinkan, arahkan ke halaman "access-denied"
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  // Jika semua pengecekan berhasil, render children (komponen yang dilindungi)
  return children;
}

export default ProtectedRoute;
