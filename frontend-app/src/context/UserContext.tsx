import { createContext, useState } from "react";
import type { UserContextType, userData } from "../types/Users";
import { jwtDecode } from "jwt-decode";
import { setAuthToken } from "../utils/axios";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    // -------- SAFE TOKEN EXTRACTION -------- //
    const getTokenFromCookie = () => {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith("findora_token="))
            ?.split("=")[1] || null;
    };

    const safeDecode = (token: string | null): userData | null => {
        if (!token) return null;

        try {
            return jwtDecode<userData>(token);
        } catch (err) {
            console.error("Invalid token:", err);
            return null;
        }
    };

    // -------- TOKEN STATE -------- //
    const [token, setTokenState] = useState<string | null>(() => {
        const cookieToken = getTokenFromCookie();
        const tokenData = safeDecode(cookieToken);

        return tokenData ? cookieToken : null;
    });

    // -------- USER DATA STATE -------- //
    const [userData, setUserData] = useState<userData | null>(() => {
        const cookieToken = getTokenFromCookie();
        return safeDecode(cookieToken);
    });

    // -------- SET TOKEN -------- //
    const setToken = (newToken: string | null) => {
        if (!newToken) return;

        const tokenData = safeDecode(newToken);
        if (!tokenData) return;

        const expiresAt = (tokenData as any).exp * 1000;
        if (Date.now() >= expiresAt) {
            console.warn("Token already expired");
            return;
        }

        // Save in cookie
        document.cookie = `findora_token=${newToken}; path=/; max-age=${(expiresAt - Date.now()) / 1000}`;

        setTokenState(newToken);
        setUserData(tokenData);
        setAuthToken(newToken);
    };

    // -------- CLEAR TOKEN -------- //
    const clearToken = () => {
        setTokenState(null);
        document.cookie = "findora_token=; path=/; max-age=0";
    };

    // -------- CLEAR USER -------- //
    const clearUserData = () => setUserData(null);

    // -------- LOGOUT -------- //
    const logOut = () => {
        clearUserData();
        clearToken();
    };

    return (
        <UserContext.Provider value={{ 
            user: userData,
            setUser: setUserData,
            token,
            setToken,
            clearUserData,
            clearToken,
            logOut
        }}>
            {children}
        </UserContext.Provider>
    );
};
