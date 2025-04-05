import { useState } from 'react';
import styled from 'styled-components';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Contactform = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    mensaje: '',
    recibirNotificacion: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Sección izquierda - Formulario */}
        <LeftHalf>
          <FormTitle>Contáctanos</FormTitle>
                  <FormWrapper onSubmit={handleSubmit}>
          {/* Contenedor principal de campos */}
          <FormContent>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Apellido</Label>
              <Input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Teléfono</Label>
              <Input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Mensaje</Label>
              <TextArea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows={5}
              />
            </FormGroup>
          </FormContent>

          {/* Pie de formulario */}
          <FormFooter>
            <CheckboxGroup>
              <CheckboxInput
                type="checkbox"
                id="notificacion"
                name="recibirNotificacion"
                checked={formData.recibirNotificacion}
                onChange={(e) => setFormData({...formData, recibirNotificacion: e.target.checked})}
              />
              <CheckboxLabel htmlFor="notificacion">
                Recibir notificación cuando su consulta sea resuelta
              </CheckboxLabel>
            </CheckboxGroup>
            
            <SubmitButton type="submit">
              Enviar Mensaje
            </SubmitButton>
          </FormFooter>
        </FormWrapper>
        </LeftHalf>
        
        {/* Sección derecha - Redes Sociales */}
        <RightHalf>
          
          <SocialLinks>
            <SocialLink href="https://instagram.com/fukusukesushi" target="_blank">
              <SocialIcon><FaInstagram /></SocialIcon>
              <SocialText>@fukusukesushi</SocialText>
            </SocialLink>
            
            <SocialLink href="https://facebook.com/fukusukesushi" target="_blank">
              <SocialIcon><FaFacebook /></SocialIcon>
              <SocialText>/fukusukesushi</SocialText>
            </SocialLink>
            
            <SocialLink href="https://wa.me/1234567890" target="_blank">
              <SocialIcon><FaWhatsapp /></SocialIcon>
              <SocialText>+51 987 654 321</SocialText>
            </SocialLink>
          </SocialLinks>
          
        </RightHalf>
      </ContentWrapper>
    </PageContainer>
  );
};

// Estilos
const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: #ffffff;
`;

const FormTitle = styled.h1`
  color: #000000;
  text-align: left;
  margin-bottom: 1rem;  /* Reducido el margen inferior */
  font-size: 2.5rem;
  font-weight: 600;
  width: 100%;
  max-width: 700px;  /* Mismo ancho que el formulario */
  padding-left: 1rem; /* Alineación con el contenido del formulario */
`;

const ContentWrapper = styled.div`
  display: flex;
  height: calc(100vh - 10rem);
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftHalf = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
  }
`;

const RightHalf = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
  }
`;

const FormWrapper = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 2rem;
  background-color: #d32f2f;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 550px;
  
  @media (max-width: 768px) {
    min-height: 450px;
    padding: 1.5rem;
  }
`;

const FormContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-bottom: 1rem;
`;

const FormFooter = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* Línea divisoria opcional */
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  
  &:focus {
    outline: none;
    background-color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  background-color: rgba(255, 255, 255, 0.9);
  
  &:focus {
    outline: none;
    background-color: white;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
`;

const CheckboxInput = styled.input`
  margin-right: 0.8rem;
`;

const CheckboxLabel = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: white;
  color: #d32f2f;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  
  &:hover {
    background-color: #f5f5f5;
    transform: translateY(-2px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 500px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #333333;
  text-decoration: none;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const SocialIcon = styled.div`
  font-size: 6rem;
  color: #d32f2f;
`;

const SocialText = styled.span`
  font-size: 3rem;
`;

export default Contactform;