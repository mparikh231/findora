export interface Favourite {
    id: number;
    userId: number;
    listingId: number;
    createdAt: Date;
    featuredImageUrl: string;
    description: string;
    title: string;
    price: number;
}
export interface FavouriteResponse {
    isFavourite: boolean;
    message: string;
    data?: Favourite | Favourite[];
}