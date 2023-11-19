import { Wrapper } from "./components/Wrapper";
import { Greeting } from "./components/Greeting";
import GameCanvas from "./components/game";

const Home = () => {
  return (
    <main>
      <Wrapper>
        <Greeting />
        <GameCanvas />
      </Wrapper>
    </main>
  );
};

export default Home;
