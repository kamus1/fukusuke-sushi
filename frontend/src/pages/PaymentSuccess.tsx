import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API_URL } from '../config';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const flowToken = searchParams.get("token");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!flowToken) {
        setError("No se encontró el token del comprobante.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/orders/by-token/${flowToken}`);
        if (!res.ok) throw new Error("Error al cargar el comprobante.");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError("No se pudo obtener el comprobante.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [flowToken]);

  if (loading) return <LoadingMessage>Cargando comprobante...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!order) return <ErrorMessage>No se encontró la orden.</ErrorMessage>;

  return (
    <Container>
      <SuccessTitle>¡Pago confirmado!</SuccessTitle>
      <SuccessMessage>Gracias por tu compra. Aquí está tu comprobante:</SuccessMessage>

      <ReceiptContainer>
        <ReceiptItem><strong>Ticket ID:</strong> {order.ticketId}</ReceiptItem>
        <ReceiptItem><strong>Fecha:</strong> {new Date(order.fechaPedido).toLocaleString()}</ReceiptItem>
        <ReceiptItem><strong>Email:</strong> {order.email}</ReceiptItem>
        <ReceiptItem><strong>Teléfono:</strong> {order.telefono}</ReceiptItem>
        <ReceiptItem><strong>Dirección de envío:</strong> {order.direccionEnvio.calle} {order.direccionEnvio.numeroCasa}, {order.direccionEnvio.comuna}, {order.direccionEnvio.region}</ReceiptItem>
        <ReceiptItem><strong>Método de pago:</strong> {order.metodoPago || 'Flow.cl'}</ReceiptItem>
        <ReceiptItem><strong>Estado:</strong> {order.estado}</ReceiptItem>

        <ProductsSection>
          <h4>Productos:</h4>
          <ProductList>
            {order.items.map((item: any, idx: number) => (
              <ProductItem key={idx}>
                {item.nombre} - {item.cantidad} x ${item.precio.toLocaleString()} = <strong>${item.subtotal.toLocaleString()}</strong>
              </ProductItem>
            ))}
          </ProductList>
        </ProductsSection>

        <TotalAmount>Total pagado: ${order.total.toLocaleString()}</TotalAmount>
      </ReceiptContainer>

      <ButtonContainer>
        <HomeButton onClick={() => navigate("/")}>Volver a la Página Principal</HomeButton>
      </ButtonContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem;
`;

const SuccessTitle = styled.h2`
  color: #4caf50;
  text-align: center;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
`;

const ReceiptContainer = styled.div`
  border: 1px solid #ccc;
  padding: 2rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ReceiptItem = styled.p`
  margin: 0.5rem 0;
  font-size: 1.1rem;
`;

const ProductsSection = styled.div`
  margin: 1.5rem 0;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;

  h4 {
    margin-bottom: 1rem;
    color: #333;
  }
`;

const ProductList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProductItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
`;

const TotalAmount = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: right;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #eee;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const HomeButton = styled.button`
  background: #ff9122;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e07b1a;
  }
`;

export default PaymentSuccess;
