import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los productos');
        setLoading(false);
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <LoadingMessage>Cargando productos...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <ProductsContainer>
      <Title>Nuestros Productos</Title>
      <ProductsGrid>
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductImage src={product.img_url} alt={product.nombre} />
            <ProductInfo>
              <ProductName>{product.nombre}</ProductName>
              <ProductDescription>{product.descripcion}</ProductDescription>
              <ProductPrice>${product.precio.toLocaleString('es-CL')}</ProductPrice>
              <ProductStock>
                Disponible: {product.disponible} unidades
              </ProductStock>
              <AddToCartButton onClick={() => addToCart(product)}>
                Agregar al Carrito
              </AddToCartButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductsGrid>
    </ProductsContainer>
  );
};

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
  border-radius: 8px;
  margin: 1rem;
  text-align: center;
`;

// ---------- Estilos ----------
const Container = styled.div`
  .product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: opacity 0.3s;
  }

  .product-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
    transition: filter 0.3s;
    cursor: pointer;
  }

  .product-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }

  .product-price {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
  }

  .buy-button {
    background-color: #e00000;
    color: white;
    border: none;
    padding: 0.6rem;
    border-radius: 10px;
    margin-top: auto;
    font-size: 1rem;
    font-weight: 500;
    transition: background 0.3s;

    &:hover {
      background-color: #c00;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  .disabled {
    opacity: 0.8;
  }

  .disabled .product-image {
    filter: grayscale(100%);
  }

  .disabled .product-body h5,
  .disabled .product-price,
  .disabled .text-muted {
    color: #999 !important;
  }

  .text-unavailable {
    color: #999;
    font-style: italic;
  }
`;

// Estilos para el modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const ModalImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    margin: 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #555;
  }
`;

const ProductsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  margin: 0;
  color: #333;
`;

const ProductDescription = styled.p`
  color: #666;
  margin: 0.5rem 0;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e7d32;
  margin: 0.5rem 0;
`;

const ProductStock = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1b5e20;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default Products;