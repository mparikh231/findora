import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
    return (
        <main className="main d-flex flex-column vh-100">
            <Header />
            <section className="flex-fill">
                <Outlet />
            </section>
            <Footer />
        </main>
    );
};

export default Layout;
