  import { useCart } from "../context/CartContext";
  import { FaShoppingCart } from "react-icons/fa";
  import styled from "styled-components";

  type Props = { onClick: () => void };

  const FloatingCartButton = ({ onClick }: Props) => {
    const { cart } = useCart();
    const total = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
      <CartButton onClick={onClick}>
        <FaShoppingCart size={25} className="cartIcon"  />
        {total > 0 && <span className="badge">{total}</span>}
      </CartButton>
    );
  };

  export default FloatingCartButton;

  const CartButton = styled.button`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
    z-index: 999;

    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: white;
      color: red;
      border-radius: 50%;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .cartIcon{
      margin-bottom: 5px;
    }
  `;
