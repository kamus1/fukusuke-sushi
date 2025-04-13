import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: #FF4848;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 20px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: white;
    transition: transform 0.3s;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavbarContainer = styled.nav`
  background-color: #000;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: red;
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Logo to="/">🍣 Fukusuke Sushi</Logo>
      <NavLinks>
        <StyledNavLink to="/">Home</StyledNavLink>
        <StyledNavLink to="/about">Acerca de</StyledNavLink>
        <StyledNavLink to="/productos">Productos</StyledNavLink>
        <StyledNavLink to="/contact">Contacto</StyledNavLink>
        <StyledNavLink to="/admin">Admin</StyledNavLink>
      </NavLinks>
      <MobileMenuButton>
        <span></span>
        <span></span>
        <span></span>
      </MobileMenuButton>
    </NavbarContainer>
  );
};

export default Navbar;