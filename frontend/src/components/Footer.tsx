import styled from "styled-components";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Section>
        <Emoji>🍣</Emoji>
        <BrandName>Fukusuke Sushi</BrandName>
        <SocialIcons>
          <FaInstagram />
          <FaFacebook />
          <FaWhatsapp />
        </SocialIcons>
      </Section>

      <Section>
        <Copyright>
          Fukusuke Sushi © 2025 Todos los derechos reservados
        </Copyright>
      </Section>

      <Section>
        <ContactInfo>
          <p>Contáctanos:</p>
          <p>+569 1234 5678</p>
          <p>fukusuke@sushi.com</p>
        </ContactInfo>
      </Section>
    </FooterContainer>
  );
};

export default Footer;

// ---------- Estilos con styled-components ----------

const FooterContainer = styled.footer`
  background-color: #000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Emoji = styled.div`
  font-size: 2rem;
`;

const BrandName = styled.h4`
  margin: 0.5rem 0;
`;

const SocialIcons = styled.div`
  font-size: 1.5rem;
  display: flex;
  gap: 1rem;

  & > * {
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: red;
    }
  }
`;

const ContactInfo = styled.div`
  line-height: 1.5;
`;

const Copyright = styled.p`
  margin: 0;
`;
