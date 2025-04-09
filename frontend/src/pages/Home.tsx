import styled from "styled-components";
import productsData from "../data/products.json";
import { useCart } from "../context/CartContext";
import promociones from "../data/promociones.json";

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const destacados = productsData.slice(0, 5);//mostrar solo 5

  return (
    <Container>
      <div className="container-fluid mt-4">

        {/* Carousel Promociones */}
        <div id="carouselPromo" className="carousel slide mb-5" data-bs-ride="carousel">
          <div className="carousel-inner rounded">
            {promociones.map((promo, index) => (
              <div
                key={promo.id}
                className={`carousel-item rounded ${index === 0 ? "active" : ""}`}
              >
                <div className="d-flex justify-content-center align-items-center flex-wrap text-white p-4 rounded">
                  <div className="promo-text">
                    <h6>Fukusuke Sushi</h6>
                    <h2>{promo.titulo}</h2>
                    <p>{promo.descripcion}</p>
                    <a href={promo.link} className="btn btn-outline-light mt-2">
                      Explorar Productos →
                    </a>
                  </div>
                  <div className="promo-img">
                    <img
                      src={promo.img_url}
                      alt={promo.titulo}
                      className="img-fluid"
                      style={{ maxHeight: "220px" }}
                    />
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
        {/* Lo más comprado */}
        <h4 className="fw-bold mb-4">Lo más comprado:</h4>
        <div className="row">
          {destacados.map(product => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="product-card">
                <img className="product-image" src={product.img_url} alt={product.nombre} />
                <div className="product-body">
                  <p className="mb-1">{product.nombre}</p>
                  <p className="product-price">${product.precio}</p>
                  <button
                    className="buy-button"
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
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Home;


// styles
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
  }

  .promo-text h2 {
    font-size: 2rem;
  }

  .promo-img {
    max-width: 240px;
  }

  .carousel-item {
    height: 300px; //altura fija del carrousel item
    background-color: #000000;
  }

  .carousel-item > div {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .carousel-item {
      height: auto;
      padding: 1rem 0;
      height: 410px;
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
