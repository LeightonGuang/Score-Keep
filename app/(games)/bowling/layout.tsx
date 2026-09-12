import { BowlingProvider } from "./context/BowlingContext";

interface BowlingLayoutProps {
  children: React.ReactNode;
}

const BowlingLayout = ({
  children,
}: BowlingLayoutProps) => {
  return (
    <BowlingProvider>
      {children}
    </BowlingProvider>
  );
};

export default BowlingLayout;
