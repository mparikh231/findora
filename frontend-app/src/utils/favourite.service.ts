import apiCall from "./axios";

export const checkFavourite = async (listingId: number) => {
    const response = await apiCall.get(`/favourites/check/${listingId}`);
    return response.data;
};
export const addFavourite = async (listingId: number) => {
    const response = await apiCall.post(`/favourites/${listingId}`);
    return response.data;
};

export const removeFavourite = async (listingId: number) => {
    const response = await apiCall.delete(`/favourites/${listingId}`);
    return response.data;
};
export const getFavouriteCount = async () => {
    const response = await apiCall.get(`/favourites/count/`);
    return response.data;
};
export const getUserFavourite = async (listingId: number) => {
    const response = await apiCall.get(`/favourites/user/${listingId}`);
    return response.data;
};