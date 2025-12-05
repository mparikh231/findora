import { Offcanvas } from "reactstrap";
import type { ListingActionSidebarProps, ListingFormData } from "../../types/Listing";
import { Save, X } from "lucide-react";
import ListingFormHtml from "./ListingFormHtml";
import { useEffect, useState } from "react";
import apiCall from "../../utils/axios";
import { toast } from "react-toastify";

const ListingActionSidebar = (props: ListingActionSidebarProps) => {
    const { isOpen, onModalChange, action, listingId, refreshListings, listingData: editListingData } = props;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listingFormData, setListingFormData] = useState<ListingFormData>({
        title: '',
        description: '',
        price: '',
        location: '',
        categoryId: '',
        stateId: '',
        cityId: '',
        isAvailable: true,
        status: 'pending',
        userId: ''
    });

    const resetListingFormData = () => {
        setListingFormData({
            title: '',
            description: '',
            price: '',
            location: '',
            categoryId: '',
            stateId: '',
            cityId: '',
            isAvailable: true,
            status: 'pending',
            userId: ''
        });
    };

    const addNewListing = async () => {
        try {
            const payload: any = {
                title: listingFormData.title,
                description: listingFormData.description,
                price: Number(listingFormData.price),
                location: listingFormData.location,
                categoryId: Number(listingFormData.categoryId),
                stateId: Number(listingFormData.stateId),
                cityId: Number(listingFormData.cityId),
                isAvailable: Boolean(listingFormData.isAvailable)
            };

            // Admin-specific fields
            if (listingFormData.status) {
                payload.status = listingFormData.status;
            }
            if (listingFormData.userId) {
                payload.userId = Number(listingFormData.userId);
            }

            setIsLoading(true);
            const response = await apiCall.post("/listings", payload);
            const { status } = response.data;

            if (!status) {
                toast.error("Failed to add new listing. Please try again later.");
                return;
            }

            toast.success("New listing added successfully.");
            onModalChange && onModalChange(false);
            refreshListings && refreshListings();
            resetListingFormData();
        } catch (error) {
            console.error("Error adding new listing:", error);
            toast.error("Failed to add new listing. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const editListing = async () => {
        try {
            const payload: any = {};
            
            if (listingFormData.title) payload.title = listingFormData.title;
            if (listingFormData.description) payload.description = listingFormData.description;
            if (listingFormData.price) payload.price = Number(listingFormData.price);
            if (listingFormData.location) payload.location = listingFormData.location;
            if (listingFormData.categoryId) payload.categoryId = Number(listingFormData.categoryId);
            if (listingFormData.stateId) payload.stateId = Number(listingFormData.stateId);
            if (listingFormData.cityId) payload.cityId = Number(listingFormData.cityId);
            if (typeof listingFormData.isAvailable !== 'undefined') {
                payload.isAvailable = Boolean(listingFormData.isAvailable);
            }

            // Admin-specific fields
            if (listingFormData.status) {
                payload.status = listingFormData.status;
            }
            if (listingFormData.userId) {
                payload.userId = Number(listingFormData.userId);
            }

            if (Object.keys(payload).length === 0) {
                toast.info("No changes made to update.");
                return;
            }

            setIsLoading(true);
            const response = await apiCall.put(`/listings/${listingId}`, payload);
            const { status } = response.data;

            if (!status) {
                toast.error("Failed to edit listing. Please try again later.");
                return;
            }

            toast.success("Listing edited successfully.");
            onModalChange && onModalChange(false);
            refreshListings && refreshListings();
            resetListingFormData();
        } catch (error) {
            console.error("Error editing listing:", error);
            toast.error("Failed to edit listing. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!listingFormData.title || !listingFormData.description || !listingFormData.price || !listingFormData.location) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!listingFormData.categoryId || !listingFormData.stateId || !listingFormData.cityId) {
            toast.error("Please select category, state, and city.");
            return;
        }

        if (Number(listingFormData.price) <= 0) {
            toast.error("Price must be greater than 0.");
            return;
        }

        if (action === 'add') {
            addNewListing();
        } else if (action === 'edit' && listingId) {
            editListing();
        }
    };

    useEffect(() => {
        if (action === 'edit' && editListingData) {
            setListingFormData({
                title: editListingData.title || '',
                description: editListingData.description || '',
                price: editListingData.price || '',
                location: editListingData.location || '',
                categoryId: editListingData.categoryId || '',
                stateId: editListingData.stateId || '',
                cityId: editListingData.cityId || '',
                isAvailable: editListingData.isAvailable !== undefined ? editListingData.isAvailable : true,
                status: editListingData.status || 'pending',
                userId: editListingData.userId || ''
            });
        } else if (action === 'add') {
            resetListingFormData();
        }
    }, [editListingData, action]);

    return (
        <Offcanvas 
            isOpen={isOpen} 
            toggle={() => onModalChange && onModalChange(!isOpen)} 
            direction="end"
            fade={false}
        >
            {isLoading && (
                <div className="d-flex justify-content-center align-items-center vh-100 w-100 position-absolute" style={{ backgroundColor: "rgba(255,255,255, 0.5)", zIndex: 9999 }}>
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <form onSubmit={handleFormSubmit} className="d-flex flex-column vh-100">
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title mb-0">{action === 'add' ? 'Add New Listing' : 'Edit Listing'}</h5>
                    <button type="button" className="btn-close text-reset" aria-label="Close" onClick={() => onModalChange && onModalChange(false)}></button>
                </div>
                <div className="offcanvas-body flex-fill">
                    <ListingFormHtml 
                        listingData={listingFormData} 
                        setListingData={setListingFormData} 
                        action={action}
                    />
                </div>
                <div className="offcanvas-footer border-top d-flex align-items-center justify-content-between">
                    <button type="submit" className="btn btn-dark d-flex align-items-center gap-1" disabled={isLoading}>
                        <Save size={18} /> Save
                    </button>
                    <button type="button" className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => onModalChange && onModalChange(false)}>
                        <X size={18} /> Cancel
                    </button>
                </div>
            </form>
        </Offcanvas>
    );
};

export default ListingActionSidebar;