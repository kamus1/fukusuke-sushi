import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styled from "styled-components";

const App = () => {
  return (
    <AppWrapper>
      <Navbar />
      <ContentWrapper>
        <AppRoutes />
      </ContentWrapper>
      <Footer />
    </AppWrapper>
  );
};

export default App;

// --------- Layout principal ----------
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex: 1;
`;
