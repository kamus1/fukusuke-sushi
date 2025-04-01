import styled from "styled-components";
import productsData from "../data/products.json";
import { useCart } from "../context/CartContext";

type Product = {
  id: number;
  nombre: string;
  precio: number;
  disponible: number;
  img_url: string;
};

const Products: React.FC = () => {
  const { addToCart } = useCart();
  return (
    <Container className="container mt-4">
      <div className="row">
        {productsData.map((product: Product) => {
          const isAvailable = product.disponible > 0;

          return (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className={`product-card ${!isAvailable ? "disabled" : ""}`}>
                <img
                  className="product-image"
                  src={product.img_url}
                  alt={product.nombre}
                />
                <div className="product-body">
                  <h5>{product.nombre}</h5>
                  {!isAvailable ? (
                    <small className="text-unavailable">Producto no disponible</small>
                  ) : (
                    <small className="text-muted">Disponible: {product.disponible}</small>
                  )}
                  <p className="product-price">${product.precio}</p>
                  <button
                    className="buy-button"
                    disabled={!isAvailable}
                    onClick={() =>
                      addToCart({
                        id: product.id,
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
  );
};

export default Products;

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
