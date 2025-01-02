import {createContext, useContext, useState, useEffect} from "react";
import {supabase} from "../SupabaseClient"; // Sesuaikan dengan path SupabaseClient Anda

// Context untuk autentikasi
const AuthContext = createContext();

// AuthProvider untuk menyediakan data user ke seluruh aplikasi
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: {session},
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchSession();

    // Dapatkan sesi ketika user login atau logout
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};

// Hook untuk menggunakan context Auth
export const useAuth = () => {
  return useContext(AuthContext);
};
