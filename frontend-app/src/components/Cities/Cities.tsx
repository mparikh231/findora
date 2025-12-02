import { useEffect, useState } from "react";
import type { CityData, CityProps, CityFormData } from "../../types/Cities";
import apiCall from "../../utils/axios";
import { toast } from "react-toastify";
import type { AxiosResponse } from "axios";
import { Edit, Trash } from "lucide-react";
import  ConfirmModal  from "../ConfirmModal"

const Cities = (props: CityProps) => {
    const { stateId,stateName } = props;
    const defaultCityFormData: CityFormData = {
        name: "",
        id: null,
    };
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cities, setCities] = useState<CityData[]>([]);
    const [action, setAction] = useState<"add" | "edit">("add");
    const [currentCity, setCurrentCity] = useState<CityData | null>(null);
    const [cityFormData, setCityFormData] = useState<CityFormData>(defaultCityFormData);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [cityToDelete, setCityToDelete] = useState<CityData | null>(null);

    const fatchCities = async () => {
        try {
            setIsLoading(true);
            const response = await apiCall.get(`/cities?stateId=${stateId}`);
            const { status, data } = response.data;
            if (!data || data.length === 0) {
                setCities([]);
                return;
            }
            setCities(data);
        } catch (error) {
            console.error("Error fetching cities:", error);
            toast.error("Failed to fetch cities");
            setCities([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCityFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (cityFormData.name.trim() === "") {
                toast.error("City name cannot be empty.");
                return;
            }
            const payload = {
                name: cityFormData.name,
                stateId: stateId,
            };
            let response: AxiosResponse;
            setIsLoading(true);

            if (action === "edit" && currentCity && currentCity.id) {
                response = await apiCall.put(`/cities/${currentCity.id}`, payload);
            } else if (action === "add") {
                response = await apiCall.post("/cities", payload);
            }
            const { status } = response!.data;
            if (!status) {
                toast.error(`Failed to ${action === "add" ? "add" : "update"} city.`);
                return;
            }
            toast.success(`City ${action === "add" ? "added" : "updated"} successfully.`);
            fatchCities();
        } catch (error) {
            console.error("Error adding city:", error);
            toast.error("Failed to add city.");
        } finally {
            setCityFormData(defaultCityFormData);
            setIsLoading(false);
            setCurrentCity(null);
            setAction("add");
        }
    }

    const deleteCity = async (cityId: number) => {
        try {
            setIsLoading(true);
            const response = await apiCall.delete(`/cities/${cityId}`);
            const { status } = response.data;
            if (!status) {
                toast.error("Failed to delete city.");
                return;
            }
            toast.success("City deleted successfully.");
            fatchCities();
        } catch (error) {
            console.error("Error deleting city:", error);
            toast.error("Failed to delete city.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fatchCities();
    }, [stateId]);

    return <>
        <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title mb-0">Cities for {stateName} (ID: {stateId})</h5>
        </div>
        <div className="offcanvas-body flex-fill">
            <form onSubmit={handleCityFormSubmit} className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter city name"
                    required
                    onChange={(e) => setCityFormData({ ...cityFormData, name: e.target.value })}
                    value={cityFormData.name}
                    disabled={isLoading}
                />
                <button type="submit" className="btn btn-secondary" disabled={isLoading}>{action === "add" ? "Add" : "Edit"} City</button>
            </form>
            {!isLoading && cities.length === 0 && (
                <div className="alert alert-info">No cities found for this state.</div>
            )}
            {isLoading && (
                <div className="text-center my-5">
                    <div className="spinner-border text-secondary" role="status"></div>
                </div>
            )}
            {!isLoading && cities.length > 0 && (
                <div className="card">
                    <ul className="list-group list-group-flush">
                        {cities.map((city, index) => (
                            <li key={`city-list-${city.id}-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                                {city.name}
                                <div className="d-flex align-items-center gap-0">
                                    <button className="btn btn-sm btn-link text-dark" onClick={() => {
                                        setAction("edit");
                                        setCurrentCity(city);
                                        setCityFormData({ name: city.name, id: city.id });
                                    }}>
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-link text-danger"
                                        onClick={() => {
                                            setIsConfirmModalOpen(true);
                                            setCityToDelete(city);
                                        }}
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        <ConfirmModal
            isOpen={isConfirmModalOpen}
            onCancel={() => {
                setIsConfirmModalOpen(false);
                setCityToDelete(null);
            }}
            onConfirm={() => {
                if (cityToDelete && cityToDelete.id) {
                    deleteCity(cityToDelete.id);
                }
                setIsConfirmModalOpen(false);
                setCityToDelete(null);
            }}
            title="Delete City"
            message="Are you sure you want to delete this city?"
        />
    </>;
}


export default Cities;