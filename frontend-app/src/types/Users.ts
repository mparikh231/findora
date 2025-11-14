export interface userData {
    email: string;
    userId: number;
    firstname?: string;
    lastname?: string;
    role?: "user" | "admin";
}
export interface UserContextType { 
    user: userData | null;
    token: string | null;
    setUser: (user: userData | null) => void;
    setToken: (token: string | null) => void;
    clearUserData?: () => void;
    clearToken?: () => void;
    logout?: () => void;
}
