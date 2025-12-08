import { Link } from "react-router-dom";
import type { Listing } from "../types/Listing";

const ListingCard = ({ listing }: { listing: Listing }) => {
    const imageUrl = listing.featuredImageUrl || "https://dummyimage.com/300x200/000/fff";
    const truncatedDescription = listing.description.length > 100 
        ? listing.description.substring(0, 100) + "..." 
        : listing.description;

    return (
        <div className="card mb-4 h-100">
            <Link to={`/listings/${listing.id}`}>
                <img src={imageUrl} className="card-img-top" alt={listing.title} style={{ height: "200px", objectFit: "cover" }} />
            </Link>
            <div className="card-body d-flex flex-column">
                <Link to={`/listings/${listing.id}`} className="text-decoration-none">
                    <h5 className="card-title mb-1">{listing.title}</h5>
                </Link>
                <p className="card-text mb-2 text-muted small">{truncatedDescription}</p>
                <div className="mt-auto">
                    <span className="text-success fw-bold d-block mb-2">${listing.price.toFixed(2)}</span>
                    {listing.city && listing.state && (
                        <small className="text-muted d-block mb-2">
                            📍 {listing.city.name}, {listing.state.name}
                        </small>
                    )}
                    <Link to={`/listings/${listing.id}`} className="btn btn-dark btn-sm w-100">View Details</Link>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;