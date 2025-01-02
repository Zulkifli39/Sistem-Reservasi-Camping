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

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Shop Reservasion */}
        <Route
          path="/shop"
          element={
            <>
              <Navbar />
              <ShopProduct />
            </>
          }
        />

        {/* Protected Routes for Owner and Admin */}
        <Route element={<MainLayout />}>
          {/* Dashboard and UserPage for both admin and owner */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <Dashboard />
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

          {/* Admin-only Routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductPage />
              </ProtectedRoute>
            }
          />
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
