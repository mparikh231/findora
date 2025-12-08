import { useContext, useEffect, useState } from "react";
import ListingActionSidebar from "../components/Listings/ListingActionSidebar";
import ListingsTableView from "../components/Listings/ListingsTableView";
import { toast } from "react-toastify";
import apiCall from "../utils/axios";
import type { Listing, ListingFormData } from "../types/Listing";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ListingManagementPage = () => {
    const { action, listingId } = useParams();
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const { user: currentUser } = userContext || {};

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isListingDataLoading, setIsListingDataLoading] = useState<boolean>(false);
    const [editListingData, setEditListingData] = useState<ListingFormData | null>(null);
    const [editListingId, setEditListingId] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        return action === "add" || action === "edit";
    });
    const [sidebarAction, setSidebarAction] = useState<"add" | "edit">(() => {
        if (action === "edit" && listingId) return "edit";
        return "add";
    });
    const [listings, setListings] = useState<Array<Listing>>([]);

    // Fetch listings based on user role
    const fetchListings = async () => {
        try {
            setIsLoading(true);
            const queryParams: Record<string, string> = {};
            
            // Regular users can only see their own listings
            if (currentUser?.role === 'user' && currentUser?.user_id) {
                queryParams.userId = String(currentUser.user_id);
            }
            // Admin can see all listings (no filter)

            const response = await apiCall.get("/listings", { params: queryParams });
            const { status, listingData } = response.data;

            if (!status) {
                toast.error("Failed to fetch listings. Please try again later.");
                setListings([]);
                return;
            }
            setListings(listingData);
        } catch (error) {
                console.error("Error fetching listings:",error);
                toast.error("Failed to fetch listings.");
                setListings([]);
            
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch listing by ID for editing
    const fetchListingById = async (listingId: number) => {
        try {
            setIsListingDataLoading(true);
            const response = await apiCall.get(`/listings/${listingId}`);
            const { status, listingData } = response.data;

            if (!status) {
                toast.error("Failed to fetch listing data. Please try again later.");
                return;
            }

            const formattedListingData: ListingFormData = {
                title: listingData.title,
                description: listingData.description,
                price: listingData.price,
                location: listingData.location,
                categoryId: listingData.category?.id || '',
                stateId: listingData.state?.id || '',
                cityId: listingData.city?.id || '',
                isAvailable: listingData.isAvailable,
                status: listingData.status,
                userId: listingData.user?.id || ''
            };
            setEditListingData(formattedListingData);
            setEditListingId(Number(listingId));
            setSidebarAction("edit");
            setIsSidebarOpen(true);
        } catch (error) {
            console.error("Error fetching listing by ID:", error);
            toast.error("Failed to fetch listing data. Please try again later.");
        } finally {
            setIsListingDataLoading(false);
        }
    };

    // Delete listing
    const deleteListing = async (listingId: number) => {
        try {
            setIsListingDataLoading(true);
            const response = await apiCall.delete(`/listings/${listingId}`);
            const { status } = response.data;
            if (!status) {
                toast.error("Failed to delete listing. Please try again later.");
                return;
            }
            toast.success("Listing deleted successfully.");
            fetchListings();
        } catch (error) {
            console.error("Error deleting listing:", error);
            toast.error("Failed to delete listing. Please try again later.");
        } finally {
            setIsListingDataLoading(false);
        }
    };

    // Toggle availability
    const toggleAvailability = async (listingId: number, currentStatus: boolean) => {
        try {
            setIsListingDataLoading(true);
            const payload = {
                isAvailable: !currentStatus
            };
            const response = await apiCall.put(`/listings/${listingId}`, payload);
            const { status } = response.data;
            if (!status) {
                toast.error("Failed to update listing availability. Please try again later.");
                return;
            }
            toast.success("Listing availability updated successfully.");
            fetchListings();
        } catch (error) {
            console.error("Error updating listing availability:", error);
            toast.error("Failed to update listing availability. Please try again later.");
        } finally {
            setIsListingDataLoading(false);
        }
    };

    // Load listings on mount
    useEffect(() => {
        if (currentUser) {
            fetchListings();
        }
    }, [currentUser]);

    // Handle URL routing for add/edit
    useEffect(() => {
        if (action === "edit" && listingId) {
            fetchListingById(Number(listingId));
        } else if (action === "add") {
            setSidebarAction("add");
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [action, listingId]);

    // Clean up when sidebar closes
    useEffect(() => {
        if (!isSidebarOpen && (action === "add" || action === "edit")) {
            navigate('/admin/listings');
        }

        if (!isSidebarOpen) {
            setEditListingData(null);
            setEditListingId(null);
        }
    }, [isSidebarOpen]);

    return <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0">Listings</h3>
            <button 
                className="btn btn-dark" 
                onClick={() => { 
                    setSidebarAction("add"); 
                    setEditListingData(null);
                    setEditListingId(null);
                    setIsSidebarOpen(true); 
                }}
                disabled={isListingDataLoading}
            >
                Add New
            </button>
        </div>

        <div className="position-relative">
            {isListingDataLoading && (
                <div className="position-absolute h-100 w-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(255,255,255,0.6)", zIndex: isListingDataLoading ? 1 : -1, pointerEvents: isListingDataLoading ? 'auto' : 'none', transition: 'all 0.3s ease' }}>
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <ListingsTableView 
                listings={listings} 
                isLoading={isLoading} 
                editListing={fetchListingById} 
                deleteListing={deleteListing}
                toggleAvailability={toggleAvailability}
            />
        </div>

        <ListingActionSidebar
            isOpen={isSidebarOpen}
            action={sidebarAction}
            onModalChange={setIsSidebarOpen}
            listingId={editListingId}
            refreshListings={fetchListings}
            listingData={editListingData}
        />
    </>;
}

export default ListingManagementPage;