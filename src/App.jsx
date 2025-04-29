import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./Pages/Navbar";
import About from "./Pages/About";
import PopularProduct from "./Pages/PopularProduct";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ProtectedRoute from "./componentsAdmin/ProtectedRoute";
import MainLayout from "./componentsAdmin/MainLayout";
import Dashboard from "./PagesAdmin/Dashboard";
import ProductPage from "./PagesAdmin/ProductPage";
import UserPage from "./PagesAdmin/UserPage";
import ProductReservasion from "./Pages/ProductReservasion";
import ShopProduct from "./Pages/ShopProduct";
import Footer from "./Pages/Footer";
import KelolaReservasi from "./PagesAdmin/KelolaReservasi";
import Laporan from "./Pages/Laporan";
import {ProfileSetting} from "./Profile/ProfileSetting";
import Status from "./Pages/Status";
import CaraReservasi from "./Pages/CaraReservasi";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <About />
              <PopularProduct />
              <ProductReservasion />
              <Footer />
            </>
          }
        />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Shop Reservation Route */}
        <Route
          path="/shop"
          element={
            <>
              <Navbar />
              <ShopProduct />
            </>
          }
        />

        {/* Profile Setting */}
        <Route
          path="/profile"
          element={
            <>
              <ProfileSetting />
            </>
          }
        />

        {/* Status Reservasi */}
        <Route
          path="/status"
          element={
            <>
              <Navbar />
              <Status />
              {/* <Footer /> */}
            </>
          }
        />

        {/* Cara Reservasi */}
        <Route
          path="/caraReservasi"
          element={
            <>
              <Navbar />
              <CaraReservasi />
              {/* <Footer /> */} 
            </>
          }
        />

        {/* Protected Routes for Admin and Owner */}
        <Route element={<MainLayout />}>
          {/* Dashboard and Product Management */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/laporan"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Laporan />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Route */}
          <Route
            path="/reservasi"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <KelolaReservasi />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
