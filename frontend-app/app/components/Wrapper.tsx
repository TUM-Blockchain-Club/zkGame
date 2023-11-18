import { ReactNode } from "react";

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div  className="max-w-6xl mx-auto px-4 bg-[url('/img/hero-pattern.svg')]">{children}</div>
);

export { Wrapper };
