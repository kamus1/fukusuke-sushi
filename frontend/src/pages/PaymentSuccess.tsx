import styled from "styled-components";

const PaymentSuccess = () => {
    return (
      <Container>
        <h1>Pago realizado correctamente</h1>
        <p className="texto">Gracias por comprar en fukusuke Sushi</p>
      </Container>
    );
  };
  
export default PaymentSuccess;


const Container = styled.div`
  margin-top: 20px;
  h1{
    color: #42e529;
  }

  p{
    color:blue;
  }

  .texto{
    font-size: 40px;
  }

`;
