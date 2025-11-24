import { ChevronDown, CircleGauge, CircleStar, MapPin, Settings2, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {

    const [isListingsOpen, setIsListingsOpen] = useState<boolean>(false);
    const [isUsersOpen, setIsUsersOpen] = useState<boolean>(false);
    const ListingsToggle = () => setIsListingsOpen(!isListingsOpen);
    const UsersToggle = () => setIsUsersOpen(!isUsersOpen);

    return (
        <div className="nav">
            <Link to="/admin" className="nav-link">
                <div className="sb-nav-link-icon"><CircleGauge size={18} /></div>
                Dashboard
            </Link>

            <a className={`nav-link ${isListingsOpen ? '' : 'collapsed'}`} href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded={isListingsOpen} aria-controls="collapseLayouts" onClick={(e) => { e.preventDefault(); ListingsToggle(); }}>
                <div className="sb-nav-link-icon"><CircleStar size={18} /></div>
                Listings
                <div className="sb-sidenav-collapse-arrow"><ChevronDown /></div>
            </a>
            <div className={`collapse ${isListingsOpen ? 'show' : ''}`} id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                    <Link to="/admin/listings" className="nav-link">View All</Link>
                    <Link to="/admin/listings/add-new" className="nav-link">Add New</Link>
                    <Link to="/admin/listings/categories" className="nav-link">Categories</Link>
                </nav>
            </div>

            <Link to="/admin/states" className="nav-link">
                <div className="sb-nav-link-icon"><MapPin size={18} /></div>
                States
            </Link>

            <a className={`nav-link ${isUsersOpen ? '' : 'collapsed'}`} href="#" data-bs-toggle="collapse" data-bs-target="#collapseUsers" aria-expanded={isUsersOpen} aria-controls="collapseUsers" onClick={(e) => { e.preventDefault(); UsersToggle(); }}>
                <div className="sb-nav-link-icon"><Users size={18} /></div>
                Users
                <div className="sb-sidenav-collapse-arrow"><ChevronDown /></div>
            </a>
            <div className={`collapse ${isUsersOpen ? 'show' : ''}`} id="collapseUsers" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                    <Link to="/admin/users" className="nav-link">View All</Link>
                    <Link to="/admin/users/add-new" className="nav-link">Add New</Link>
                    <Link to="/admin/profile" className="nav-link">Profile</Link>
                </nav>
            </div>

            <Link to="/admin/settings" className="nav-link">
                <div className="sb-nav-link-icon"><Settings2 size={18} /></div>
                Settings
            </Link>

        </div>
    );
};
export default AdminNav;