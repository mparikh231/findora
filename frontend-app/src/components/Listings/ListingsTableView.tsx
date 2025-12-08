import { IndianRupee, MapPin, Pencil, SquareArrowOutUpRight, Trash, User } from "lucide-react";
import { Link } from "react-router-dom";
import type { ListingsTableViewProps } from "../../types/Listing";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useState } from "react";
import { formatDate } from "../../utils/helpers";

const ListingsTableView = (props: ListingsTableViewProps) => {
    const { listings, isLoading = false, editListing, deleteListing, toggleAvailability } = props;
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

    const getListingStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="badge rounded-pill bg-success">Active</span>;
            case 'rejected':
                return <span className="badge rounded-pill bg-danger">Rejected</span>;
            case 'pending':
                return <span className="badge rounded-pill bg-warning">Pending</span>;
        }
    }

    return (
        <>
            <div className="card overflow-hidden">
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="text-center" style={{ width: '50px' }}>#</th>
                                <th>Details</th>
                                <th>Category</th>
                                <th>Available</th>
                                <th style={{ width: '120px' }}>Create Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading === true && (
                                <tr>
                                    <td colSpan={5} className="text-center">Loading listings...</td>
                                </tr>
                            )}

                            {isLoading !== true && (!listings || listings.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="text-center">No listings found.</td>
                                </tr>
                            )}

                            {isLoading !== true && listings && listings.length > 0 && listings.map((listing, index) => (
                                <tr key={`listingTableRow-${listing.id}`}>
                                    <td className="text-center align-middle">{index + 1}</td>
                                    <td className="align-middle">
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={listing.featuredImageUrl || "https://dummyimage.com/80x80/cccccc/666666&text=No+Image"}
                                                alt={listing.title}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                className="rounded"
                                            />
                                            <div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <h6 className="mb-0 d-block">{listing.title}</h6>
                                                    {getListingStatusBadge(listing.status)}
                                                </div>
                                                <div className="listing-meta-data d-flex align-items-center gap-1">
                                                    <MapPin size={14} />
                                                    <small>{listing.location}</small>
                                                    <small><b>City:</b> {listing.city?.name || 'N/A'}</small>
                                                    <small><b>State:</b> {listing.state?.name || 'N/A'}</small>
                                                </div>
                                                <div className="listing-meta-data d-flex align-items-center gap-1">
                                                    <User size={14} />
                                                    <small>{listing.user?.user_name || 'Unknown'} ({listing.user?.email || 'N/A'})</small>
                                                </div>
                                                <div className="listing-meta-data d-flex align-items-center gap-3">
                                                    <small><b><IndianRupee size={14} />{listing.price?.toLocaleString('en-IN')}</b></small>
                                                    <div className="listing-action d-flex align-items-center gap-2">
                                                        <button
                                                            onClick={() => editListing && editListing(listing.id)}
                                                            className="btn btn-link text-decoration-none small d-flex align-items-center gap-1 text-info p-0"
                                                        >
                                                            <Pencil size={14} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedListingId(listing.id);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="btn btn-link text-decoration-none small d-flex align-items-center gap-1 text-danger p-0"
                                                        >
                                                            <Trash size={14} /> Delete
                                                        </button>
                                                        <Link to={`/listings/${listing.id}`} className="text-decoration-none small d-flex align-items-center gap-1 text-primary" target="_blank">
                                                            <SquareArrowOutUpRight size={14} /> View
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="align-middle">{listing.category?.name || 'N/A'}</td>
                                    <td className="align-middle">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                checked={listing.isAvailable}
                                                onChange={() => toggleAvailability && toggleAvailability(listing.id, listing.isAvailable)}
                                            />
                                        </div>
                                    </td>
                                    <td className="align-middle">{listing.createdAt ? formatDate(listing.createdAt as string) : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} size="sm">
                <ModalHeader toggle={() => setIsModalOpen(false)}>Are you Sure?</ModalHeader>
                <ModalBody>
                    Do you really want to delete this listing? This process cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-secondary" onClick={() => { setIsModalOpen(false) }}>Cancel</button>
                    <button className="btn btn-danger" onClick={() => {
                        if (deleteListing) deleteListing(selectedListingId as number);
                        setIsModalOpen(false);
                    }}>Delete</button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default ListingsTableView;