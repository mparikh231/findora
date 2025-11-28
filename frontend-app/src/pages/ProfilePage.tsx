import { Eye, EyeOff, Save } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { checkEmailFormat } from "../utils/helpers";
import { toast } from "react-toastify";
import type { userData, UserProfileFormData } from "../types/Users";
import apiCall from "../utils/axios";

const ProfilePage = () => {

    const userContext = useContext(UserContext);
    const { user, setUser, token } = userContext || {};

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserProfileFormData>({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        password: ""
    });

    const handleFormSubmit = async(e: React.FormEvent) => {
       try {

            e.preventDefault();
            if(isLoading) return;
            if(formData.email && !checkEmailFormat(formData.email)) {
                toast.error("Please enter a valid email address.");
                return;
            }

            const updateUserPayload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
            };

            if(formData.password) {
                (updateUserPayload as any).password = formData.password;
            }

            setIsLoading(true);
            const response = await apiCall.put(`/profile/${user?.user_id}`, updateUserPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userData = response.data.userData;
            if(response.data.status !== true || !userData) {
                toast.error(response.data.message || "Failed to update profile. Please try again.");
                return;
            }

            const updatedUserData: userData = {
                ...user!,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name
            };
            if (setUser) setUser(updatedUserData);

            toast.success("Profile updated successfully.");
            return;
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating the profile. Please try again.");
        }finally {
            setIsLoading(false);
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);

    return <>
        <h3 className="mb-4">Profile</h3>
        <form className="card d-flex flex-column" onSubmit={handleFormSubmit}>
            <div className="card-body flex-fill">

                <div className="row g-3 align-items-center mb-2">
                    <div className="col-md-2 col-form-label">
                        <label htmlFor="user_name" className="col-form-label">Username:</label>
                    </div>
                    <div className="col-auto">
                        <input type="text" id="user_name" className="form-control" readOnly disabled value={user?.user_name || ""} />
                    </div>
                </div>

                <div className="row g-3 align-items-center mb-2">
                    <div className="col-md-2 col-form-label">
                        <label htmlFor="first_name" className="col-form-label">First Name:</label>
                    </div>
                    <div className="col-auto">
                        <input type="text" id="first_name" className="form-control" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                    </div>
                </div>

                <div className="row g-3 align-items-center mb-2">
                    <div className="col-md-2 col-form-label">
                        <label htmlFor="last_name" className="col-form-label">Last Name:</label>
                    </div>
                    <div className="col-auto">
                        <input type="text" id="last_name" className="form-control" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                    </div>
                </div>

                <div className="row g-3 align-items-center mb-2">
                    <div className="col-md-2 col-form-label">
                        <label htmlFor="email" className="col-form-label">Email*:</label>
                    </div>
                    <div className="col-auto">
                        <input type="email" id="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                </div>

                <div className="row g-3 align-items-center">
                    <div className="col-md-2 col-form-label">
                        <label htmlFor="password" className="col-form-label">Password:</label>
                    </div>
                    <div className="col-auto">
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} id="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            <button className="btn btn-secondary" type="button" onClick={toggleShowPassword}>
                                {showPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                    </div>
                </div>

            </div>
            <div className="card-footer">
                <button className="btn btn-dark d-flex align-items-center gap-1" disabled={isLoading}><Save size={18} />{isLoading ? " Saving..." : " Save"}</button>
            </div>
        </form>
    </>;
};

export default ProfilePage;