import { Wrapper } from "./components/Wrapper";
import { Greeting } from "./components/Greeting";
import CanvasComponent from './components/canvasComponent'; 

const Home = () => {
  const backgroundStyle = {
    backgroundImage: '../public/background.png', // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh', // Ensure it covers the whole viewport height
  };

  return (
    <main>
      <Wrapper>
      {/* <Greeting /> */}
        <CanvasComponent />
      </Wrapper>
    </main>
  );
};

export default Home;
