import styled from "styled-components";

const About = () => {
    return (
      <Container>
        <h1>Acerca de</h1>
        <p>Información sobre la aplicación.</p>
      </Container>
    );
  };
  
export default About;



// styles
const Container = styled.div`
  margin-top: 10px;

  h1{
    color: red;
  }

`;
