import UserFormHtml from "./UserFormHtml";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { checkEmailFormat } from "../../utils/helpers";
import { Offcanvas } from "reactstrap";
import { Save, X } from "lucide-react";
import type { UserActionSidebarProps, UserFormData } from "../../types/Users";
import apiCall from "../../utils/axios";    

const UserActionSidebar = (props: UserActionSidebarProps) => {
    const { isOpen, onModalChange, action, user_id, refreshUsers, userData: editUserData } = props;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userFormData, setUserFormData] = useState<UserFormData>({
        user_name: editUserData?.user_name || '',
        email: editUserData?.email || '',
        password: '',
        first_name: editUserData?.first_name || '',
        last_name: editUserData?.last_name || '',
        status: editUserData?.status || "1",
        role: editUserData?.role || 'user'
    });

    const resetUserFormData = () => {
        setUserFormData({
            user_name: '',
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            status: "active",
            role: 'user'
        });
    }

    const addNewUser = async () => {
        try {
            const payload = {
                user_name: userFormData.user_name,
                email: userFormData.email,
                password: userFormData.password,
                first_name: userFormData.first_name,
                last_name: userFormData.last_name,
                status: userFormData.status === "active" ? true : false,
                role: userFormData.role
            }
            setIsLoading(true);
            const response = await apiCall.post('/users', payload);
            const { status } = response.data;

            if(!status) {
                toast.error("Failed to add new user. Please try again later.");
                return;
            }

            toast.success("New user added successfully!");
            onModalChange && onModalChange(false);
            refreshUsers && refreshUsers();
            resetUserFormData();

        } catch (error) {
            console.error("Error adding new user:", error);
            toast.error("An error occurred while adding the user");
        } finally {
            setIsLoading(false);
        }
    };

    const editUser = async () => {
        try {
            
            const payload: any ={};
            if(userFormData.email) payload.email = userFormData.email;
            if(userFormData.password) payload.password = userFormData.password;
            if(userFormData.first_name) payload.first_name = userFormData.first_name;
            if(userFormData.last_name) payload.last_name = userFormData.last_name;
            if(userFormData.status) payload.status = userFormData.status === "1" ? 1 : 0;
            if(userFormData.role) payload.role = userFormData.role;

            if (Object.keys(payload).length === 0) {
                toast.info("No changes made to update.");
                return;
            }

            setIsLoading(true);
            const response = await apiCall.put(`/users/${user_id}`, payload);
            const { status } = response.data;

            if(!status) {
                toast.error("Failed to edit user. Please try again later.");
                return;
            }

            toast.success("User edited successfully!");
            onModalChange && onModalChange(false);
            resetUserFormData();
        } catch (error) {
            console.error("Error editing user:", error);
            toast.error("Failed to edit user. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(checkEmailFormat(userFormData.email) === false) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if(action === 'add') {
            addNewUser();
            return;
        } else if ( action === 'edit' && user_id) {
            editUser();
            return;
        }
    };

    useEffect(() => {
        if ( action === 'edit' && editUserData) {
            setUserFormData({
                user_name: editUserData.user_name,
                email: editUserData.email,
                password: editUserData.password,
                first_name: editUserData.first_name,
                last_name: editUserData.last_name,
                status: editUserData.status,
                role: editUserData.role
            });
        }
    }, [editUserData]);

    return(
        <Offcanvas isOpen={isOpen} toggle={() => onModalChange && onModalChange(!isOpen)} direction="end" fade={false}>

            {isLoading && (
                <div className="d-flex justify-content-center align-items-center vh-100 position-absolute" style={{ backgroundColor: "rgba(255,255,255, 0.5)" }}>
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <form onSubmit={handleFormSubmit} className="d-flex flex-column vh-100">

                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title mb-0">{action === 'add' ? 'Add New User' : 'Edit User'}</h5>
                    <button type="button" className="btn-close text-reset" aria-label="Close" onClick={() => onModalChange && onModalChange(false)}></button>
                </div>

                <div className="offcanvas-body flex-fill">
                    <UserFormHtml userData={userFormData} setUserData={setUserFormData} action= {action} />
                </div>

                <div className="offcanvas-footer border-top d-flex align-items-center justify-content-between">
                    <button type="submit" className="btn btn-dark d-flex align-items-center gap-1"><Save size={18} />Save</button>
                    <button type="button" className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => onModalChange && onModalChange(false)}><X size={18} />Cancel</button>
                </div>
            </form>

        </Offcanvas>
    );
};

export default UserActionSidebar;