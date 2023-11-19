import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wrapper } from "./Wrapper";

const Header = () => {
  return (
    <header className="py-4 border-b mb-10">
      <Wrapper>
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold  font-minecraft tracking-widest text-green-500">
            Pepe's Party Computation
          </h1>
          <ConnectButton
            showBalance={false}
            accountStatus="address"
            label="Connect"
          />
        </div>
      </Wrapper>
    </header>
  );
};

export { Header };
