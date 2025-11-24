import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL ?? "";
let token: string | null = document.cookie.split('; ').find(row => row.startsWith('findora_token='))?.split('=')[1] ?? null;

export const setAuthToken = (newToken: string) => {
    token = newToken;
};

const apiCall = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiCall.interceptors.request.use((config) => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiCall;