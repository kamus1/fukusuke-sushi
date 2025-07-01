import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get("error") || "El pago fue rechazado por el sistema.";
  const token = searchParams.get("token") || "Sin token";

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=fukusukesushis@gmail.com&su=Problema%20con%20el%20pago%20-%20Token%3A%20${encodeURIComponent(
    token
  )}&body=Hola,%20tuve%20un%20problema%20con%20mi%20pago.%20Este%20es%20el%20token%20de%20la%20transacción:%20${encodeURIComponent(
    token
  )}`;

  return (
    <Container>
      <ErrorTitle>❌ Pago rechazado</ErrorTitle>
      <ErrorMessage>
        No pudimos procesar tu pago. Esto puede deberse a:
        <ul>
          <li>Fondos insuficientes</li>
          <li>Datos erróneos o tarjeta inválida</li>
          <li>Cancelación del proceso por el usuario</li>
        </ul>
        Si necesitas ayuda, puedes escribirnos a:
        <br />
        <GmailLink href={gmailLink} target="_blank" rel="noopener noreferrer">
          fukusukesushis@gmail.com
        </GmailLink>
      </ErrorMessage>

      <ErrorDetails>
        <strong>Token de transacción:</strong> {token}
      </ErrorDetails>

      <ButtonContainer>
        <RetryButton onClick={() => navigate("/")}>Volver al inicio</RetryButton>
      </ButtonContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 700px;
  margin: 3rem auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  color: #d32f2f;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;

  ul {
    text-align: left;
    margin: 1rem auto;
    max-width: 400px;
  }
`;

const GmailLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: #1a73e8;
  font-weight: 500;
  text-decoration: underline;
  &:hover {
    color: #0c47a1;
  }
`;

const ErrorDetails = styled.p`
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #999;
  word-break: break-all;
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
