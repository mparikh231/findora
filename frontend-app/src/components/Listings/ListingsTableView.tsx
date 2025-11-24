import { IndianRupee, MapPin, Pencil, SquareArrowOutUpRight, Trash, User } from "lucide-react";
import { Link } from "react-router-dom";

const ListingsTableView = () => {

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
                            <tr>
                                <td className="text-center align-middle">1</td>
                                <td className="align-middle">
                                    <div className="d-flex align-items-center gap-2">
                                        <Link to={`/admin/listings/edit/1`}><img src="https://dummyimage.com/80x80/000/fff" alt="Listing" style={{ width: '80px', height: '80px', objectFit: 'cover' }} className="rounded" /></Link>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Link to={`/admin/listings/edit/1`} className="h6 mb-0 d-block text-decoration-none">iPhone 12 Pro Max</Link>
                                                {getListingStatusBadge('active')}
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <MapPin size={14} />
                                                <small>San Francisco, CA</small>
                                                <small><b>City:</b> San Francisco</small>
                                                <small><b>State:</b> CA</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <User size={14} />
                                                <small>User Name (test@test.com)</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-3">
                                                <small><b><IndianRupee size={14} />1,25,000.00</b></small>
                                                <div className="listing-action d-flex align-items-center gap-2">
                                                    <Link to={`/admin/listings/edit/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-info">
                                                        <Pencil size={14} /> Edit
                                                    </Link>
                                                    <Link to={`/admin/listings/delete/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-danger">
                                                        <Trash size={14} /> Delete
                                                    </Link>
                                                    <Link to={`/listings/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-primary">
                                                        <SquareArrowOutUpRight size={14} /> View
                                                    </Link>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </td>
                                <td className="align-middle">Electronics</td>
                                <td className="align-middle">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                    </div>
                                </td>
                                <td className="align-middle">25-Sep-2025</td>
                            </tr>

                            <tr>
                                <td className="text-center align-middle">2</td>
                                <td className="align-middle">
                                    <div className="d-flex align-items-center gap-2">
                                        <Link to={`/admin/listings/edit/1`}><img src="https://dummyimage.com/80x80/000/fff" alt="Listing" style={{ width: '80px', height: '80px', objectFit: 'cover' }} className="rounded" /></Link>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Link to={`/admin/listings/edit/1`} className="h6 mb-0 d-block text-decoration-none">iPhone 12 Pro Max</Link>
                                                {getListingStatusBadge('pending')}
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <MapPin size={14} />
                                                <small>San Francisco, CA</small>
                                                <small><b>City:</b> San Francisco</small>
                                                <small><b>State:</b> CA</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <User size={14} />
                                                <small>User Name (test@test.com)</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-3">
                                                <small><b><IndianRupee size={14} />1,25,000.00</b></small>
                                                <div className="listing-action d-flex align-items-center gap-2">
                                                    <Link to={`/admin/listings/edit/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-info">
                                                        <Pencil size={14} /> Edit
                                                    </Link>
                                                    <Link to={`/admin/listings/delete/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-danger">
                                                        <Trash size={14} /> Delete
                                                    </Link>
                                                    <Link to={`/listings/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-primary">
                                                        <SquareArrowOutUpRight size={14} /> View
                                                    </Link>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </td>
                                <td className="align-middle">Electronics</td>
                                <td className="align-middle">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                    </div>
                                </td>
                                <td className="align-middle">25-Sep-2025</td>
                            </tr>

                            <tr>
                                <td className="text-center align-middle">3</td>
                                <td className="align-middle">
                                    <div className="d-flex align-items-center gap-2">
                                        <Link to={`/admin/listings/edit/1`}><img src="https://dummyimage.com/80x80/000/fff" alt="Listing" style={{ width: '80px', height: '80px', objectFit: 'cover' }} className="rounded" /></Link>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Link to={`/admin/listings/edit/1`} className="h6 mb-0 d-block text-decoration-none">iPhone 12 Pro Max</Link>
                                                {getListingStatusBadge('rejected')}
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <MapPin size={14} />
                                                <small>San Francisco, CA</small>
                                                <small><b>City:</b> San Francisco</small>
                                                <small><b>State:</b> CA</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <User size={14} />
                                                <small>User Name (test@test.com)</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-3">
                                                <small><b><IndianRupee size={14} />1,25,000.00</b></small>
                                                <div className="listing-action d-flex align-items-center gap-2">
                                                    <Link to={`/admin/listings/edit/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-info">
                                                        <Pencil size={14} /> Edit
                                                    </Link>
                                                    <Link to={`/admin/listings/delete/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-danger">
                                                        <Trash size={14} /> Delete
                                                    </Link>
                                                    <Link to={`/listings/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-primary">
                                                        <SquareArrowOutUpRight size={14} /> View
                                                    </Link>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </td>
                                <td className="align-middle">Electronics</td>
                                <td className="align-middle">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                    </div>
                                </td>
                                <td className="align-middle">25-Sep-2025</td>
                            </tr>

                            <tr>
                                <td className="text-center align-middle">4</td>
                                <td className="align-middle">
                                    <div className="d-flex align-items-center gap-2">
                                        <Link to={`/admin/listings/edit/1`}><img src="https://dummyimage.com/80x80/000/fff" alt="Listing" style={{ width: '80px', height: '80px', objectFit: 'cover' }} className="rounded" /></Link>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Link to={`/admin/listings/edit/1`} className="h6 mb-0 d-block text-decoration-none">iPhone 12 Pro Max</Link>
                                                {getListingStatusBadge('active')}
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <MapPin size={14} />
                                                <small>San Francisco, CA</small>
                                                <small><b>City:</b> San Francisco</small>
                                                <small><b>State:</b> CA</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <User size={14} />
                                                <small>User Name (test@test.com)</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-3">
                                                <small><b><IndianRupee size={14} />1,25,000.00</b></small>
                                                <div className="listing-action d-flex align-items-center gap-2">
                                                    <Link to={`/admin/listings/edit/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-info">
                                                        <Pencil size={14} /> Edit
                                                    </Link>
                                                    <Link to={`/admin/listings/delete/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-danger">
                                                        <Trash size={14} /> Delete
                                                    </Link>
                                                    <Link to={`/listings/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-primary">
                                                        <SquareArrowOutUpRight size={14} /> View
                                                    </Link>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </td>
                                <td className="align-middle">Electronics</td>
                                <td className="align-middle">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                    </div>
                                </td>
                                <td className="align-middle">25-Sep-2025</td>
                            </tr>

                            <tr>
                                <td className="text-center align-middle">5</td>
                                <td className="align-middle">
                                    <div className="d-flex align-items-center gap-2">
                                        <Link to={`/admin/listings/edit/1`}><img src="https://dummyimage.com/80x80/000/fff" alt="Listing" style={{ width: '80px', height: '80px', objectFit: 'cover' }} className="rounded" /></Link>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Link to={`/admin/listings/edit/1`} className="h6 mb-0 d-block text-decoration-none">iPhone 12 Pro Max</Link>
                                                {getListingStatusBadge('active')}
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <MapPin size={14} />
                                                <small>San Francisco, CA</small>
                                                <small><b>City:</b> San Francisco</small>
                                                <small><b>State:</b> CA</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-1">
                                                <User size={14} />
                                                <small>User Name (test@test.com)</small>
                                            </div>
                                            <div className="listing-meta-data d-flex align-items-center gap-3">
                                                <small><b><IndianRupee size={14} />1,25,000.00</b></small>
                                                <div className="listing-action d-flex align-items-center gap-2">
                                                    <Link to={`/admin/listings/edit/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-info">
                                                        <Pencil size={14} /> Edit
                                                    </Link>
                                                    <Link to={`/admin/listings/delete/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-danger">
                                                        <Trash size={14} /> Delete
                                                    </Link>
                                                    <Link to={`/listings/1`} className="text-decoration-none small d-flex align-items-center gap-1 text-primary">
                                                        <SquareArrowOutUpRight size={14} /> View
                                                    </Link>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </td>
                                <td className="align-middle">Electronics</td>
                                <td className="align-middle">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                    </div>
                                </td>
                                <td className="align-middle">25-Sep-2025</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ListingsTableView;