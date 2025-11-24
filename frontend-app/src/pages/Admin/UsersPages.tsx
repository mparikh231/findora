import { toast } from "react-toastify";
import type { UsersTableViewData } from "../../types/Users";
import apiCall from "../../utils/axios";
import { useEffect, useState } from "react";
import UsersTableView from "../../components/Users/UsersTableView";
import UserActionSidebar from "../../components/Users/UserActionSidebar";
import { useNavigate, useParams } from "react-router-dom";

const UsersPage = () => {

    const { action, userId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        return action === "add" || action === "edit";
    });
    const [sidebarAction, setSidebarAction] = useState<"add" | "edit">(() => {
        if (action === "edit" && userId) return "edit";
        return "add";
    });
    const [users, setUsers] = useState<Array<UsersTableViewData>>([]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await apiCall.get("/users");
            const { status, userData } = response.data;

            if(!status) {
                toast.error("Failed to fetch users. Please try again later.");
                return;
            }
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (action === "edit" && userId) {
            setSidebarAction("edit");
            setIsSidebarOpen(true);
        } else if (action === "add") {
            setSidebarAction("add");
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [action, userId]);

    useEffect(() => {
        if (!isSidebarOpen && (action === "add" || action === "edit")) {
            navigate("/admin/users");
        }
    }, [isSidebarOpen]);

    return <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0">Users</h3>
            <button className="btn btn-dark" onClick={() => { setSidebarAction("add"); setIsSidebarOpen(true); }}>Add New</button>
        </div>

        <UsersTableView users={users} isLoading={isLoading} />

        <UserActionSidebar isOpen={isSidebarOpen} action={sidebarAction} onModalChange={setIsSidebarOpen} refreshUsers={fetchUsers} />
    </>;
};
export default UsersPage;