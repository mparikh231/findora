import { useParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import { useContext, useEffect, useState } from "react";
import { CityContext } from "../context/CityContext";
import apiCall from "../utils/axios";
import type { Listing } from "../types/Listing";
import Banner from "../layouts/Banner";

const CategoryPage = () => {
    const { id: categoryId } = useParams();
    const cityContext = useContext(CityContext);
    const { selectedCity, isInitialized } = cityContext!;

    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categoryName, setCategoryName] = useState<string>("");

    useEffect(() => {
        if (!isInitialized) return;

        const fetchListings = async () => {
            try {
                setIsLoading(true);
                const params: any = {};
                if (categoryId) {
                    params.categoryId = categoryId;
                }
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
    }, [categoryId, selectedCity, isInitialized]);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!categoryId) return;
            try {
                const response = await apiCall.get(`/categories/${categoryId}`);
                if (response.data.status && response.data.data) {
                    setCategoryName(response.data.data.name || "");
                }
            } catch (error: any) {
                console.error("Error fetching category:", error);
            }
        };

        fetchCategory();
    }, [categoryId]);

    return (
        <section className="category-page">
            <Banner
                title={categoryName || `Category ${categoryId || ""}`}
                size="small"
            />
            <div className="container mt-5">
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
                                ? `No listings available in this category for ${selectedCity.name}. Try selecting a different city.`
                                : "No listings available in this category. Please select a city to see listings."}
                        </p>
                    </div>
                )}
                {!isLoading && listings.length > 0 && (
                    <div className="row">

                        {listings.map((listing) => (
                            <div key={`category-listing-${listing.id}`} className="col-md-3 mb-4">
                                <ListingCard listing={listing} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryPage;