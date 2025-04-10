import { useCart } from "../context/CartContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


type Props = {
  show: boolean;
  onClose: () => void;
};

interface StyledProps {
  show?: boolean;
}

const CartModal = ({ show, onClose }: Props) => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const navigate = useNavigate();

  const handlePayment = () => {
    onClose();
    navigate('/pago', { state: { total } });
  };

  return (
    <Overlay show={show}>
      <ModalContainer show={show}>
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
                  <ItemInfo>
                    <span>{item.nombre}</span>
                    <strong>${(item.precio * item.cantidad).toLocaleString("es-CL")}</strong>
                  </ItemInfo>
                  <ItemControls>
                    <QuantityButton onClick={() => decreaseQty(item.id)}>-</QuantityButton>
                    <QuantityDisplay>{item.cantidad}</QuantityDisplay>
                    <QuantityButton onClick={() => increaseQty(item.id)}>+</QuantityButton>
                    <DeleteButton onClick={() => removeFromCart(item.id)}>×</DeleteButton>
                  </ItemControls>
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

const Overlay = styled.div<StyledProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.show && `
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  `}
`;

const ModalContainer = styled.div<StyledProps>`
  background: #FF4848;
  width: 95%;
  max-width: 1200px;
  height: 90vh;
  border-radius: 20px;
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  transform: translateY(100px) scale(0.95);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.show && `
    transform: translateY(0) scale(1);
    opacity: 1;
  `}

  @media (max-width: 768px) {
    height: auto;
    max-height: 80vh;
  }
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
    overflow-y: auto;
  }
`;

const ProductView = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
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

const CartDetails = styled.div`
  flex: 1;
  background: white;
  border-radius: 15px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: black;

  @media (max-width: 768px) {
    flex: none;
    overflow: visible;
  }
`;

const CartList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const CartItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const ItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background: #FF4848;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;

  &:hover {
    background: #ff3333;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 24px;
  text-align: center;
  font-weight: bold;
`;

const DeleteButton = styled(QuantityButton)`
  background: #dc3545;
  font-size: 1.2rem;

  &:hover {
    background: #c82333;
  }
`;

const Divider = styled.hr`
  margin: 1rem 0;
`;

const TotalText = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: right;

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const PayButton = styled.button`
  background: black;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 15px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    margin-top: auto;
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;

  ${CartDetails} & {
    color: black;
  }
`;

export default CartModal;
