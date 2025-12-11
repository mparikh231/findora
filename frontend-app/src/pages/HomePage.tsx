import { Link } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import { useContext, useEffect, useState } from "react";
import { CityContext } from "../context/CityContext";
import apiCall from "../utils/axios";
import type { Listing } from "../types/Listing";
import Banner from "../layouts/Banner";

const HomePage = () => {
    const cityContext = useContext(CityContext);
    const { selectedCity, isInitialized } = cityContext!;

    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (!isInitialized) return;

        const fetchListings = async () => {
            try {
                setIsLoading(true);
                const params: any = { limit: 6 };
                if (selectedCity) {
                    params.cityId = selectedCity.id;
                }
                const response = await apiCall.get("/listings", { params });
                if (response.data.status) {
                    setListings(response.data.listingData || []);
                }
            } catch (error: any) {
                console.error("Error fetching listings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, [selectedCity, isInitialized]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiCall.get("/categories");
                if (response.data.status) {
                    setCategories(response.data.data || []);
                }
            } catch (error: any) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="home-page">
            <Banner 
                title="Welcome to Findora" 
                subtitle="Your gateway to secure and private financial services."
                size="large"
            />

            <section className="features mt-5 mb-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            {isLoading && (
                                <div className="d-flex justify-content-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                            {!isLoading && listings.length === 0 && (
                                <div className="alert alert-info" role="alert">
                                    <h5 className="alert-heading">No listings found!</h5>
                                    <p className="mb-0">
                                        {selectedCity 
                                            ? `No listings available in ${selectedCity.name} at the moment. Try selecting a different city.`
                                            : "No listings available at the moment. Please select a city to see listings."}
                                    </p>
                                </div>
                            )}
                            {!isLoading && listings.length > 0 && (
                                <div className="row">
                                    {listings.map((listing) => (
                                        <div key={`home-listing-${listing.id}`} className="col-md-4 mb-4">
                                            <ListingCard listing={listing} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="col-md-3">
                            {categories.length > 0 && (
                                <div className="card">
                                    <div className="card-header">
                                        <h6 className="mb-0">Categories</h6>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        {categories.map((category) => (
                                            <li key={category.id} className="list-group-item">
                                                <Link to={`/category/${category.id}`} className="text-decoration-none">{category.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

        </section>
    );
};

export default HomePage;