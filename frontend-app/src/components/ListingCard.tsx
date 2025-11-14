import { Link } from 'react-router-dom';
import type { Listing } from '../types/Listing';
const ListingCard = ({ listing }: {listing: Listing}) => {
    return (<div className='card mb-4'>
        <Link to={`/listings/${listing.id}`}>
            <img src={listing.image} alt={listing.title} className="card-img-top" />
        </Link>
        <div className="card-body">
            <Link to={`/listings/${listing.id}`} className="text-decoration-none">
                <h5 className="card-title mb-1">{listing.title}</h5>
            </Link>
            <p className="card-text mb-1">{listing.description}</p>
            <span className="text-muted w-100 d-block"><b>Price:</b>${listing.price}</span>
            <Link to={`/listings/${listing.id}`} className="btn btn-primary mt-3">View Details</Link>
        </div>
    </div>
    );
};

export default ListingCard;
