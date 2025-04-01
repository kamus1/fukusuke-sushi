import { useCart } from "../context/CartContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

type Props = {
  show: boolean;
  onClose: () => void;
};

const CartModal = ({ show, onClose }: Props) => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tu carrito</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cart.length === 0 ? (
          <p>No hay productos aún.</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <strong>{item.nombre}</strong> <br />
                  <small>${item.precio} x {item.cantidad}</small>
                </div>
                <div>
                  <Button variant="secondary" size="sm" onClick={() => decreaseQty(item.id)}>-</Button>{' '}
                  <Button variant="secondary" size="sm" onClick={() => increaseQty(item.id)}>+</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>🗑️</Button>
                </div>
              </div>
            ))}
            <hr />
            <h5>Total: ${total}</h5>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => alert("Procesando pago...")}>Pagar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
