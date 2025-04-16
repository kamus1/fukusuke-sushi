import { useState, useEffect } from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

type Product = {
  _id: string;
  nombre: string;
  precio: number;
  disponible: number;
  img_url: string;
  descripcion?: string;
  tipo?: string;
  cantidad_piezas?: number;
  especialidad?: string;
  tags?: string[];
};

const Products: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Error al cargar productos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Container className="container mt-4">
        <h3 className="title" >Nuestros Productos</h3>
        <div className="row">
          {products.map((product: Product) => {
            const isAvailable = product.disponible > 0;

            return (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div className={`product-card ${!isAvailable ? "disabled" : ""}`}>
                  <img
                    className="product-image"
                    src={product.img_url}
                    alt={product.nombre}
                    onClick={() => setSelectedProduct(product)}
                  />
                  <div className="product-body">
                    <h5>{product.nombre}</h5>
                    {!isAvailable ? (
                      <small className="text-unavailable">Producto no disponible</small>
                    ) : (
                      <small className="text-muted">{product.especialidad}</small>
                    )}
                    <p className="product-price">${product.precio.toLocaleString("es-CL")}</p>
                    <button
                      className="buy-button"
                      disabled={!isAvailable}
                      onClick={() =>
                        addToCart({
                          id: product._id,
                          nombre: product.nombre,
                          precio: product.precio,
                          img_url: product.img_url,
                          cantidad: 1,
                        })
                      }
                    >
                      {isAvailable ? "Añadir al carrito" : "Agotado"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {selectedProduct && (
        <ModalOverlay onClick={() => setSelectedProduct(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedProduct(null)}>&times;</CloseButton>
            <ModalImage src={selectedProduct.img_url} alt={selectedProduct.nombre} />
            <ModalBody>
              <h3>{selectedProduct.nombre}</h3>
              <div className="price-section">
                <p className="price">${selectedProduct.precio.toLocaleString("es-CL")}</p>
              </div>
              {selectedProduct.descripcion && <p className="description">{selectedProduct.descripcion}</p>}
              <div className="details-grid">
                {selectedProduct.cantidad_piezas && (
                  <div className="detail-item">
                    <span>Piezas:</span>
                    <strong>{selectedProduct.cantidad_piezas}</strong>
                  </div>
                )}
              </div>
              <AddToCartButton
                onClick={() => {
                  addToCart({
                    id: selectedProduct._id,
                    nombre: selectedProduct.nombre,
                    precio: selectedProduct.precio,
                    img_url: selectedProduct.img_url,
                    cantidad: 1,
                  });
                  setSelectedProduct(null);
                }}
                disabled={selectedProduct.disponible <= 0}
              >
                {selectedProduct.disponible > 0 ? "Añadir al carrito" : "Producto agotado"}
              </AddToCartButton>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Products;
const Container = styled.div`

  .title{
    text-align: start;
    margin-bottom: 1.5rem;
    color: #333;
  }
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: overlayFade 0.3s ease forwards;

  @keyframes overlayFade {
    to {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
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

  //animacion
  opacity: 0;
  transform: scale(0.95);
  animation: fadeInUp 0.3s ease forwards;

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
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

const AddToCartButton = styled.button`
  background-color: #e00000;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 10px;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #c00;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
