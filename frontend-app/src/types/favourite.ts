export interface Favourite {
    id: number;
    userId: number;
    listingId: number;
    createdAt: Date;
    featuredImageUrl: string;
    description: string;
    title: string;
    price: number;
    favoriteId: number;
    favoriteCreatedAt: Date;
    listingTitle: string;
    listingDescription: string;
    listingPrice: number;
}
export interface FavouriteResponse {
    isFavourite: boolean;
    message: string;
    data?: Favourite | Favourite[];
}