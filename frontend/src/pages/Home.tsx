import logoFukusuke from '../assets/images/image.jpg';
import sushi1 from '../assets/images/sushi1.jpg';
import sushi2 from '../assets/images/sushi2.jpg'; 
import styled from "styled-components";


const Home = () => {
  return (
    <Container>
      <div className="container-fluid">

        <h1>Home</h1>
        <div className="row">

          <div className="col-2 bg-primary mt-2 d-flex justify-content-start " >
            A
          </div>


          <div className="col-8 bg-secondary mt-2 d-flex justify-content-center">
            
              
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1">
                <div className="card">
                <img src={logoFukusuke} alt="Logo de Fukusuke Sushi"/>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1">
                <div className="card">
                <img src={sushi1} alt="Logo de Fukusuke Sushi" />
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1">
                <div className="card">
                <img src={sushi2} alt="Logo de Fukusuke Sushi" />
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1">
                <div className="card">
                <img src={logoFukusuke} alt="Logo de Fukusuke Sushi"/>
                </div>
              </div>


          </div>


          <div className="col-2 bg-warning mt-2 d-flex justify-content-end">
            C
          </div>

        </div>


        <div className="row">
          <div></div>
      </div>

      </div>
    </Container>

  );
};

export default Home;


// styles
const Container = styled.div`

`;
