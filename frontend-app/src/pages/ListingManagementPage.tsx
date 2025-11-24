import { useState } from "react";
import ListingActionSidebar from "../components/Listings/ListingActionSidebar";
import ListingsTableView from "../components/Listings/ListingsTableView";

const ListingManagementPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [sidebarAction, setSidebarAction] = useState<"add" | "edit">("add");

    return <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0">Listings</h3>
            <button className="btn btn-dark" onClick={() => { setSidebarAction("add"); setIsSidebarOpen(true); }}>Add New</button>
        </div>
        <ListingsTableView />

        <ListingActionSidebar
            isOpen={isSidebarOpen}
            action={sidebarAction}
            onModalChange={setIsSidebarOpen}
        />
    </>;
}

export default ListingManagementPage;