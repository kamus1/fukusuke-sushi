import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Products from "../pages/Products";
import PaymentPage from "../pages/PaymentPage";
import Admin from "../pages/Admin";

//aqui vamos a configurar todas las rutas de la pages que vayamos creando

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/fukusuke-sushi/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/pago" element={<PaymentPage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

export default AppRoutes;
