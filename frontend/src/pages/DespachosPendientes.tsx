import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Direccion {
  calle: string;
  numero: string;
  comuna: string;
  region: string;
}

interface Despachador {
  _id: string;
  nombre: string;
  email: string;
}

interface Orden {
  _id: string;
  estado: 'Pendiente' | 'Asignada' | 'Entregada';
  direccion: Direccion;
  encargadoDespacho: Despachador | null;
  orderId: {
    ticketId: string;
    total: number;
    email: string;
    nombres: string;
    rut: string;
    fechaPedido: string;
  };
}

const ITEMS_PER_PAGE = 10;

const DespachosPendientes = () => {
  const [ordenes, setOrdenes] = useState<Orden[] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // ✅ agregado

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserEmail(res.data.email);
        setUserId(res.data._id);
      } catch (err) {
        console.error('Error al obtener información del usuario:', err);
      }
    };
    fetchUserInfo();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/despachos/pendientes?page=${currentPage}&limit=${ITEMS_PER_PAGE}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.ordenes && Array.isArray(res.data.ordenes)) {
        const ordenesOrdenadas = res.data.ordenes.sort((a: Orden, b: Orden) => {
          if (a.estado === 'Pendiente' && b.estado !== 'Pendiente') return -1;
          if (a.estado !== 'Pendiente' && b.estado === 'Pendiente') return 1;
          return new Date(b.orderId.fechaPedido).getTime() - new Date(a.orderId.fechaPedido).getTime();
        });

        setOrdenes(ordenesOrdenadas);
        setTotalPages(Math.ceil(res.data.total / ITEMS_PER_PAGE));
      } else {
        throw new Error('La respuesta del backend no es válida');
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

  const completarOrden = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/despachos/completar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje(`Orden completada: ${res.data.orden.orderId.ticketId}`);
      fetchOrdenes();
    } catch (err: any) {
      setMensaje(err.response?.data?.msg || 'No se pudo completar la orden');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PageButton 
          key={i} 
          active={currentPage === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }
    return <PaginationContainer>{pages}</PaginationContainer>;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return '#fff3e0';
      case 'Asignada':
        return '#e3f2fd';
      case 'Entregada':
        return '#e8f5e9';
      default:
        return '#f9f9f9';
    }
  };

  const canCompleteOrder = (orden: Orden) => {
    return orden.estado === 'Asignada' && orden.encargadoDespacho?._id === userId;
  };

  return (
    <Container>
      <h1>Órdenes de Despacho</h1>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      {cargando ? (
        <p>Cargando...</p>
      ) : ordenes === null ? (
        <p>Error al cargar las órdenes.</p>
      ) : ordenes.length === 0 ? (
        <p>No hay órdenes pendientes.</p>
      ) : (
        <>
          <OrdenesContainer>
            {ordenes.map((orden) => (
              <div 
                key={orden._id} 
                className="card"
                style={{ backgroundColor: getEstadoColor(orden.estado) }}
              >
                <p><strong>Ticket:</strong> {orden.orderId.ticketId}</p>
                <p><strong>Cliente:</strong> {orden.orderId.nombres}</p>
                <p><strong>RUT:</strong> {orden.orderId.rut || 'No especificado'}</p>
                <p><strong>Email:</strong> {orden.orderId.email}</p>
                <p><strong>Dirección:</strong> {`${orden.direccion.calle} ${orden.direccion.comuna}, ${orden.direccion.region}`}</p>
                <p><strong>Total:</strong> ${orden.orderId.total}</p>
                <p><strong>Estado:</strong> {orden.estado}</p>
                <p><strong>Fecha:</strong> {new Date(orden.orderId.fechaPedido).toLocaleString()}</p>
                {orden.encargadoDespacho && (
                  <>
                    <p><strong>Despachador:</strong> {orden.encargadoDespacho.nombre}</p>
                    <p><strong>Email Despachador:</strong> {orden.encargadoDespacho.email}</p>
                  </>
                )}
                <ButtonContainer>
                  {orden.estado === 'Pendiente' && (
                    <button onClick={() => tomarOrden(orden._id)}>Tomar Orden</button>
                  )}
                  {canCompleteOrder(orden) && (
                    <button onClick={() => completarOrden(orden._id)}>Completar Orden</button>
                  )}
                </ButtonContainer>
              </div>
            ))}
          </OrdenesContainer>
          {renderPagination()}
        </>
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
`;

const OrdenesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  .card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;

    p {
      margin: 0.5rem 0;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  button {
    flex: 1;
    background-color: #007bff;
    color: white;
    padding: 0.4rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#007bff'};
  border: 1px solid #007bff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;
