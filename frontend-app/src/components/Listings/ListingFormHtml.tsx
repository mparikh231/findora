import { useContext, useEffect, useState } from "react";
import type { ListingFormHtmlProps } from "../../types/Listing";
import type { CategoryData } from "../../types/categories";
import type { StateData } from "../../types/States";
import type { CityData } from "../../types/Cities";
import type { UsersTableViewData } from "../../types/Users";
import apiCall from "../../utils/axios";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

const ListingFormHtml = (props: ListingFormHtmlProps) => {
    const { listingData, setListingData, action } = props;
    const userContext = useContext(UserContext);
    const { user: currentUser } = userContext || {};

    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [states, setStates] = useState<StateData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);
    const [users, setUsers] = useState<UsersTableViewData[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
    const [isLoadingStates, setIsLoadingStates] = useState<boolean>(false);
    const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const response = await apiCall.get("/categories");
            const { status, data } = response.data;
            if (status) {
                setCategories(data || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to fetch categories");
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // Fetch states
    const fetchStates = async () => {
        try {
            setIsLoadingStates(true);
            const response = await apiCall.get("/states");
            const { status, data } = response.data;
            if (status) {
                setStates(data || []);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
            toast.error("Failed to fetch states");
        } finally {
            setIsLoadingStates(false);
        }
    };

    // Fetch cities by state
    const fetchCities = async (stateId: number) => {
        try {
            setIsLoadingCities(true);
            const response = await apiCall.get(`/cities?stateId=${stateId}`);
            const { status, data } = response.data;
            if (status) {
                setCities(data || []);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            toast.error("Failed to fetch cities");
        } finally {
            setIsLoadingCities(false);
        }
    };

    // Fetch users (admin only)
    const fetchUsers = async () => {
        try {
            setIsLoadingUsers(true);
            const response = await apiCall.get("/users");
            const { status, userData } = response.data;
            if (status) {
                setUsers(userData || []);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchCategories();
        fetchStates();
        if (currentUser?.role === 'admin') {
            fetchUsers();
        }
    }, []);

    // Load cities when state changes
    useEffect(() => {
        if (listingData.stateId) {
            fetchCities(Number(listingData.stateId));
        } else {
            setCities([]);
            setListingData(prev => ({ ...prev, cityId: '' }));
        }
    }, [listingData.stateId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setListingData(prev => ({ ...prev, [name]: checked }));
        } else {
            setListingData(prev => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        console.log("states updated:", states);

    }, [states])

    return (
        <>
            <div className="mb-3">
                <label htmlFor="listingTitle" className="form-label">Title*</label>
                <input
                    type="text"
                    className="form-control"
                    id="listingTitle"
                    name="title"
                    placeholder="Enter listing title"
                    value={listingData.title}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="listingDescription" className="form-label">Description*</label>
                <textarea
                    name="description"
                    id="listingDescription"
                    className="form-control"
                    placeholder="Enter listing description"
                    value={listingData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                ></textarea>
            </div>

            <div className="mb-3">
                <label htmlFor="listingPrice" className="form-label">Price*</label>
                <input
                    type="number"
                    className="form-control"
                    id="listingPrice"
                    name="price"
                    placeholder="Enter listing price"
                    value={listingData.price}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="listingLocation" className="form-label">Location*</label>
                <input
                    type="text"
                    className="form-control"
                    id="listingLocation"
                    name="location"
                    placeholder="Enter listing location"
                    value={listingData.location}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="listingState" className="form-label">State*</label>
                <select
                    className="form-select"
                    id="listingState"
                    name="stateId"
                    value={listingData.stateId}
                    onChange={handleInputChange}
                    required
                    disabled={isLoadingStates}
                >
                    <option value="">Select state</option>
                    {states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="listingCity" className="form-label">City*</label>
                <select
                    className="form-select"
                    id="listingCity"
                    name="cityId"
                    value={listingData.cityId}
                    onChange={handleInputChange}
                    required
                    disabled={!listingData.stateId || isLoadingCities}
                >
                    <option value="">Select city</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="listingCategory" className="form-label">Category*</label>
                <select
                    className="form-select"
                    id="listingCategory"
                    name="categoryId"
                    value={listingData.categoryId}
                    onChange={handleInputChange}
                    required
                    disabled={isLoadingCategories}
                >
                    <option value="">Select category</option>
                    {categories.map(category => (
                        <optgroup key={category.id} label={category.name}>
                            <option value={category.id}>{category.name}</option>
                            {category.subCategories && category.subCategories.map(subCat => (
                                <option key={subCat.id} value={subCat.id}>
                                    &nbsp;&nbsp;{subCat.name}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="listingIsAvailable"
                        name="isAvailable"
                        checked={Boolean(listingData.isAvailable)}
                        onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="listingIsAvailable">
                        Available for Sale
                    </label>
                </div>
            </div>

            {currentUser?.role === 'admin' && (
                <>
                    <div className="mb-3">
                        <label htmlFor="listingUser" className="form-label">Assign to User*</label>
                        <select
                            className="form-select"
                            id="listingUser"
                            name="userId"
                            value={listingData.userId || ''}
                            onChange={handleInputChange}
                            disabled={isLoadingUsers}
                        >
                            <option value="">Select user</option>
                            {users.map(user => (
                                <option key={user.user_id} value={user.user_id}>
                                    {user.user_name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="listingStatus" className="form-label">Status*</label>
                        <select
                            className="form-select"
                            id="listingStatus"
                            name="status"
                            value={listingData.status || 'pending'}
                            onChange={handleInputChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </>
            )}
        </>
    );
}

export default ListingFormHtml;