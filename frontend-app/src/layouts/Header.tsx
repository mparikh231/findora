import { useContext, useEffect, useState } from "react";
import  apiCall  from "../utils/axios"
import { Link } from "react-router-dom";
import { UserContext } from "../../src/context/UserContext";
import { CircleUser } from "lucide-react";
import SignOutModel from "../components/SignOutModal";
import CityDropdown from "../components/Cities/CityDropdown";
import NavigationMenuItem  from "../components/NavigationMenuItem";
import type { NavigationMenuItem as NavigationMenuItemType, OptionData } from "../types/NavigationMenu";

const Header = () => {
    const userContext = useContext(UserContext);
    const { user } = userContext!;

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
    const [menuItems, setMenuItems] = useState<NavigationMenuItemType[]>([]);
    const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
    const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

    useEffect(() => {
        setIsUserDropdownOpen(false);
    }, [isLogoutModalOpen]);

    useEffect(() => {
        loadNavigationMenu();
    }, []);

    const loadNavigationMenu = async () => {
        try {
            setIsLoadingMenu(true);
            const response = await apiCall.get('/options/navigation_menu');
            const { status, data } = response.data;
            
            if (status) {
                const optionData = data as OptionData;
                if (optionData.optionValue) {
                    try {
                        const parsedData = JSON.parse(optionData.optionValue);
                        setMenuItems(parsedData.items || []);
                    } catch (error) {
                        console.error('Error parsing navigation menu:', error);
                        setMenuItems([]);
                    }
                } else {
                    setMenuItems([]);
                }
            }
        } catch (error) {
            console.error('Error loading navigation menu:', error);
            setMenuItems([]);
        } finally {
            setIsLoadingMenu(false);
        }
    };

    return (
        <>
            <header className="bg-white border-bottom py-2">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <Link to="/" className="text-decoration-none h5 mb-0 text-uppercase">Findora</Link>
                            <CityDropdown />
                        </div>
                        <div id="navbarNav">
                            <ul className="nav">
                                {!isLoadingMenu && menuItems.map((item) => (
                                    <NavigationMenuItem key={item.id} item={item} />
                                ))}
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">Home</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a
                                        className={`nav-link pe-0 d-flex align-items-center gap-1${isUserDropdownOpen ? " show" : ""}`}
                                        data-bs-toggle="dropdown"
                                        href="#"
                                        role="button"
                                        aria-expanded={isUserDropdownOpen}
                                        onClick={(e) => { e.preventDefault(); toggleUserDropdown(); }}>
                                        <span>Hello, {user ? user.first_name || user.user_name || "User" : "Guest"}</span> <CircleUser />
                                    </a>
                                    <ul className={`dropdown-menu dropdown-menu-end${isUserDropdownOpen ? " show" : ""}`} data-bs-popper="static">
                                        {!user && (
                                            <>
                                                <li><Link className="dropdown-item" to="/signin" onClick={() => setIsUserDropdownOpen(false)}>Sign In</Link></li>
                                                <li><Link className="dropdown-item" to="/signup" onClick={() => setIsUserDropdownOpen(false)}>Sign Up</Link></li>
                                            </>
                                        )}
                                        {user && (
                                            <>
                                                <li>
                                                    <Link
                                                        className="dropdown-item" to={user.role === "admin" ? "/admin" : "/user"}
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        to={user.role === "admin" ? "/admin/profile" : "/user/profile"} onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        Profile
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => setIsLogoutModalOpen(true)}>Sign Out</button>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            <SignOutModel isOpen={isLogoutModalOpen} onModalChange={(isOpen) => setIsLogoutModalOpen(isOpen)} />
        </>
    );
};

export default Header;