import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import apiCall from "../utils/axios";
import type { Listing } from "../types/Listing";
import Banner from "../layouts/Banner";
import { formatDate, formatNumber } from "../utils/helpers";
import { UserContext } from "../context/UserContext";
import { MapIcon } from "lucide-react";

const ListingDetailsPage = () => {
    const { id: listingId } = useParams();
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const { user } = userContext || {};

    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>("");

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await apiCall.get(`/listings/${listingId}`);
                if (response.data.status && response.data.listingData) {
                    const listingData = response.data.listingData;
                    setListing(listingData);
                    setSelectedImage(listingData.featuredImageUrl || "https://dummyimage.com/600x400/000/fff");
                } else {
                    setError("Listing not found");
                }
            } catch (error: any) {
                console.error("Error fetching listing:", error);
                setError(error.response?.data?.message || "Failed to fetch listing details");
            } finally {
                setIsLoading(false);
            }
        };

        if (listingId) {
            fetchListing();
        }
    }, [listingId]);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-success';
            case 'pending':
                return 'bg-warning text-dark';
            case 'rejected':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    if (isLoading) {
        return (
            <section className="listing-details-page">
                <div className="container py-5">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !listing) {
        return (
            <section className="listing-details-page">
                <Banner title="Listing Not Found" size="small" />
                <div className="container py-5">
                    <div className="alert alert-danger" role="alert">
                        <h5 className="alert-heading">Error!</h5>
                        <p className="mb-0">{error || "The listing you're looking for doesn't exist."}</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="btn btn-dark">Go Back</button>
                </div>
            </section>
        );
    }

    const allImages = [
        listing.featuredImageUrl || "https://dummyimage.com/600x400/000/fff",
        ...(listing.imageUrls || [])
    ].filter(Boolean);

    return (
        <section className="listing-details-page">
            <Banner title={listing.title} size="small" />

            <div className="container my-5">
                <div className="row">
                    {/* Left Column - Images and Description */}
                    <div className="col-lg-8">
                        {/* Main Image Display */}
                        <div className="card mb-4">
                            <img
                                src={selectedImage}
                                className="card-img-top"
                                alt={listing.title}
                                style={{ height: "500px", objectFit: "cover" }}
                            />
                        </div>

                        {/* Image Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="row mb-4">
                                {allImages.map((imageUrl, index) => (
                                    <div key={`thumbnail-${index}`} className="col-3">
                                        <img
                                            src={imageUrl}
                                            className={`img-thumbnail cursor-pointer ${selectedImage === imageUrl ? 'border-primary border-3' : ''}`}
                                            alt={`${listing.title} - Image ${index + 1}`}
                                            onClick={() => handleImageClick(imageUrl)}
                                            style={{ cursor: "pointer", height: "100px", objectFit: "cover", width: "100%" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="mb-0">Description</h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>{listing.description}</p>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Additional Information</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <strong>Location:</strong>
                                        <p className="mb-0">{listing.location}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>Category:</strong>
                                        <p className="mb-0">
                                            {listing.category ? (
                                                <Link to={`/category/${listing.category.id}`} className="text-decoration-none">
                                                    {listing.category.name}
                                                </Link>
                                            ) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>City:</strong>
                                        <p className="mb-0">{listing.city?.name || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>State:</strong>
                                        <p className="mb-0">{listing.state?.name || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>Posted On:</strong>
                                        <p className="mb-0">{formatDate(listing.createdAt.toString())}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>Last Updated:</strong>
                                        <p className="mb-0">{formatDate(listing.updatedAt.toString())}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Price, Status, Seller Info */}
                    <div className="col-lg-4">
                        {/* Price Card */}
                        <div className="card mb-4 sticky-top" style={{ top: "20px" }}>
                            <div className="card-body">
                                <h3 className="text-success mb-3">₹{formatNumber(listing.price)}</h3>

                                <div className="mb-3">
                                    <span className="me-2">
                                        <strong>Availability:</strong>
                                    </span>
                                    <span className={`badge ${listing.isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                                        {listing.isAvailable ? 'Available' : 'Not Available'}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <span className="me-2">
                                        <strong>Status:</strong>
                                    </span>
                                    <span className={`badge ${getStatusBadgeClass(listing.status)}`}>
                                        {listing?.status ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1) : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Seller Information Card */}
                        {listing.user && (
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h6 className="mb-0">Seller Information</h6>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                            style={{ width: "50px", height: "50px", fontSize: "1.25rem" }}>
                                            {listing.user?.first_name?.charAt(0)?.toUpperCase() || listing.user?.user_name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <div className="ms-3">
                                            <h6 className="mb-0">{listing.user.first_name && listing.user.last_name
                                                ? `${listing.user.first_name} ${listing.user.last_name}`
                                                : listing.user.user_name}
                                            </h6>
                                            <small className="text-muted">@{listing.user.user_name}</small>
                                        </div>
                                    </div>

                                    {user && user.user_id === listing.user.id && (
                                        <div className="alert alert-info py-2 px-3 mt-3" role="alert">
                                            <small>This is your listing</small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Location Card */}
                        <div className="card">
                            <div className="card-header">
                                <h6 className="mb-0">Location</h6>
                            </div>
                            <div className="card-body">
                                <p className="mb-2">
                                    <MapIcon className="me-2 text-danger" size={16} />
                                    <strong>{listing.city?.name || 'N/A'}</strong>
                                </p>
                                <p className="mb-0 text-muted small">
                                    {listing.state?.name || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="row mt-4">
                    <div className="col-12">
                        <button onClick={() => navigate(-1)} className="btn btn-outline-dark">
                            <i className="bi bi-arrow-left me-2"></i>Go Back
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ListingDetailsPage;