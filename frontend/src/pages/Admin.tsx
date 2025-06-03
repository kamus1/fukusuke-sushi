import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getProducts, updateProduct, createProduct, deleteProduct } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

  return (
    <Container>
      <AdminHeader>
        <h1>Panel de Administración</h1>
        <AdminNav>
          <NavLink to="/admin">Productos</NavLink>
          <NavLink to="/admin/ingredientes">Ingredientes</NavLink>
          <NavLink to="/admin/users">Usuarios</NavLink>
          <NavLink to="/admin/ventas">Estadísticas de Ventas</NavLink>
          <NavLink to="/admin/promociones">Promociones</NavLink>
        </AdminNav>
      </AdminHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
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


export default Admin; 