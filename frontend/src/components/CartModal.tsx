import { useCart } from "../context/CartContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


type Props = {
  show: boolean;
  onClose: () => void;
};

const CartModal = ({ show, onClose }: Props) => {
  const { cart, increaseQty } = useCart();
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const navigate = useNavigate();

  if (!show) return null;

  const handlePayment = () => {
    onClose(); // Cerrar el modal
    navigate('/pago', { state: { total } }); // Pasar el total como estado
  };

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>

                <ModalContent>
          {/* Mostrar solo en pantallas grandes */}
          <ProductView className="hide-on-mobile">
            <Title>Productos</Title>
            <ProductGrid>
              {cart.map(item => (
                <Card key={item.id}>
                  <ProductImage src={item.img_url} alt={item.nombre} />
                  <ProductInfo>
                    <p>{item.nombre}</p>
                    <strong>${item.precio.toLocaleString("es-CL")}</strong>
                  </ProductInfo>
                  <AddButton onClick={() => increaseQty(item.id)}>Añadir</AddButton>
                </Card>
              ))}
            </ProductGrid>
          </ProductView>

          {/* Siempre visible: listado de productos agregados */}
          <CartDetails>
            <Title>Resumen</Title>
            <CartList>
              {cart.map(item => (
                <CartItem key={item.id}>
                  <span>{item.nombre} x {item.cantidad}</span>
                  <strong>${(item.precio * item.cantidad).toLocaleString("es-CL")}</strong>
                </CartItem>
              ))}
            </CartList>
            <Divider />
            <TotalText>Total: <strong>${total.toLocaleString("es-CL")}</strong></TotalText>
            <PayButton onClick={handlePayment}>Pagar</PayButton>

          </CartDetails>
        </ModalContent>

      </ModalContainer>
    </Overlay>
  );
};

// --- ESTILOS ---

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #FF4848;
  width: 95%;
  max-width: 1200px;
  height: 90vh;
  border-radius: 20px;
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  font-size: 2rem;
  background: transparent;
  color: black;
  border: none;
  cursor: pointer;
`;

const ModalContent = styled.div`
  flex: 1;
  display: flex;
  gap: 1rem;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProductView = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 0.5rem;
  color: black;
`;

const AddButton = styled.button`
  background: red;
  color: white;
  border: none;
  margin: 0.5rem auto;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const CartDetails = styled.div`
  flex: 1;
  background: white;
  border-radius: 15px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: black;
`;

const CartList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow-y: auto;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Divider = styled.hr`
  margin: 1rem 0;
`;

const TotalText = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const PayButton = styled.button`
  background: black;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 15px;
  font-size: 1.1rem;
  cursor: pointer;
`;

const Title = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;

  ${CartDetails} & {
    color: black;
  }
`;

const GlobalStyle = styled.div`
  .hide-on-mobile {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export default CartModal;
