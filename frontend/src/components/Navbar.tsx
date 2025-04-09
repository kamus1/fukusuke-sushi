import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
  return (
    <Container className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          🍣 Fukusuke Sushi
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
                to="/fukusuke-sushi/"
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
                to="/fukusuke-sushi/productos"
                end
              >
                Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
                to="/fukusuke-sushi/contact"
              >
                Contacto
              </NavLink>

              
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.nav`
  background-color: #000;
  top: 0;
  width: 100%;

  & a {
    color: white;
    &:hover {
      color: red;
    }
  }

  & .nav-link.active {
    color: red;
  }

  & .navbar-brand {
    color: white;
  }

  & .navbar-toggler-icon {
    filter: brightness(0) invert(1); 
  }

`;

export default Navbar;