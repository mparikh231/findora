import { useEffect, useState } from "react";
import apiCall from "../../utils/axios";
import type { Favourite } from "../../types/favourite";
import  FavouriteButton  from "../../components/FavouriteButton";
import { Link } from "lucide-react";
import { formatNumber } from "../../utils/helpers";

const FavouritePage = () => {
    const [favourites, setFavourites] = useState<Favourite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFavourites();
    }, []);
    const fetchFavourites = async () => {
            try {
                setLoading(true);
                const response = await apiCall.get('/favourites');
                if (response.data.status && response.data.favourites) {
                    setFavourites(response.data.favourites);
                } else {
                    setFavourites([]);
                }
            } catch (error: any) {
                console.error("Error fetching favourites:", error);
                setError("Failed to load favourites");
            } finally {
                setLoading(false);
            }
        };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (favourites.length === 0) {
        return (
            <div className="container py-5">
                <h4 className="text-center">You have no favourites yet.</h4>
                <div className="text-center mt-3">
                    <Link to="/" className="btn btn-primary">Browse Listings</Link>
                </div>
            </div>
        );
    }

    return (
        <section className="favorites-page">
            <div className="container py-5">
                <h3 className="mb-4">My Favourites</h3>
                <div className="row g-4">
                    {favourites.map((listing) => {
                        const imageUrl = listing.featuredImageUrl || "https://dummyimage.com/300x200/000/fff";
                        const truncatedDescription = listing.description.length > 100
                            ? listing.description.substring(0, 100) + "..."
                            : listing.description;
                        return (
                            <div key={listing.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 position-relative">
                                    <div className="position-absolute top-0 end-0 p-2 z-3">
                                        <FavouriteButton listingId={listing.id} onToggle={() => fetchFavourites()} />
                                    </div>
                                    <Link to={`/listing/${listing.id}`} className="text-decoration-none text-dark">
                                    <img src={imageUrl} className="card-img-top" alt={listing.title} style={{ height: "200px", objectFit: "cover"}} />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title mb-1">{listing.title}</h5>
                                        <p className="card-text text-muted small mb-2">{truncatedDescription}</p>
                                        <span className="text-success fw-bold mb-2">₹{formatNumber(listing.price)}</span>
                                        <Link
                                            to={`/listing/${listing.id}`}
                                            className="btn btn-outline-primary mt-auto"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
export default FavouritePage;