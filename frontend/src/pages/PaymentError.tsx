import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get("error") || "Error desconocido al procesar el pago.";
  const token = searchParams.get("token");

  return (
    <Container>
      <ErrorTitle>❌ Error en el pago</ErrorTitle>
      <ErrorMessage>{decodeURIComponent(error)}</ErrorMessage>
      {token && <ErrorDetails><strong>Token:</strong> {token}</ErrorDetails>}

      <ButtonContainer>
        <RetryButton onClick={() => navigate("/")}>Volver al inicio</RetryButton>
      </ButtonContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #d32f2f;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const ErrorDetails = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #999;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

const RetryButton = styled.button`
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

export default PaymentError;
