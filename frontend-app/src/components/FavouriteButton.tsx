import { useEffect, useState } from "react";
import * as favService from "../utils/favourite.service";
import { Heart } from "lucide-react";

interface Props {
    listingId: number;
    onToggle?: (isFavourite: boolean) => void;
}

export const useFavourite = (listingId: number, onToggle?: (isFavourite: boolean) => void) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchFavourite = async () => {
            try {
                const res = await favService.checkFavourite(listingId);
                setIsFavourite(res.data.isFavourite);
            } catch (error) {
                setIsFavourite(false);
            } finally {
                setLoading(false);
            }
        };
        fetchFavourite();
    }, [listingId]);

    useEffect(() => {
        const fetchFavouriteCount = async () => {
            try {
                const res = await favService.getFavouriteCount();
                setCount(res.count || 0);
            } catch (error) {
                setCount(0);
            }
        };
        fetchFavouriteCount();
    }, []);

    const toggleFavourite = async () => {
        if (isFavourite === null) return null;
        try {
            if (isFavourite) {
                await favService.removeFavourite(listingId);
                setIsFavourite(false);
                setCount(prev => prev - 1);
                onToggle?.(false);
            } else {
                await favService.addFavourite(listingId);
                setIsFavourite(true);
                setCount(prev => prev + 1);
                onToggle?.(true);
            }
        } catch (error: any) {
            if (error.response?.status === 409) {
                // Handle conflict (e.g., user already favourited)
                setIsFavourite(true);
            } else {
                console.error("Error toggling favourite:", error);
            }
        }
    }

    return { isFavourite, toggleFavourite, loading, count, setCount };
};

const FavouriteButton = ({ listingId, onToggle }: Props) => {
    const { isFavourite, toggleFavourite, loading, count } = useFavourite(listingId);
    if (isFavourite === null) return null;
    return (
        <button onClick={(e) => {e.preventDefault(); toggleFavourite();}} className="btn p-0 border-0 bg-transparent">
              <Heart size={22} fill={isFavourite ? "red" : "none"} color={isFavourite ? "red" : "gray"} />
        </button>
    );
};
export default FavouriteButton;