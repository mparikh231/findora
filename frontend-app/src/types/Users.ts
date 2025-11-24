export interface userData {
    email: string;
    userId: number;
    first_name?: string;
    last_name?: string;
    role?: "user" | "admin";
    user_name?: string;
}
export interface UserContextType { 
    user: userData | null;
    token: string | null;
    setUser: (user: userData | null) => void;
    setToken: (token: string | null) => void;
    clearUserData?: () => void;
    clearToken?: () => void;
    logOut?: () => void;
}
export interface UserProfileFormData{
    first_name?: string;
    last_name?: string;
    email: string;
    password?: string;
}
export interface UserActionSidebarProps {
    isOpen: boolean;
    onModalChange?: (isOpen: boolean) => void;
    action: 'add' | 'edit' ;
    userId?: number;
}
export interface UsersTableViewProps {
    users: Array<UsersTableViewData>;
    isLoading?: boolean;
    editUser?: (userId: number) => void;
    deleteUser?: (userId: number) => void;
}
export interface UsersTableViewData {
    email: string;
    userId: number;
    status: boolean;
    user_name: string;
    first_name: string;
    last_name: string;
    role: "user" | "admin";
    created_at: string | Date;
}