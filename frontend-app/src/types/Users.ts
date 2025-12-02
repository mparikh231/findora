export interface userData {
    email: string | null;
    user_id: number;
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
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}
export interface UserActionSidebarProps {
    isOpen: boolean;
    onModalChange?: (isOpen: boolean) => void;
    action: 'add' | 'edit' ;
    user_id?: number | null;
    refreshUsers?: () => void;
    userData?: UserFormData | null;
}

export interface UserFormHtmlProps {
    userData: UserFormData;
    setUserData: React.Dispatch<React.SetStateAction<UserFormData>>;
    action?: 'add' | 'edit';
}

export interface UserFormData {
    user_name: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    role: "user" | "admin";
    status: "active" | "inactive" | "1" | "0";
}
export interface UsersTableViewProps {
    users: Array<UsersTableViewData>;
    isLoading?: boolean;
    editUser?: (user_id: number) => void;
    deleteUser?: (user_id: number) => void;
}
export interface UsersTableViewData {
    email: string;
    user_id: number;
    status: boolean;
    user_name: string;
    first_name: string;
    last_name: string;
    role: "user" | "admin";
    created_at: string | Date;
}