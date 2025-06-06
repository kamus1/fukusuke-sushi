import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { API_URL } from '../config';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const total = location.state?.total || 0;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderTicketId, setOrderTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombres: '',
    rut: '',
    email: '',
    emailConfirm: '',
    direccion: '',
    numeroCasa: '',
    comuna: '',
    region: 'Región Metropolitana', // por default
    telefono: '',
    codigoPais: '+56' // default Chile
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^\d]/g, '');
    setFormData({
      ...formData,
      telefono: value
    });
  };

  const handlePayment = async () => {
    if (formData.email !== formData.emailConfirm) {
      alert('Los correos electrónicos no coinciden');
      return;
    }

    if (!formData.nombres || !formData.email || !formData.direccion || !formData.comuna || !formData.region || !formData.telefono) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const isGuest = !token;

      const orderItems = cart.map(item => ({
        product: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.precio * item.cantidad
      }));

      // 1. Crear la orden primero (pendiente), y obtener ticketId
      const orderRes = await fetch(`${API_URL}/api/orders${isGuest ? '/public' : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isGuest ? {} : { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          items: orderItems,
          total,
          email: formData.email,
          nombres: formData.nombres,
          rut: formData.rut,
          telefono: `${formData.codigoPais}${formData.telefono}`,
          direccionEnvio: {
            calle: formData.direccion,
            numeroCasa: formData.numeroCasa,
            comuna: formData.comuna,
            region: formData.region
          }
        })
      });

      if (!orderRes.ok) {
        throw new Error('Error al procesar el pedido');
      }

      const { ticketId } = await orderRes.json();
      setOrderTicketId(ticketId);
      setPaymentSuccess(true);
      clearCart();

      // 2. Llamar a Flow con el mismo ticketId como commerceOrder
      const flowRes = await fetch(`${API_URL}/api/flow/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          amount: Math.round(total),
          ticketId
        }),
      });

      const flowData = await flowRes.json();
      if (flowData?.url) {
        window.location.href = flowData.url;
      } else {
        console.error("Error en Flow:", flowData);
        alert("Error al redirigir al portal de pago");
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pedido');
    }
  };

  return (
    <Container>
      {paymentSuccess ? (
        <>
          <SuccessMessage>
            Su pago ha sido iniciado correctamente. Será redirigido a Flow para completar el pago.<br />
            Su número de orden es: {orderTicketId}
          </SuccessMessage>
          <ButtonContainer>
            <HomeButton onClick={() => navigate("/")}>Volver a la Página Principal</HomeButton>
          </ButtonContainer>
        </>
      ) : (
        <>
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
                <input
                  type="text"
                  name="nombres"
                  placeholder="Nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="rut"
                  placeholder="R.U.T."
                  value={formData.rut}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="emailConfirm"
                  placeholder="Repita E-mail"
                  value={formData.emailConfirm}
                  onChange={handleInputChange}
                  required
                />
                <PhoneInputContainer>
                  <select
                    name="codigoPais"
                    value={formData.codigoPais}
                    onChange={handleInputChange}
                  >
                    <option value="+56">+56</option>
                    <option value="+54">+54</option>
                    <option value="+51">+51</option>
                    <option value="+55">+55</option>
                    <option value="+57">+57</option>
                  </select>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handlePhoneChange}
                    required
                  />
                </PhoneInputContainer>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="numeroCasa"
                  placeholder="Número de casa"
                  value={formData.numeroCasa}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="comuna"
                  placeholder="Comuna"
                  value={formData.comuna}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="region"
                  placeholder="Región"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="default-value"
                />
              </InputGrid>
            </InfoContainer>

            <TotalRow>
              <span>Total a Pagar</span>
              <strong>${total.toLocaleString("es-CL")}</strong>
            </TotalRow>

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

    &.default-value {
      background-color: #f5f5f5;
      color: #666;
      cursor: not-allowed;
      border-color: #ddd;
    }
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  grid-column: 1 / -1;

  select {
    width: 100px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  input {
    flex: 1;
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
  margin-top: 1rem;
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
