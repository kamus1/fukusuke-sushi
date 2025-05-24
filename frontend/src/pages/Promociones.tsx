import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  nombre: string;
  precio: number;
  img_url: string;
}

interface Promocion {
  _id: string;
  titulo: string;
  imagen: string;
  descripcion: string;
  descuento: number;
  activa: boolean;
  fechaInicio: string;
  fechaFin: string;
  productos: Product[];
}

const Promociones = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [newPromocion, setNewPromocion] = useState({
    titulo: '',
    imagen: '',
    descripcion: '',
    descuento: 0,
    activa: true,
    fechaInicio: '',
    fechaFin: '',
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    fetchPromociones();
    fetchProductos();
  }, []);

  const fetchPromociones = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/promociones/admin');
      setPromociones(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las promociones');
      console.error(err);
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products');
      setProductos(response.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/promociones', {
        ...newPromocion,
        productos: selectedProducts
      });
      setShowForm(false);
      setNewPromocion({
        titulo: '',
        imagen: '',
        descripcion: '',
        descuento: 0,
        activa: true,
        fechaInicio: '',
        fechaFin: '',
      });
      setSelectedProducts([]);
      fetchPromociones();
    } catch (err) {
      setError('Error al crear la promoción');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      try {
        await axios.delete(`http://localhost:5001/api/promociones/${id}`);
        fetchPromociones();
      } catch (err) {
        setError('Error al eliminar la promoción');
        console.error(err);
      }
    }
  };

  const handleToggleActive = async (promocion: Promocion) => {
    try {
      await axios.put(`http://localhost:5001/api/promociones/${promocion._id}`, {
        ...promocion,
        activa: !promocion.activa
      });
      fetchPromociones();
    } catch (err) {
      setError('Error al actualizar la promoción');
      console.error(err);
    }
  };

  if (loading) return <LoadingMessage>Cargando promociones...</LoadingMessage>;

  return (
    <Container>
      <Title>Gestión de Promociones</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Nueva Promoción'}
      </Button>

      {showForm && (
        <FormContainer onSubmit={handleSubmit}>
          <FormTitle>Crear Nueva Promoción</FormTitle>
          <FormGrid>
            <FormField>
              <label>Título:</label>
              <input
                type="text"
                value={newPromocion.titulo}
                onChange={(e) => setNewPromocion({...newPromocion, titulo: e.target.value})}
                required
              />
            </FormField>
            <FormField>
              <label>URL de Imagen:</label>
              <input
                type="text"
                value={newPromocion.imagen}
                onChange={(e) => setNewPromocion({...newPromocion, imagen: e.target.value})}
              />
            </FormField>
            <FormField>
              <label>Descripción:</label>
              <textarea
                value={newPromocion.descripcion}
                onChange={(e) => setNewPromocion({...newPromocion, descripcion: e.target.value})}
                required
              />
            </FormField>
            <FormField>
              <label>Descuento (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newPromocion.descuento}
                onChange={(e) => setNewPromocion({...newPromocion, descuento: Number(e.target.value)})}
                required
              />
            </FormField>
            <FormField>
              <label>Fecha de Inicio:</label>
              <input
                type="datetime-local"
                value={newPromocion.fechaInicio}
                onChange={(e) => setNewPromocion({...newPromocion, fechaInicio: e.target.value})}
                required
              />
            </FormField>
            <FormField>
              <label>Fecha de Fin:</label>
              <input
                type="datetime-local"
                value={newPromocion.fechaFin}
                onChange={(e) => setNewPromocion({...newPromocion, fechaFin: e.target.value})}
                required
              />
            </FormField>
            <FormField className="full-width">
              <label>Productos:</label>
              <ProductGrid>
                {productos.map((producto) => (
                  <ProductCard
                    key={producto._id}
                    selected={selectedProducts.includes(producto._id)}
                    onClick={() => {
                      if (selectedProducts.includes(producto._id)) {
                        setSelectedProducts(selectedProducts.filter(id => id !== producto._id));
                      } else {
                        setSelectedProducts([...selectedProducts, producto._id]);
                      }
                    }}
                  >
                    <img src={producto.img_url} alt={producto.nombre} />
                    <p>{producto.nombre}</p>
                    <p>${producto.precio.toLocaleString('es-CL')}</p>
                  </ProductCard>
                ))}
              </ProductGrid>
            </FormField>
          </FormGrid>
          <ButtonGroup>
            <SubmitButton type="submit">Crear Promoción</SubmitButton>
            <CancelButton type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </CancelButton>
          </ButtonGroup>
        </FormContainer>
      )}

      <PromocionesGrid>
        {promociones.map((promocion) => (
          <PromocionCard key={promocion._id}>
            {promocion.imagen && (
              <PromocionImage src={promocion.imagen} alt={promocion.titulo} />
            )}
            <PromocionContent>
              <h3>{promocion.titulo}</h3>
              <p>{promocion.descripcion}</p>
              <p>Descuento: {promocion.descuento}%</p>
              <p>Inicio: {new Date(promocion.fechaInicio).toLocaleString()}</p>
              <p>Fin: {new Date(promocion.fechaFin).toLocaleString()}</p>
              <p>Productos: {promocion.productos.length}</p>
              <ButtonGroup>
                <ToggleButton
                  active={promocion.activa}
                  onClick={() => handleToggleActive(promocion)}
                >
                  {promocion.activa ? 'Desactivar' : 'Activar'}
                </ToggleButton>
                <DeleteButton onClick={() => handleDelete(promocion._id)}>
                  Eliminar
                </DeleteButton>
              </ButtonGroup>
            </PromocionContent>
          </PromocionCard>
        ))}
      </PromocionesGrid>
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
`;

const Button = styled.button`
  background-color: #e00000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;

  &:hover {
    background-color: #c00;
  }
`;

const FormContainer = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  .full-width {
    grid-column: 1 / -1;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #333;
  }

  input, textarea {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ProductCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? '#e00000' : '#ddd'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.selected ? '#fff5f5' : 'white'};

  &:hover {
    border-color: #e00000;
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
  }

  p {
    margin: 0.5rem 0;
    text-align: center;
  }
`;

const PromocionesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const PromocionCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PromocionImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PromocionContent = styled.div`
  padding: 1.5rem;

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  p {
    margin: 0.5rem 0;
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5a6268;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#dc3545' : '#28a745'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.active ? '#c82333' : '#218838'};
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
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

export default Promociones; 