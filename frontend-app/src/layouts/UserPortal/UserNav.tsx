import { CircleGauge, CircleStar, CircleUser, HeartPlus, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import SignOutModal from "../../components/SignOutModal";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../src/context/UserContext";
import * as favService from "../../utils/favourite.service";

const UserNav = () => {
    const userContext = useContext(UserContext);
    const { user } = userContext || {};
    const [isSignOutModalOpen, setSignOutModalOpen] = useState<boolean>(false);
    const [favoriteCount, setFavoriteCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    // Fetch favorite count on component mount
    useEffect(() => {
        fetchFavoriteCount();
    }, []);

    const fetchFavoriteCount = async () => {
        try {
            const res = await favService.getFavouriteCount();
            setFavoriteCount(res.count || 0);
        } catch (error) {
            console.error("Error fetching favorite count:", error);
            setFavoriteCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Listen for favorite changes
    const handleFavoriteChange = (count: number) => {
        setFavoriteCount(count);
    };

    return <div className="card h-100">
        <ul className="list-group list-group-flush">
            <li className="list-group-item">
                <div className="d-flex gap-2 align-items-center">
                    <CircleUser size={30} />
                    <small>
                        <h6 className="mb-0">{user?.first_name} {user?.last_name}</h6>
                        {user?.email && (
                            <a className="text-decoration-none  text-muted" href={`mailto:${user.email}`}>{user.email}</a>
                        )}
                    </small>
                </div>
            </li>
            <li className="list-group-item">
                <Link to="/user" className="text-decoration-none d-flex align-items-center gap-2">
                    <CircleGauge size={18} />
                    Dashboard
                </Link>
            </li>
            <li className="list-group-item position-relative">
                <Link to="/user/favourites" className="text-decoration-none d-flex align-items-center gap-2">
                    <HeartPlus size={18} />
                    Favourites
                    {favoriteCount > 0 && (
                        <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger">
                            {favoriteCount}
                        </span>
                    )}
                </Link>
            </li>
            <li className="list-group-item">
                <Link to="/user/listings" className="text-decoration-none d-flex align-items-center gap-2">
                    <CircleStar size={18} />
                    My Listings
                </Link>
            </li>
            <li className="list-group-item">
                <Link to="/user/profile" className="text-decoration-none d-flex align-items-center gap-2">
                    <User size={18} />
                    Profile
                </Link>
            </li>
            <li className="list-group-item">
                <a 
                    className="text-decoration-none d-flex align-items-center gap-2" 
                    onClick={(e) => { e.preventDefault(); setSignOutModalOpen(true); }} 
                    href="#"
                >
                    <LogOut size={18} />
                    Sign Out
                </a>
            </li>
            <li className="list-group-item"></li>
        </ul>
        <SignOutModal isOpen={isSignOutModalOpen} onModalChange={setSignOutModalOpen} />
    </div>;
}
export default UserNav;