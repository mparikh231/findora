import { useContext, useState } from "react";
import { CityContext } from "../../context/CityContext";
import { MapPin } from "lucide-react";

const CityDropdown = () => {
    const cityContext = useContext(CityContext);
    const { selectedCity, cities, setSelectedCity, isLoading } = cityContext!;

    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

    const toggleCityDropdown = () => setIsCityDropdownOpen(!isCityDropdownOpen);

    // Group cities by state
    const groupedCities = cities.reduce((acc, city) => {
        const stateName = city.stateName || "Unknown";
        if (!acc[stateName]) {
            acc[stateName] = [];
        }
        acc[stateName].push(city);
        return acc;
    }, {} as Record<string, typeof cities>);

    const handleCitySelect = (city: typeof cities[0]) => {
        setSelectedCity(city);
        setIsCityDropdownOpen(false);
    };

    return (
        <div className="dropdown">
            <button
                className={`btn btn-outline-secondary btn-sm d-flex align-items-center gap-1${isCityDropdownOpen ? " show" : ""}`}
                type="button"
                onClick={toggleCityDropdown}
                disabled={isLoading}
                aria-expanded={isCityDropdownOpen}
            >
                <MapPin size={16} />
                <span>{selectedCity ? selectedCity.name : "Select City"}</span>
            </button>
            <ul className={`dropdown-menu${isCityDropdownOpen ? " show" : ""}`} style={{ maxHeight: "400px", overflowY: "auto" }}>
                {isLoading && (
                    <li className="dropdown-item-text text-muted">Loading cities...</li>
                )}
                {!isLoading && cities.length === 0 && (
                    <li className="dropdown-item-text text-muted">No cities available</li>
                )}
                {!isLoading && Object.keys(groupedCities).sort().map((stateName) => (
                    <li key={stateName}>
                        <h6 className="dropdown-header">{stateName}</h6>
                        {groupedCities[stateName].map((city) => (
                            <button
                                key={city.id}
                                className={`dropdown-item${selectedCity?.id === city.id ? " active" : ""}`}
                                onClick={() => handleCitySelect(city)}
                            >
                                {city.name}
                            </button>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CityDropdown;