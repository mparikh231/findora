import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const AdminLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userDataLs = localStorage.getItem("userData");
        const token = localStorage.getItem("token");
        if(!userDataLs || !token) {
            toast.error("You must be signed in to access this page.");
            navigate("/signin");
            return;
        }
        const userData: any = JSON.parse(userDataLs || '{}');
        if (!userData.role || userData.role !== 'admin') {
            toast.error("You do not have permission to access this page.");
            navigate("/signin");
            return;
        }
    }, []);

    return (
        <main className='main d-flex flex-column vh-100'>
            <Header />
            <section className='flex-fill'>
                <Outlet />
            </section>
            <Footer />
        </main>
    );
};

export default AdminLayout;
