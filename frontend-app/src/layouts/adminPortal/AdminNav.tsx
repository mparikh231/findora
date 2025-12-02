import { ChevronDown, CircleGauge, CircleStar, MapPin, Settings2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNav = () => {

    const location = useLocation();
    const [isListingsOpen, setIsListingsOpen] = useState<boolean>(false);
    const [isUsersOpen, setIsUsersOpen] = useState<boolean>(false);
    const ListingsToggle = () => setIsListingsOpen(!isListingsOpen);
    const UsersToggle = () => setIsUsersOpen(!isUsersOpen);
    const [currentNavItem, setCurrentNavItem] = useState<string | null>(null);

    useEffect(() => {
        setIsUsersOpen(false);
        setIsListingsOpen(false);
        const path = location.pathname;
        switch (path) {
            case "/admin":
                setCurrentNavItem("dashboard");
                break;

            case "/admin/states":
                setCurrentNavItem("states");
                break;

            case "/admin/settings":
                setCurrentNavItem("settings");
                break;

            case "/admin/listings":
                setIsListingsOpen(true);
                setCurrentNavItem("listings-view-all");
                break;

            case "/admin/listings/add":
                setIsListingsOpen(true);
                setCurrentNavItem("listings-add");
                break;

            case "/admin/listings/categories":
                setIsListingsOpen(true);
                setCurrentNavItem("listings-categories");
                break;

            case "/admin/users":
                setIsUsersOpen(true);
                setCurrentNavItem("users-view-all");
                break;

            case "/admin/users/add":
                setIsUsersOpen(true);
                setCurrentNavItem("users-add-new");
                break;

            case "/admin/profile":
                setIsUsersOpen(true);
                setCurrentNavItem("users-profile");
                break;

            default:
                setCurrentNavItem(null);
                break;
        }
    }, [location]);

    return (
        <div className="nav">
            <Link to="/admin" className={`nav-link ${currentNavItem === "dashboard" ? "active" : ""}`}>
                <div className="sb-nav-link-icon"><CircleGauge size={18} /></div>
                Dashboard
            </Link>

            <a
                href="#"
                onClick={(e) => { e.preventDefault(); ListingsToggle(); }}
                data-bs-toggle="collapse"
                data-bs-target="#collapseLayouts"
                aria-controls="collapseLayouts"
                aria-expanded={isListingsOpen}
                className={`nav-link ${isListingsOpen ? '' : 'collapsed'}`}
            >
                <div className={`sb-nav-link-icon ${currentNavItem && currentNavItem.startsWith("listings") ? "active" : ""}`}><CircleStar size={18} /></div>
                Listings
                <div className="sb-sidenav-collapse-arrow"><ChevronDown /></div>
            </a>
            <div className={`collapse ${isListingsOpen ? 'show' : ''}`} id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                    <Link to="/admin/listings" className={`nav-link ${currentNavItem === "listings-view-all" ? "active" : ""}`}>View All</Link>
                    <Link to="/admin/listings/add" className={`nav-link ${currentNavItem === "listings-add" ? "active" : ""}`}>Add New</Link>
                    <Link to="/admin/listings/categories" className={`nav-link ${currentNavItem === "listings-categories" ? "active" : ""}`}>Categories</Link>
                </nav>
            </div>

            <Link
                to="/admin/states"
                className={`nav-link ${currentNavItem === "states" ? "active" : ""}`}
            >
                <div className="sb-nav-link-icon"><MapPin size={18} /></div>
                States
            </Link>

            <a
                href="#"
                data-bs-toggle="collapse"
                data-bs-target="#collapseUsers"
                className={`nav-link ${isUsersOpen ? '' : 'collapsed'}`}
                aria-expanded={isUsersOpen} aria-controls="collapseUsers"
                onClick={(e) => { e.preventDefault(); UsersToggle(); }}
            >
                <div className={`sb-nav-link-icon ${currentNavItem && currentNavItem.startsWith("/admin/users") ? "active" : ""}`}><Users size={18} /></div>
                Users
                <div className="sb-sidenav-collapse-arrow"><ChevronDown /></div>
            </a>
            <div className={`collapse ${isUsersOpen ? 'show' : ''}`} id="collapseUsers" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                    <Link to="/admin/users" className={`nav-link ${currentNavItem === "users-view-all" ? "active" : ""}`}>View All</Link>
                    <Link to="/admin/users/add" className={`nav-link ${currentNavItem === "users-add-new" ? "active" : ""}`}>Add New</Link>
                    <Link to="/admin/profile" className={`nav-link ${currentNavItem === "users-profile" ? "active" : ""}`}>Profile</Link>
                </nav>
            </div>

            <Link to="/admin/settings" className={`nav-link ${currentNavItem === "settings" ? "active" : ""}`}>
                <div className="sb-nav-link-icon"><Settings2 size={18} /></div>
                Settings
            </Link>

        </div>
    );
};
export default AdminNav;