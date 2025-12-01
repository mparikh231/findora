import type { CityProps } from "../../types/Cities";

const Cities = (props: CityProps) => {
    const { stateId } = props;
    return <>
        <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title mb-0">Cities for State ID: {stateId}</h5>
        </div>
        <div className="offcanvas-body flex-fill">
            <form className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Enter city name" required />
                <button className="btn btn-secondary">Add City</button>
            </form>
            <table className="table mb-0">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Render city data here */}
                </tbody>
            </table>
        </div>
    </>;
}

export default Cities;