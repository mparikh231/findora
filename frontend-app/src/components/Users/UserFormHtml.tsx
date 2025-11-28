import { useState } from "react";
import type { UserFormHtmlProps } from "../../types/Users";
import { Eye, EyeOff } from "lucide-react";

const UserFormHtml = (props: UserFormHtmlProps) => {
    const { userData, setUserData, action } = props;

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return(
        <>
            <div className="mb-3">
                <label htmlFor="user_name" className="form-label">Username*</label>
                <input type="text" className="form-control" id="user_name" placeholder="Enter username" required value={userData.user_name} onChange={(e) => setUserData({ ...userData, user_name: e.target.value })} disabled={action === 'edit'} readOnly={action === 'edit'} />
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email*</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" required value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password*</label>
                <div className="input-group">
                    <input type={showPassword ? "text" : "password"} className="form-control" id="password" placeholder="Enter password" required= {action === 'add'} value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                    <button className="btn btn-secondary" type="button" onClick={toggleShowPassword}>
                        {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input type="text" className="form-control" id="first_name" placeholder="Enter first name" value={userData.first_name} onChange={(e) => setUserData({ ...userData, first_name: e.target.value })} />
            </div>

            <div className="mb-3">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="last_name" placeholder="Enter last name" value={userData.last_name} onChange={(e) => setUserData({ ...userData, last_name: e.target.value })} />
            </div>

            <div className="mb-3">
                <label htmlFor="role" className="form-label">Role*</label>
                <select className="form-select" id="role" required value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value as "user" | "admin" })}>
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="status" className="form-label">Status*</label>
                <select className="form-select" id="status" required value={userData.status} onChange={(e) => setUserData({ ...userData, status: e.target.value as "active" | "inactive" })}>
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>
            </div>
        </>
    );
};

export default UserFormHtml;