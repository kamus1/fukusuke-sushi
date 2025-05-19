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
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
