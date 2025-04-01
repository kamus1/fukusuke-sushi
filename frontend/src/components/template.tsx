import styled from "styled-components";

const ComponentName = () => {
    return (
      <Container>
        <h1>Titulo</h1>
        <p className="texto">Información sobre la page</p>
      </Container>
    );
  };
  
export default ComponentName;


// se usa un componente de styles components general, y luego se modifica por clases
// recomendado tener instalado extension: vscode-styled-components o alguna similar
// se puede usar classNames individuales y modificar su css dentro del div de Container o tambíen se puede crear componentes individuales
// styles
const Container = styled.div`
  margin-top: 20px;
  h1{
    color: red;
  }

  p{
    color:blue;
  }

  .texto{
    font-size: 40px;
  }

`;
