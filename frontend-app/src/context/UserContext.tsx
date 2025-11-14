import React, { createContext, useState } from "react";
import type { UserContextType, userData } from "../types/Users";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    
    const [userData, setUserData] = useState<userData | null>(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const setUser = (user: userData | null) => { 
        if (!user) return setUserData(null);
        localStorage.setItem("userData", JSON.stringify(user));
    }

    const [token, setTokenState] = useState<string | null>(() => {
        const storedToken = localStorage.getItem("token");
        return storedToken ? storedToken : null;
    });

    const setToken = (token: string | null) => {
        if (!token) return setTokenState(token);
        localStorage.setItem("token", token);
    }

    const clearUserData = () => {
        setUserData(null);
        localStorage.removeItem("userData");
    }

    const clearToken = () => {
        setToken(null);
        localStorage.removeItem("token");
    }

    const logout = () => {
        clearUserData();
        clearToken();
    }

    return (
        <UserContext.Provider value={{ user: userData, setUser, token, setToken, clearUserData, clearToken, logout }}>
            {children}
        </UserContext.Provider>
    );
}