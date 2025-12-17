import { useEffect, useState } from "react";
import apiCall from "../../utils/axios";
import type { Favourite } from "../../types/favourite";
import FavouriteButton from "../../components/FavouriteButton";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../utils/helpers";
import { Heart, Trash2 } from "lucide-react";

const FavouritePage = () => {
    const [favourites, setFavourites] = useState<Favourite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavourites();
    }, []);

    const fetchFavourites = async () => {
        try {
            setLoading(true);
            const response = await apiCall.get('/favourites');
            if (response.data.data) {
                setFavourites(response.data.data);
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

    const handleRemoveFavourite = async (listingId: number) => {
        try {
            setFavourites(favourites.filter(f => f.listingId !== listingId));
        } catch (error) {
            console.error("Error removing favourite:", error);
            await fetchFavourites();
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

    return (
        <section className="favorites-page">
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>My Favourites</h3>
                    <div className="card bg-light border-info" style={{ width: "200px" }}>
                        <div className="card-body">
                            <div className="d-flex align-items-center gap-2">
                                <Heart size={24} className="text-danger" fill="red" />
                                <div>
                                    <p className="mb-0 text-muted small">Total Favourites</p>
                                    <h5 className="mb-0">{favourites.length}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {favourites.length === 0 ? (
                    <div className="alert alert-info text-center py-5">
                        <h5>No Favourites Yet</h5>
                        <p className="mb-3">You haven't added any listings to your favourites.</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary">
                            Browse Listings
                        </button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {favourites.map((listing) => {
                            const imageUrl = listing.featuredImageUrl || "https://dummyimage.com/300x200/000/fff";
                            const description = listing.description || "";
                            const truncatedDescription = description.length > 100
                                ? description.substring(0, 100) + "..."
                                : description;
                            return (
                                <div key={listing.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 position-relative shadow-sm">
                                        <div className="position-absolute top-0 end-0 p-2 z-3">
                                            <FavouriteButton 
                                                listingId={listing.id}
                                                onFavouriteChange={(isFav) => {
                                                    if (!isFav) {
                                                        handleRemoveFavourite(listing.id);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/listing/${listing.id}`)}
                                            className="btn btn-link text-decoration-none p-0"
                                        >
                                            <img 
                                                src={imageUrl} 
                                                className="card-img-top" 
                                                alt={listing.title} 
                                                style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                                            />
                                        </button>
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title mb-2">{listing.title}</h5>
                                            <p className="card-text text-muted small mb-2">{truncatedDescription}</p>
                                            <div className="mt-auto">
                                                <span className="text-success fw-bold d-block mb-2">
                                                    ₹{formatNumber(listing.price)}
                                                </span>
                                                <button 
                                                    onClick={() => navigate(`/listing/${listing.id}`)}
                                                    className="btn btn-outline-primary w-100 btn-sm"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
export default FavouritePage;