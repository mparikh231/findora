import { createContext, useState } from "react";
import type { UserContextType, userData } from "../types/Users";
import { jwtDecode } from "jwt-decode";
import { setAuthToken } from "../utils/axios";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const [token, setTokenState] = useState<string | null>(() => {
        try {
            // get token from cookies
            const token = document.cookie.split('; ').find(row => row.startsWith('findora_token='))?.split('=')[1] || null;
            const tokenData = jwtDecode<userData | null>(token || "") || null;
            return tokenData ? token : null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    });

    const setToken = (token: string | null) => {
        if (!token) return;
        try {
            const tokenData = jwtDecode<userData | null>(token || "") || null;
            if (!tokenData) return;
            const expiresAt = (tokenData as any).exp * 1000;
            if (Date.now() >= expiresAt) {
                console.warn("Token has already expired.");
                return;
            }

            // set token in cookies
            document.cookie = `findora_token=${token}; path=/; max-age=${(expiresAt - Date.now()) / 1000}`;
            setTokenState(token);
            setAuthToken(token);
            return token;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }

    const [userData, setUserData] = useState<userData | null>(() => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('findora_token='))?.split('=')[1] || null;
            const storedUser = jwtDecode<userData | null>(token || "") || null;
            return storedUser ? storedUser : null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    });

    const setUser = (user: userData | null) => {
        if (!user) return;
        setUserData(user);
    }

    const clearUserData = () => {
        setUserData(null);
    }

    const clearToken = () => {
        setTokenState(null);
        document.cookie = "findora_token=; path=/; max-age=0";
    }

    const logOut = () => {
        clearUserData();
        clearToken();
    }

    return (
        <UserContext.Provider value={{ user: userData, setUser, token, setToken, clearUserData, clearToken, logOut }}>
            {children}
        </UserContext.Provider>
    );
}