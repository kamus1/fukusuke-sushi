import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Tipos para los datos que vienen del backend
interface Direccion {
  calle: string;
  numero: string;
  comuna: string;
  region: string;
}

interface Orden {
  _id: string;
  estado: 'Pendiente' | 'Asignada' | 'Entregada';
  direccion: Direccion;
  orderId: {
    ticketId: string;
    total: number;
    email: string;
  };
}

const DespachosPendientes = () => {
  const [ordenes, setOrdenes] = useState<Orden[] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const fetchOrdenes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/despachos/pendientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Respuesta de backend:", res.data);
      if (Array.isArray(res.data)) {
        setOrdenes(res.data);
      } else {
        throw new Error('La respuesta del backend no es una lista');
      }
    } catch (err) {
      setMensaje('Error al obtener órdenes de despacho');
      console.error(err);
      setOrdenes([]); 
    } finally {
      setCargando(false);
    }
  };

  const tomarOrden = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/despachos/tomar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje(`Orden tomada: ${res.data.orden.orderId.ticketId}`);
      fetchOrdenes();
    } catch (err) {
      setMensaje('No se pudo tomar la orden');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  return (
    <Container>
      <h1>Órdenes de Despacho Pendientes</h1>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      {cargando ? (
        <p>Cargando...</p>
      ) : ordenes === null ? (
        <p>Error al cargar las órdenes.</p>
      ) : ordenes.length === 0 ? (
        <p>No hay órdenes pendientes.</p>
      ) : (
        ordenes.map((orden) => (
          <div key={orden._id} className="card">
            <p><strong>Ticket:</strong> {orden.orderId.ticketId}</p>
            <p><strong>Dirección:</strong> {`${orden.direccion.calle} ${orden.direccion.comuna}, ${orden.direccion.region}`}</p>
            <p><strong>Total:</strong> ${orden.orderId.total}</p>
            <button onClick={() => tomarOrden(orden._id)}>Tomar Orden</button>
          </div>
        ))
      )}
    </Container>
  );
};

export default DespachosPendientes;

// styles
const Container = styled.div`
  margin-top: 20px;
  padding: 1rem;

  h1 {
    color: #333;
    font-size: 28px;
    margin-bottom: 1rem;
  }

  .mensaje {
    font-size: 16px;
    color: green;
  }

  .card {
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  button {
    background-color: #007bff;
    color: white;
    padding: 0.4rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  button:hover {
    background-color: #0056b3;
  }
`;
