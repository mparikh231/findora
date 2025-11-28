import { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { Edit, Save, Trash } from "lucide-react";
import { formatDate } from "../../utils/helpers";
const StateCityManagementPage = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    return <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0">Categories</h3>
        </div>
        <div className="row">
            <form className="col-md-4 col-lg-3">
                <Card>
                    <CardHeader>Add New State</CardHeader>
                    <CardBody>
                        <div className="mb-3">
                            <label htmlFor="state_name" className="form-label">State Name:</label>
                            <input type="text" id="state_name" className="form-control" />
                        </div>
                    </CardBody>
                    <CardFooter>
                        <button className="btn btn-dark d-flex align-items-center gap-1" disabled={isLoading} type="submit">
                            <Save size={18} />{isLoading ? " Saving..." : " Save"}
                        </button>
                    </CardFooter>
                </Card>
            </form>

            <div className="col-md-8 col-lg-9">
                <div className="card overflow-hidden">
                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: '50px' }}>#</th>
                                    <th>Name</th>
                                    <th>Parent</th>
                                    <th>Description</th>
                                    <th style={{ width: '120px' }}>Create Date</th>
                                    <th style={{ width: '120px' }} className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={6} className="text-center">No Categories Found.</td>
                                </tr>
                                <tr>
                                    <td className="text-center">1</td>
                                    <td>Sample Category</td>
                                    <td>-</td>
                                    <td>Category Description</td>
                                    <td>{formatDate("2025-01-01")}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-link text-dark">
                                            <Edit size={16} />
                                        </button>
                                        <button className="btn btn-sm btn-link text-danger">
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default StateCityManagementPage;