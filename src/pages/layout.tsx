// components/Layout.tsx
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="relative overflow-hidden" >
            <main className="relative z-10" > {children} </main>
        </div>
    );
};

export default Layout;
