export type Listing = {
    id: number;
    title: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
    location?: string;
    createdAt?: string;
};

export type ListingActionSidebarProps = {
    isOpen: boolean;
    onModalChange?: (isOpen: boolean) => void;
    action: 'add' | 'edit';
    listingId?: number;
};
