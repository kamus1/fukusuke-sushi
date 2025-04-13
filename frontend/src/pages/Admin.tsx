import { useState, useEffect } from 'react';
import styled from 'styled-components';
import productsData from '../data/products.json';

const Admin = () => {
  const [products, setProducts] = useState(productsData);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<any>(null);

  useEffect(() => {
    // Cargar datos guardados de localStorage al iniciar
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleEdit = (product: any) => {
    setEditingProduct(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = () => {
    if (editingProduct && editedProduct) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct ? editedProduct : p
      );
      setProducts(updatedProducts);
      // Guardar en localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setEditingProduct(null);
      setEditedProduct(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
      });
    }
  };

  return (
    <AdminContainer>
      <Title>Panel de Administración</Title>
      <ProductsTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Disponibilidad</th>
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
                    value={editedProduct?.nombre}
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
                    value={editedProduct?.precio}
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
                    value={editedProduct?.disponible}
                    onChange={handleChange}
                  />
                ) : (
                  product.disponible
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <SaveButton onClick={handleSave}>Guardar</SaveButton>
                ) : (
                  <EditButton onClick={() => handleEdit(product)}>Editar</EditButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </ProductsTable>
    </AdminContainer>
  );
};

const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #000000;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #FF4848;
    color: white;
  }

  tr:hover {
    background: #f8f9fa;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
  }
`;

const EditButton = styled.button`
  background: #FF4848;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #ff3333;
  }
`;

const SaveButton = styled(EditButton)`
  background: #28a745;

  &:hover {
    background: #218838;
  }
`;

export default Admin; 