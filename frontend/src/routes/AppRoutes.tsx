import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Products from "../pages/Products";
import PaymentPage from "../pages/PaymentPage";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/fukusuke-sushi/" element={<Home />} />
      <Route path="/fukusuke-sushi/about" element={<About />} />
      <Route path="/fukusuke-sushi/contact" element={<Contact />} />
      <Route path="/fukusuke-sushi/productos" element={<Products />} />
      <Route path="/fukusuke-sushi/pago" element={<PaymentPage />} />
      <Route path="/fukusuke-sushi/login" element={<Login />} />
      <Route
        path="/fukusuke-sushi/admin"
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
