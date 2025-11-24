const UserFormHtml = () => {
    return(
        <>
            <div className="mb-3">
                <label htmlFor="user_name" className="form-label">Username*</label>
                <input type="text" className="form-control" id="user_name" placeholder="Enter username" required />
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email*</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" required />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password*</label>
                <input type="password" className="form-control" id="password" placeholder="Enter password" required />
            </div>

            <div className="mb-3">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input type="text" className="form-control" id="first_name" placeholder="Enter first name" />
            </div>

            <div className="mb-3">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="last_name" placeholder="Enter last name" />
            </div>

            <div className="mb-3">
                <label htmlFor="role" className="form-label">Role*</label>
                <select className="form-select" id="role" required>
                    <option value="">Select Role</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="status" className="form-label">Status*</label>
                <select className="form-select" id="status" required>
                    <option value="">Select Status</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
            </div>
        </>
    );
};

export default UserFormHtml;