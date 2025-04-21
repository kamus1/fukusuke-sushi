import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoLogOutOutline } from "react-icons/io5"; // npm install react-icons

const Navbar = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/fukusuke-sushi/login/');
  };

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
            {user?.role === 'admin' && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  to="/fukusuke-sushi/admin"
                >
                  Admin
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              {user ? (
                <LogoutButton onClick={handleLogout} title="Cerrar sesión">
                  <IoLogOutOutline />
                </LogoutButton>
              ) : (
                <NavLink
                  className="nav-link"
                  to="/fukusuke-sushi/login"
                  title="Iniciar sesión"
                >
                  Iniciar sesión
                </NavLink>
              )}
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

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin-left: 10px;
  transition: color 0.3s ease;

  &:hover {
    color: red;
  }
`;

export default Navbar;