import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getProducts, updateProduct, createProduct, deleteProduct } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

interface Product {
  id: number;
  nombre: string;
  precio: number | string;
  disponible: number | string;
  img_url: string;
  descripcion: string;
  tipo: string;
  cantidad_piezas: number | string;
  especialidad: string;
  tags: string[];
}

interface Order {
  _id: string;
  ticketId: string;
  email: string;
  nombres: string;
  telefono: string;
  items: {
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
  }[];
  total: number;
  estado: string;
  fechaPedido: string;
  direccionEnvio: {
    calle: string;
    numeroCasa: string;
    comuna: string;
    region: string;
  };
}

const emptyProduct: Product = {
  id: 0,
  nombre: '',
  precio: '',
  disponible: '',
  img_url: '',
  descripcion: '',
  tipo: 'tabla',
  cantidad_piezas: '',
  especialidad: 'Clásica',
  tags: []
};

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>(emptyProduct);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Cargar productos de la API
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los productos');  
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product.id);
    setEditedProduct({ ...product });
    setError(null);
    setSuccessMessage(null);
    setShowCreateForm(false);
  };

  const handleSave = async () => {
    if (editingProduct && editedProduct) {
      try {
        const updatedProduct = await updateProduct(editingProduct, editedProduct);
        setProducts(products.map(p => 
          p.id === editingProduct ? updatedProduct : p
        ));
        setEditingProduct(null);
        setEditedProduct(null);
        setError(null);
        setSuccessMessage('Producto actualizado correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError('Error al actualizar el producto');
        console.error(err);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        setSuccessMessage('Producto eliminado correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError('Error al eliminar el producto');
        console.error(err);
      }
    }
  };

  const handleCreate = async () => {
    try {
      const productToCreate = {
        ...newProduct,
        precio: Number(newProduct.precio),
        disponible: Number(newProduct.disponible),
        cantidad_piezas: Number(newProduct.cantidad_piezas)
      };
      const createdProduct = await createProduct(productToCreate);
      setProducts([...products, createdProduct]);
      setShowCreateForm(false);
      setNewProduct(emptyProduct);
      setSuccessMessage('Producto creado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error al crear el producto');
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, isNewProduct: boolean = false) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    if (isNewProduct) {
      setNewProduct({
        ...newProduct,
        [e.target.name]: value
      });
    } else if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [e.target.name]: value
      });
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setEditedProduct(null);
    setError(null);
    setShowCreateForm(false);
  };

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Error al cargar las órdenes');
      console.error(err);
    }
  };

  useEffect(() => {
    if (showOrders) {
      loadOrders();
    }
  }, [showOrders]);

  return (
    <Container>
      <AdminHeader>
        <h1>Panel de Administración</h1>
        <AdminNav>
          <NavLink to="/admin" onClick={() => setShowOrders(false)}>Productos</NavLink>
          <NavLink to="/admin/users">Usuarios</NavLink>
          <NavLink to="/admin/ingredientes">Ingredientes</NavLink>
          <NavLink to="/admin/ventas">Estadísticas de Ventas</NavLink>
          <NavLink to="/admin/promociones">Promociones</NavLink>
          <button style={{padding: '0.5rem 1rem', backgroundColor: '#f0f0f0', borderRadius: '4px', border: 'none', color: '#333', cursor: 'pointer'}} onClick={() => setShowOrders(true)}>
            Ver Comprobantes
          </button>
          <button style={{padding: '0.5rem 1rem', backgroundColor: '#0fb70f', borderRadius: '4px', border: 'none', color: 'white', cursor: 'pointer'}} onClick={() => setShowCreateForm(true)}>
            Crear Producto
          </button>
        </AdminNav>
      </AdminHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      {showOrders ? (
        <TableWrapper>
          <h2>Comprobantes de Compra</h2>
          <OrdersTable>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <>
                  <tr key={order._id}>
                    <td>{order.ticketId}</td>
                    <td>{new Date(order.fechaPedido).toLocaleString()}</td>
                    <td>{order.nombres}</td>
                    <td>{order.email}</td>
                    <td>{order.telefono}</td>
                    <td>
                      {order.direccionEnvio
                        ? `${order.direccionEnvio.calle} ${order.direccionEnvio.numeroCasa}, ${order.direccionEnvio.comuna}`
                        : 'Sin dirección'}
                    </td>
                    <td>${order.total.toLocaleString('es-CL')}</td>
                    <td>
                      <StatusBadge status={order.estado}>
                        {order.estado}
                      </StatusBadge>
                    </td>
                    <td>
                      <DetailsButton 
                        onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                      >
                        {expandedOrderId === order._id ? 'Ocultar' : 'Ver'} Detalles
                      </DetailsButton>
                    </td>
                  </tr>
                  {expandedOrderId === order._id && (
                    <tr>
                      <td colSpan={9}>
                        <OrderDetails>
                          <h4>Detalles del Pedido</h4>
                          <ItemsList>
                            {order.items.map((item, index) => (
                              <ItemRow key={index}>
                                <ItemName>{item.nombre}</ItemName>
                                <ItemQuantity>x{item.cantidad}</ItemQuantity>
                                <ItemPrice>${item.precio.toLocaleString('es-CL')}</ItemPrice>
                                <ItemSubtotal>${item.subtotal.toLocaleString('es-CL')}</ItemSubtotal>
                              </ItemRow>
                            ))}
                          </ItemsList>
                          <OrderTotal>
                            Total: ${order.total.toLocaleString('es-CL')}
                          </OrderTotal>
                        </OrderDetails>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </OrdersTable>
        </TableWrapper>
      ) : (
        <>
          {showCreateForm && (
            <FormContainer>
              <h2>Crear Nuevo Producto</h2>
              <FormGrid>
                <FormField>
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={newProduct.nombre}
                    onChange={(e) => handleChange(e, true)}
                  />
                </FormField>
                <FormField>
                  <label>Precio:</label>
                  <input
                    type="number"
                    name="precio"
                    value={newProduct.precio}
                    onChange={(e) => handleChange(e, true)}
                  />
                </FormField>
                <FormField>
                  <label>Stock:</label>
                  <input
                    type="number"
                    name="disponible"
                    value={newProduct.disponible}
                    onChange={(e) => handleChange(e, true)}
                  />
                </FormField>
                <FormField>
                  <label>Tipo:</label>
                  <select
                    name="tipo"
                    value={newProduct.tipo}
                    onChange={(e) => handleChange(e, true)}
                  >
                    <option value="Tabla">Tabla</option>
                    <option value="Individual">Individual</option>
                    <option value="Combo">Combo</option>
                    <option value="Especial">Especial</option>
                  </select>
                </FormField>
                <FormField>
                  <label>Especialidad:</label>
                  <select
                    name="especialidad"
                    value={newProduct.especialidad}
                    onChange={(e) => handleChange(e, true)}
                  >
                    <option value="">Seleccione una especialidad</option>
                    <option value="Clásica">Clásica</option>
                    <option value="Premium">Premium</option>
                    <option value="Vegetariana">Vegetariana</option>
                    <option value="Gourmet">Gourmet</option>
                    <option value="Tradicional">Tradicional</option>
                    <option value="Fusion">Fusión</option>
                    <option value="Crunchy">Crunchy</option>
                    <option value="Familiar">Familiar</option>
                  </select>
                </FormField>
                <FormField>
                  <label>URL de Imagen:</label>
                  <input
                    type="text"
                    name="img_url"
                    value={newProduct.img_url}
                    onChange={(e) => handleChange(e, true)}
                  />
                </FormField>
                <FormField>
                  <label>Cantidad de Piezas:</label>
                  <input
                    type="number"
                    name="cantidad_piezas"
                    value={newProduct.cantidad_piezas}
                    onChange={(e) => handleChange(e, true)}
                  />
                </FormField>
                <FormField className="full-width">
                  <label>Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={newProduct.descripcion}
                    onChange={(e) => handleChange(e, true)}
                  />
                </FormField>
              </FormGrid>
              <ButtonGroup>
                <SaveButton onClick={handleCreate}>Crear Producto</SaveButton>
                <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
              </ButtonGroup>
            </FormContainer>
          )}

          <TableWrapper>
            <ProductsTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Tipo</th>
                  <th>Imagen URL</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {editingProduct === product.id ? (
                        <input
                          type="text"
                          name="nombre"
                          value={editedProduct?.nombre || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        product.nombre
                      )}
                    </td>
                    <td>
                      {editingProduct === product.id ? (
                        <input
                          type="number"
                          name="precio"
                          value={editedProduct?.precio || 0}
                          onChange={handleChange}
                        />
                      ) : (
                        `$${product.precio.toLocaleString('es-CL')}`
                      )}
                    </td>
                    <td>
                      {editingProduct === product.id ? (
                        <input
                          type="number"
                          name="disponible"
                          value={editedProduct?.disponible || 0}
                          onChange={handleChange}
                        />
                      ) : (
                        product.disponible
                      )}
                    </td>
                    <td>
                      {editingProduct === product.id ? (
                        <select
                          name="tipo"
                          value={editedProduct?.tipo || ''}
                          onChange={handleChange}
                        >
                          <option value="Tabla">Tabla</option>
                          <option value="Individual">Individual</option>
                          <option value="Combo">Combo</option>
                          <option value="Especial">Especial</option>
                        </select>
                      ) : (
                        product.tipo
                      )}
                    </td>
                    <td>
                      {editingProduct === product.id ? (
                        <input
                          type="text"
                          name="img_url"
                          value={editedProduct?.img_url || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        <img 
                          src={product.img_url} 
                          alt={product.nombre} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      )}
                    </td>
                    <td>
                      {editingProduct === product.id ? (
                        <textarea
                          name="descripcion"
                          value={editedProduct?.descripcion || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        product.descripcion
                      )}
                    </td>
                    <td>
                      {editingProduct === product.id ? (
                        <ButtonGroup>
                          <SaveButton onClick={handleSave}>Guardar</SaveButton>
                          <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
                        </ButtonGroup>
                      ) : (
                        <ButtonGroup>
                          <EditButton onClick={() => handleEdit(product)}>
                            <span role="img" aria-label="edit">✏️</span>
                          </EditButton>
                          <DeleteButton onClick={() => handleDelete(product.id)}>
                            <span role="img" aria-label="delete">🗑️</span>
                          </DeleteButton>
                        </ButtonGroup>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </ProductsTable>
          </TableWrapper>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const AdminHeader = styled.div`
  margin-bottom: 2rem;
`;

const AdminNav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const NavLink = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const TableWrapper = styled.div`
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: white;

  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  th {
    background: #e00000;
    color: white;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;

    @media (max-width: 768px) {
      padding: 0.75rem;
      font-size: 0.875rem;
    }
  }

  tr:hover {
    background: #f8f9fa;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const CreateButton = styled(Button)`
  background: #28a745;
  padding: 0.75rem 1.5rem;
  font-weight: 500;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }
`;

const EditButton = styled(Button)`
  background: #FFC107;
  padding: 0.5rem;

  &:hover {
    background: #FFA000;
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled(Button)`
  background: #e00000;
  padding: 0.5rem;

  &:hover {
    background: #ff3333;
    transform: translateY(-2px);
  }
`;

const SaveButton = styled(Button)`
  background: #28a745;

  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;

  &:hover {
    background: #5a6268;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  .full-width {
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

  input, select, textarea {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const TableActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 1rem;

  th {
    background: #e00000;
    color: white;
    padding: 1rem;
    text-align: left;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }

  tr:hover {
    background: #f8f9fa;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case 'pagado':
        return '#e8f5e9';
      case 'pendiente':
        return '#fff3e0';
      case 'en_proceso':
        return '#e3f2fd';
      case 'cancelado':
        return '#ffebee';
      case 'rechazado':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'pagado':
        return '#2e7d32';
      case 'pendiente':
        return '#ef6c00';
      case 'en_proceso':
        return '#1565c0';
      case 'cancelado':
      case 'rechazado':
        return '#c62828';
      default:
        return '#616161';
    }
  }};
`;

const DetailsButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const OrderDetails = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);

  h4 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  align-items: center;
`;

const ItemName = styled.span`
  font-weight: 500;
`;

const ItemQuantity = styled.span`
  color: #666;
`;

const ItemPrice = styled.span`
  color: #666;
`;

const ItemSubtotal = styled.span`
  font-weight: 600;
  color: #e00000;
`;

const OrderTotal = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #eee;
  text-align: right;
  font-size: 1.2rem;
  font-weight: 600;
  color: #e00000;
`;

export default Admin;