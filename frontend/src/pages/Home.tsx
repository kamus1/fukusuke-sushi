import { useState, useEffect } from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";
import axios from 'axios';
import { API_URL } from '../config';
import { calcularPrecioConDescuento } from '../utils/priceUtils';

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

type Promocion = {
  _id: string;
  titulo: string;
  imagen: string;
  descripcion: string;
  descuento: number;
  fechaInicio: string;
  fechaFin: string;
  productos: Product[];
};

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [promociones, setPromociones] = useState<Promocion[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, promocionesData] = await Promise.all([
          getProducts(),
          axios.get(`${API_URL}/api/promociones`)
        ]);
        setProducts(productsData.slice(0, 5));
        setPromociones(promocionesData.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Container>
      <div className="container mt-4">
        {/* Carousel Promociones */}
        <div id="carouselPromo" className="carousel slide mb-5" data-bs-ride="carousel">
          <div className="carousel-inner rounded">
            {promociones.map((promo, index) => (
              <div
                key={promo._id}
                className={`carousel-item rounded ${index === 0 ? "active" : ""}`}
              >
                <div className="d-flex justify-content-center align-items-center flex-wrap text-white p-4 rounded">
                  <div className="promo-text">
                    <h6>Fukusuke Sushi</h6>
                    <h2>{promo.titulo}</h2>
                    <p>{promo.descripcion}</p>
                    <p className="descuento">¡{promo.descuento}% de descuento!</p>
                    <a href="/productos" className="btn btn-outline-light mt-2">
                      Ver Productos →
                    </a>
                  </div>
                  <div className="promo-img">
                    {promo.imagen ? (
                      <img
                        src={promo.imagen}
                        alt={promo.titulo}
                        className="img-fluid"
                        style={{ maxHeight: "220px" }}
                      />
                    ) : (
                      <div className="placeholder-img">
                        <span>Sin imagen</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselPromo" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselPromo" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>

        {/* Productos destacados */}
        <h4 className="fw-bold mb-4">Lo más comprado:</h4>
        <div className="row">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            products.map((product) => {
              // Buscar si el producto tiene una promoción activa
              const promocionActiva = promociones.find(promo => 
                promo.productos.some(p => p._id === product._id)
              );
              
              const precioConDescuento = promocionActiva 
                ? calcularPrecioConDescuento(product.precio, promocionActiva.descuento)
                : product.precio;

              return (
                <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div
                    className={`product-card ${product.disponible <= 0 ? "disabled" : ""}`}
                  >
                    <img
                      className="product-image"
                      src={product.img_url}
                      alt={product.nombre}
                      onClick={() => setSelectedProduct(product)}
                    />
                    <div className="product-body">
                      <p className="mb-1">{product.nombre}</p>
                      <small>
                        {product.disponible <= 0 ? (
                          <span className="text-unavailable">No disponible</span>
                        ) : (
                          product.especialidad
                        )}
                      </small>
                      {promocionActiva ? (
                        <div className="precio-promocion">
                          <span className="precio-original">${product.precio.toLocaleString("es-CL")}</span>
                          <span className="precio-descuento">${precioConDescuento.toLocaleString("es-CL")}</span>
                          <span className="descuento-badge">-{promocionActiva.descuento}%</span>
                        </div>
                      ) : (
                        <p className="product-price">${product.precio.toLocaleString("es-CL")}</p>
                      )}
                      <button
                        className="buy-button"
                        disabled={product.disponible <= 0}
                        onClick={() =>
                          addToCart({
                            id: product._id,
                            nombre: product.nombre,
                            precio: precioConDescuento,
                            img_url: product.img_url,
                            cantidad: 1,
                          })
                        }
                      >
                        {product.disponible > 0 ? "Añadir al carrito" : "Agotado"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedProduct && (
        <ModalOverlay onClick={() => setSelectedProduct(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedProduct(null)}>&times;</CloseButton>
            <ModalImage src={selectedProduct.img_url} alt={selectedProduct.nombre} />
            <ModalBody>
              <h3>{selectedProduct.nombre}</h3>
              {promociones.find(promo => 
                promo.productos.some(p => p._id === selectedProduct._id)
              ) ? (
                <div className="precio-promocion">
                  <span className="precio-original">${selectedProduct.precio.toLocaleString("es-CL")}</span>
                  <span className="precio-descuento">
                    ${(selectedProduct.precio * (1 - promociones.find(promo => 
                      promo.productos.some(p => p._id === selectedProduct._id)
                    )!.descuento / 100)).toLocaleString("es-CL")}
                  </span>
                  <span className="descuento-badge">
                    -{promociones.find(promo => 
                      promo.productos.some(p => p._id === selectedProduct._id)
                    )!.descuento}%
                  </span>
                </div>
              ) : (
                <p className="price">${selectedProduct.precio.toLocaleString("es-CL")}</p>
              )}
              {selectedProduct.descripcion && <p>{selectedProduct.descripcion}</p>}
              {selectedProduct.cantidad_piezas && (
                <p>
                  <span>Piezas:</span> <strong>{selectedProduct.cantidad_piezas}</strong>
                </p>
              )}
              <AddToCartButton
                onClick={() => {
                  const promocionActiva = promociones.find(promo => 
                    promo.productos.some(p => p._id === selectedProduct._id)
                  );
                  const precioFinal = promocionActiva 
                    ? selectedProduct.precio * (1 - promocionActiva.descuento / 100)
                    : selectedProduct.precio;

                  addToCart({
                    id: selectedProduct._id,
                    nombre: selectedProduct.nombre,
                    precio: precioFinal,
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
    </Container>
  );
};

export default Home;

const Container = styled.div`
  .product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: 0.3s;
  }

  .product-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
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
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
  }

  .precio-promocion {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }

  .precio-original {
    text-decoration: line-through;
    color: #999;
    font-size: 0.9rem;
  }

  .precio-descuento {
    color: #e00000;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .descuento-badge {
    background-color: #e00000;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
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

  .disabled .product-image {
    filter: grayscale(100%);
  }

  .text-unavailable {
    color: #999;
    font-style: italic;
  }

  .promo-text h2 {
    font-size: 2rem;
  }

  .promo-img {
    max-width: 240px;
  }

  .carousel-item {
    height: 300px;
    background-color: #000000;
  }

  .carousel-item > div {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  .placeholder-img {
    width: 240px;
    height: 220px;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .carousel-item {
      height: 410px;
      padding: 1rem 0;
    }

    .carousel-item > div {
      justify-content: center;
      gap: 1rem;
    }

    .promo-img {
      max-width: 60%;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
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

  /* Animación */
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
  gap: 0.75rem;

  h3 {
    margin: 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #555;
  }

  .precio-promocion {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }

  .precio-original {
    text-decoration: line-through;
    color: #999;
    font-size: 0.9rem;
  }

  .precio-descuento {
    color: #e00000;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .descuento-badge {
    background-color: #e00000;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
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
