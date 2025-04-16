// PaymentPage.tsx
import styled from "styled-components";
import webpayLogo from "../assets/images/logo-webpay-plus-3-2.png";
import servipagLogo from "../assets/images/Logo_Servipag.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const PaymentPage = () => {
  const location = useLocation();
  const total = location.state?.total || 0;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = () => {
    setPaymentSuccess(true);
  };

  return (
    <Container>
      {paymentSuccess ? (
        <>
          <SuccessMessage>
            Su pago ha sido realizado con éxito. Los detalles de la compra fueron enviados a su correo.
          </SuccessMessage>
          <ButtonContainer>
            <HomeButton onClick={() => navigate("/")}>
              Volver a la Página Principal
            </HomeButton>
          </ButtonContainer>
        </>
      ) : (
        <>
          <Section>
            <Legend>Forma de pago</Legend>
            <PaymentOptions>
              <Option>
                <input type="radio" name="payment" id="webpay" defaultChecked />
                <label htmlFor="webpay">
                  Webpay (Tarjeta de Crédito o Redcompra)
                  <Logos>
                    <img src={webpayLogo} alt="Webpay" />
                  </Logos>
                </label>
              </Option>
              <Option>
                <input type="radio" name="payment" id="servipag" />
                <label htmlFor="servipag">
                  Servipag Online
                  <Logos>
                    <img src={servipagLogo} alt="Servipag" />
                  </Logos>
                </label>
              </Option>
            </PaymentOptions>
          </Section>

          <Section>
            <Legend>Información del pago</Legend>
            <InfoContainer>
              <ItemTable>
                <thead>
                  <tr>
                    <th>Id/Detalle Item</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pedido Fukusuke Sushi</td>
                    <td>${total.toLocaleString("es-CL")}</td>
                  </tr>
                </tbody>
              </ItemTable>

              <InputGrid>
                <input type="text" placeholder="Nombres" />
                <input type="text" placeholder="R.U.T." />
                <input type="email" placeholder="E-mail" />
                <input type="email" placeholder="Repita E-mail" />
                <input type="text" placeholder="Dirección" />
                <input type="text" placeholder="Comuna" />
                <input type="text" placeholder="Región" />
              </InputGrid>
            </InfoContainer>

            <TotalRow>
              <span>Total a Pagar</span>
              <strong>${total.toLocaleString("es-CL")}</strong>
            </TotalRow>

            <Logos>
              <img src={webpayLogo} alt="Webpay" />
              <img src={servipagLogo} alt="Servipag" />
            </Logos>

            <ButtonContainer>
              <PayButton onClick={handlePayment}>PAGAR AHORA</PayButton>
            </ButtonContainer>
          </Section>
        </>
      )}
    </Container>
  );
};

export default PaymentPage;

// --- STYLES ---

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const SuccessMessage = styled.div`
  font-size: 1.5rem;
  color: green;
  text-align: center;
  margin-top: 2rem;
`;

const Section = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 2rem;
  padding: 1rem;
`;

const Legend = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Option = styled.div`
  flex: 1 1 300px;

  input {
    margin-right: 0.5rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Logos = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;

  img {
    height: 40px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ItemTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 400px;

  th,
  td {
    border: 1px solid #aaa;
    padding: 0.5rem;
    text-align: left;
  }

  th {
    background-color: #eee;
  }
`;

const InputGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  font-weight: bold;
  font-size: 1.1rem;
`;

const PayButton = styled.button`
  background: #4caf50;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #45a049;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
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
