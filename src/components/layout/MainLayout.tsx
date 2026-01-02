import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import EducareAI from "../EducareAI";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const MainLayout = ({ children, showFooter = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      {showFooter && <Footer />}
      <EducareAI />
    </div>
  );
};

export default MainLayout;
