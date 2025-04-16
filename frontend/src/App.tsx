import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styled from "styled-components";
import { CartProvider } from "./context/CartContext";
import FloatingCartButton from "./components/FloatingCartButton";
import CartModal from "./components/CartModal";
import { useState } from "react";

import '@fontsource/poppins/index.css'; // importa la fuente Poppins
const App = () => {
  const [showCart, setShowCart] = useState(false);

  return (
    <CartProvider>
      <AppWrapper>
        <Navbar />
        <ContentWrapper>
          <AppRoutes />
        </ContentWrapper>
        <Footer />
        <FloatingCartButton onClick={() => setShowCart(true)} />
        <CartModal show={showCart} onClose={() => setShowCart(false)} />
      </AppWrapper>
    </CartProvider>
  );
};

export default App;

// --------- Layout principal ----------
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Poppins";
`;

const ContentWrapper = styled.main`
  flex: 1;
`;
