import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext';

const Header = () => {
    const userContext = useContext(UserContext);
    const { user, logout } = userContext!;

    return (
        <header className="bg-white border-bottom py-2">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <Link to="/" className='text-decoration-none h5 mb-0 text-uppercase'>Findora</Link>
                    <div id="navbarNav">
                        <ul className='nav'>
                            <li className='nav-item'>
                                <Link to= '/' className='nav-link'>Home</Link>
                            </li>
                            {!user && (
                                <li className='nav-item'>
                                    <Link to= '/signin' className='nav-link'>Sign In</Link>
                                </li>
                            )}
                            {user && (
                                <>
                                    <li className='nav-item'>
                                        <Link to={user.role === 'admin' ? '/admin' : '/user'} className='nav-link'>Dashboard</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <button className='btn btn-secondary' onClick={logout}>Logout</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;