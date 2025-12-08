import { createContext, useEffect, useState, type ReactNode } from "react";
import apiCall from "../utils/axios";
import { toast } from "react-toastify";
import type { CityData } from "../types/Cities";

interface CityContextType {
    selectedCity: CityData | null;
    cities: CityData[];
    setSelectedCity: (city: CityData | null) => void;
    isLoading: boolean;
    isInitialized: boolean;
}

export const CityContext = createContext<CityContextType | undefined>(undefined);

interface CityProviderProps {
    children: ReactNode;
}

const CITY_STORAGE_KEY = "findora_selected_city";

export const CityProvider = ({ children }: CityProviderProps) => {
    const [selectedCity, setSelectedCityState] = useState<CityData | null>(null);
    const [cities, setCities] = useState<CityData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    // Load city from localStorage on mount
    useEffect(() => {
        const storedCity = localStorage.getItem(CITY_STORAGE_KEY);
        if (storedCity) {
            try {
                const parsedCity = JSON.parse(storedCity);
                setSelectedCityState(parsedCity);
            } catch (error) {
                console.error("Failed to parse stored city:", error);
                localStorage.removeItem(CITY_STORAGE_KEY);
            }
        }
        setIsInitialized(true);
    }, []);

    // Fetch all cities on mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setIsLoading(true);
                const response = await apiCall.get("/cities");
                if (response.data.status) {
                    setCities(response.data.data || []);
                } else {
                    toast.error(response.data.message || "Failed to fetch cities");
                }
            } catch (error: any) {
                console.error("Error fetching cities:", error);
                toast.error(error.response?.data?.message || "Failed to fetch cities");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCities();
    }, []);

    const setSelectedCity = (city: CityData | null) => {
        setSelectedCityState(city);
        if (city) {
            localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city));
        } else {
            localStorage.removeItem(CITY_STORAGE_KEY);
        }
    };

    return (
        <CityContext.Provider value={{ selectedCity, cities, setSelectedCity, isLoading, isInitialized }}>
            {children}
        </CityContext.Provider>
    );
};