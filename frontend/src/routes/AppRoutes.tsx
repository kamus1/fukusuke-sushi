import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Products from "../pages/Products";
import PaymentPage from "../pages/PaymentPage";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Register from '../pages/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import PaymentSuccess from '../pages/PaymentSuccess'
import DespachosPendientes from "../pages/DespachosPendientes"; // asegúrate de crearlo
import UserManagement from "../pages/UserManagement";
import SalesStats from "../pages/SalesStats";
import Promociones from "../pages/Promociones";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/pago" element={<PaymentPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/paymentsuccess" element={<PaymentSuccess />} />
      <Route path="/despachos" element={<DespachosPendientes />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ventas"
        element={
          <ProtectedRoute>
            <SalesStats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/promociones"
        element={
          <ProtectedRoute>
            <Promociones />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
