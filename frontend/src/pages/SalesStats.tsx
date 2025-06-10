import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer 
} from 'recharts';
import { API_URL } from '../config';

interface DetalleVenta {
  _id: string;
  orderId: string;
  productId: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  fechaVenta: string;
}

const SalesStats = () => {
  const [ventas, setVentas] = useState<DetalleVenta[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [totalVentas, setTotalVentas] = useState(0);
  const [productosMasVendidos, setProductosMasVendidos] = useState<{nombre: string, total: number}[]>([]);

  // Configurar axios con el token
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/ventas`);
      setVentas(response.data);
      
      // Calcular total de ventas
      const total = response.data.reduce((sum: number, venta: DetalleVenta) => sum + venta.subtotal, 0);
      setTotalVentas(total);

      // Calcular productos más vendidos
      const productos = response.data.reduce((acc: {[key: string]: number}, venta: DetalleVenta) => {
        acc[venta.nombre] = (acc[venta.nombre] || 0) + venta.cantidad;
        return acc;
      }, {});

      const topProductos = Object.entries(productos)
        .map(([nombre, total]) => ({ nombre, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setProductosMasVendidos(topProductos);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las ventas');
      console.error('Error:', err);
      setLoading(false);
    }
  };

  // Agregar esta función para procesar datos
  const procesarDatosGrafico = (ventas: DetalleVenta[]) => {
    const ventasPorDia = ventas.reduce((acc: {[key: string]: number}, venta) => {
      const fecha = new Date(venta.fechaVenta).toLocaleDateString();
      acc[fecha] = (acc[fecha] || 0) + venta.subtotal;
      return acc;
    }, {});

    return Object.entries(ventasPorDia).map(([fecha, total]) => ({
      fecha,
      total
    }));
  };

  if (loading) return <LoadingMessage>Cargando estadísticas...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Title>Estadísticas de Ventas</Title>

      <StatsGrid>
        <StatCard>
          <StatTitle>Total de Ventas</StatTitle>
          <StatValue>${Math.round((totalVentas)).toLocaleString('es-CL')}</StatValue>
        </StatCard>

        <StatCard>
          <StatTitle>Número de Transacciones</StatTitle>
          <StatValue>{ventas.length}</StatValue>
        </StatCard>
      </StatsGrid>



<Section>
  <SectionTitle>Tendencia de Ventas por Día</SectionTitle>
  <ChartContainer>
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={procesarDatosGrafico(ventas)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#e00000" 
          fill="#e00000" 
          fillOpacity={0.3} 
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
</Section>

      <Section>
        <SectionTitle>Productos Más Vendidos</SectionTitle>
        <ProductosGrid>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={productosMasVendidos}
                  dataKey="total"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {productosMasVendidos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Vendida</th>
                  <th>Total ($)</th>
                </tr>
              </thead>
              <tbody>
                {productosMasVendidos.map((producto) => (
                  <tr key={producto.nombre}>
                    <td>{producto.nombre}</td>
                    <td>{producto.total}</td>
                    <td>
                      ${ventas
                        .filter(v => v.nombre === producto.nombre)
                        .reduce((sum, v) => sum + v.subtotal, 0)
                        .toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </ProductosGrid>
      </Section>

      <Section>
        <SectionTitle>Historial de Ventas</SectionTitle>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta._id}>
                  <td>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                  <td>{venta.nombre}</td>
                  <td>{venta.cantidad}</td>
                  <td>${venta.precio.toLocaleString('es-CL')}</td>
                  <td>${venta.subtotal.toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatTitle = styled.h3`
  color: #666;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const StatValue = styled.div`
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const ProductosGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export default SalesStats; 