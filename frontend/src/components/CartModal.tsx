import { useCart } from "../context/CartContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

type Props = {
  show: boolean;
  onClose: () => void;
};

const CartModal = ({ show, onClose }: Props) => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  
  const handlePayment = () => {
    onClose();
    navigate("/fukusuke-sushi/pago", { state: { total } });
  };

  return (
    <Overlay show={show} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Header>Carrito de Compras</Header>
        <ItemsContainer>
          {cart.map((item) => (
            <CartItem key={item.id}>
              <ItemImage src={item.img_url} alt={item.nombre} />
              <ItemDetails>
                <ItemTop>
                  <span>{item.nombre}</span>
                  <span>${(item.precio * item.cantidad).toLocaleString("es-CL")}</span>
                </ItemTop>
                <ItemPrice>${item.precio.toLocaleString("es-CL")} c/u</ItemPrice>
                <ItemControls>
                  <QtyButton onClick={() => decreaseQty(item.id)}>-</QtyButton>
                  <span>{item.cantidad}</span>
                  <QtyButton onClick={() => increaseQty(item.id)}>+</QtyButton>
                  <RemoveButton onClick={() => removeFromCart(item.id)}>Quitar</RemoveButton>
                </ItemControls>
              </ItemDetails>
            </CartItem>
          ))}
        </ItemsContainer>
        <BottomSection>
          <Subtotal>
            <span>Subtotal</span>
            <strong>${total.toLocaleString("es-CL")}</strong>
          </Subtotal>
          <Note>Costo despacho será calculado al finalizar tu órden.</Note>
          <ConfirmButton onClick={handlePayment}>Confirmar Orden</ConfirmButton>
          <BackToShop onClick={onClose}>o Continua Comprando →</BackToShop>
        </BottomSection>
      </ModalContainer>
    </Overlay>
  );
};

export default CartModal;

interface StyledProps {
  show?: boolean;
}

export const Overlay = styled.div<StyledProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${({ show }) => (show ? 1 : 0)};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

export const ModalContainer = styled.div`
  background: #fff;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);

  @media (min-width: 768px) {
    max-width: 640px;
  }

  @media (min-width: 1024px) {
    max-width: 800px;
  }

  @media (max-width: 480px) {
    width: 90%;
    height: 90vh;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.6rem;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  z-index: 10;
`;

export const Header = styled.h2`
  padding: 1.5rem 1.5rem 1rem;
  font-size: 1.3rem;
  margin: 0;
`;

export const ItemsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 1.5rem;
`;

export const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;

  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
  }

  @media (min-width: 1024px) {
    width: 120px;
    height: 120px;
  }
`;

export const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
`;

export const ItemPrice = styled.small`
  color: #777;
`;

export const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const QtyButton = styled.button`
  background: white;
  color: grey;
  border: 1px solid #dbdbdb;
  padding: 0.3rem 0.7rem;
  border-radius: 5px;
  font-size: 1rem;
  width: 35px;
  cursor: pointer;

  &:hover{
    background: #d60000;
    color: white;
  }
`;

export const RemoveButton = styled.button`
  background: transparent;
  color: #cc0000;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const BottomSection = styled.div`
  border-top: 1px solid #ddd;
  padding: 1rem 1.5rem;
  background: white;
  position: sticky;
  bottom: 0;
  z-index: 5;
`;

export const Subtotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
`;

export const Note = styled.small`
  color: #666;
`;

export const ConfirmButton = styled.button`
  width: 100%;
  background: #d60000;
  color: white;
  border: none;
  padding: 0.9rem;
  margin-top: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #b00000;
  }
`;

export const BackToShop = styled.div`
  margin-top: 0.8rem;
  text-align: center;
  font-size: 0.9rem;
  color: #cc0000;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;