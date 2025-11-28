import { toast } from "react-toastify";
import type { UsersTableViewData, UserFormData } from "../../types/Users";
import apiCall from "../../utils/axios";
import { useEffect, useState } from "react";
import UsersTableView from "../../components/Users/UsersTableView";
import UserActionSidebar from "../../components/Users/UserActionSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { checkEmailFormat } from "../../utils/helpers";

const UsersPage = () => {

    const { action, user_id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(false);
    const [editUserData, setEditUserData] = useState<UserFormData | null>(null);
    const [editUser_id, setEditUser_id] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        return action === "add" || action === "edit";
    });
    const [sidebarAction, setSidebarAction] = useState<"add" | "edit">(() => {
        if (action === "edit" && user_id) return "edit";
        return "add";
    });
    const [users, setUsers] = useState<Array<UsersTableViewData>>([]);

    const [userRoleFilter, setUserRoleFilter] = useState<"admin" | "user" | null>(null);
    const [userStatusFilter, setUserStatusFilter] = useState<"1" | "0" | null>(null);
    const [userSearchQuery, setUserSearchQuery] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const queryParams: Record<string, string> = {};
            if(userRoleFilter) queryParams.role = userRoleFilter;
            if(userStatusFilter) queryParams.status = userStatusFilter;
            if(userSearchQuery) {
                if(checkEmailFormat(userSearchQuery)) {
                    queryParams.email = userSearchQuery;
                } else {
                    queryParams.user_name = userSearchQuery;
                }
            }

            const response = await apiCall.get("/users", { params: queryParams });
            const { status, userData } = response.data;

            if(!status) {
                toast.error("Failed to fetch users. Please try again later.");
                setUsers([]);
                return;
            }
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
            toast.error("Failed to fetch users. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserById = async (user_id: number) => {
        try {
            setIsUserDataLoading(true);
            const response = await apiCall.get(`/users/${user_id}`);
            const { status, userData } = response.data;

            if (!status) {
                toast.error("Failed to fetch user data. Please try again later.");
                return;
            }

            const formattedUserData: UserFormData = {
                user_name: userData.user_name,
                email: userData.email,
                password: '',
                first_name: userData.first_name,
                last_name: userData.last_name,
                role: userData.role,
                status: userData.status ? "1" : "0"
            };

            setEditUserData(formattedUserData);
            setEditUser_id(Number(user_id));
            setSidebarAction("edit");
            setIsSidebarOpen(true);
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            toast.error("Failed to fetch user data. Please try again later.");
        } finally {
            setIsUserDataLoading(false);
        }
    };

    const deleteUser = async (user_id: number) => {
        try {
            setIsUserDataLoading(true);
            const response = await apiCall.delete(`/users/${user_id}`);
            const { status } = response.data;
            if(!status) {
                toast.error("Failed to delete user. Please try again later.");
                return;
            }
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user. Please try again later.");
        } finally {
            setIsUserDataLoading(false);
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [userRoleFilter,userStatusFilter]);

    useEffect(() => {
        if (action === "edit" && user_id) {
            setSidebarAction("edit");
            setIsSidebarOpen(true);
        } else if (action === "add") {
            setSidebarAction("add");
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [action, user_id]);

    useEffect(() => {
        if (!isSidebarOpen && (action === "add" || action === "edit")) {
            navigate("/admin/users");
        }

        if(!isSidebarOpen) {
            setEditUserData(null);
            setEditUser_id(null);
        }
    }, [isSidebarOpen]);

    return <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0">Users</h3>
            <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-2">
                    <form className="input-group flex-fill" style={{ minWidth: "300px"}} onSubmit={handleFormSubmit}>
                        <input type="text" className="form-control" placeholder="Search by username or email" value={userSearchQuery || ""} onChange={(e) => setUserSearchQuery(e.target.value === "" ? null : e.target.value)} />
                        <button className="btn btn-secondary" type="submit"><Search size={18} /></button>
                    </form>
                    <select className="form-select" onChange={(e) => setUserStatusFilter(e.target.value !== "" ? e.target.value as "1" | "0": null)} value={userStatusFilter || ""}>
                        <option value="">Select Statuses</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <select className="form-select" onChange={(e) => setUserRoleFilter(e.target.value !== "" ? e.target.value as "admin" | "user": null)} value={userRoleFilter || ""}>
                        <option value="">Filter By Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <button className="btn btn-dark" onClick={() => { setSidebarAction("add"); setIsSidebarOpen(true); }} disabled={isUserDataLoading}>Add New</button>
            </div>
        </div>

        <div className="position-relative">
            {isUserDataLoading && (
                <div className="position-absolute h-100 w-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(255,255,255,0.6)", zIndex: isUserDataLoading ? 1 : -1, pointerEvents: isUserDataLoading ? 'auto' : 'none', transition: 'all 0.3s ease'}}>
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
            </div>
        )}

            <UsersTableView users={users} isLoading={isLoading} editUser={fetchUserById} deleteUser={deleteUser} />
        </div>

        <UserActionSidebar 
            isOpen={isSidebarOpen} 
            action={sidebarAction} 
            onModalChange={setIsSidebarOpen} 
            refreshUsers={fetchUsers}
            userData={editUserData}
            user_id={editUser_id} 
            />
    </>;
};
export default UsersPage;