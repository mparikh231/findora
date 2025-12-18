import { useEffect, useState } from "react";
import * as favService from "../utils/favourite.service";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

interface Props {
    listingId: number;
    onFavouriteChange?: (isFavourite: boolean) => void;
}

export const useFavourite = (listingId: number) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState<number>(0);

    // Fetch favorite status for a specific listing
    const fetchFavouriteStatus = async (id: number) => {
        if (!id || id <= 0) {
            setIsFavourite(false);
            setLoading(false);
            return;
        }
        try {
            const res = await favService.checkFavourite(id);
            setIsFavourite(res.isFavourite);
        } catch (error) {
            setIsFavourite(false);
        } finally {
            setLoading(false);
        }
    };

    // Fetch favorite count from backend
    const fetchFavouriteCount = async () => {
        try {
            const res = await favService.getFavouriteCount();
            setCount(res.count);
        } catch (error) {
            console.error("Error fetching favorite count:", error);
        }
    };

    useEffect(() => {
        if (listingId > 0) {
            fetchFavouriteStatus(listingId);
        } else {
            // If listingId is 0, just fetch count (for navbar)
            fetchFavouriteCount();
        }
    }, [listingId]);

    const toggleFavourite = async () => {
        if (isFavourite === null) return null;
        try {
            if (isFavourite) {
                await favService.removeFavourite(listingId);
                toast.success("Removed from favourites");
                setIsFavourite(false);
            } else {
                await favService.addFavourite(listingId);
                toast.success("Added to favourites");
                setIsFavourite(true);
            }
            // Refresh count after toggling
            await fetchFavouriteCount();
        } catch (error: any) {
            if (error.response?.status === 409) {
                setIsFavourite(true);
            }
        }
    };

    return { isFavourite, toggleFavourite, loading, count, setCount, fetchFavouriteStatus, fetchFavouriteCount };
};

const FavouriteButton = ({ listingId, onFavouriteChange }: Props) => {
    const { isFavourite, toggleFavourite, loading } = useFavourite(listingId);
    
    const handleToggle = async () => {
        await toggleFavourite();
        if (onFavouriteChange) {
            onFavouriteChange(!isFavourite);
        }
    };

    if (isFavourite === null) return null;
    
    return (
        <button 
            onClick={(e) => { e.preventDefault(); handleToggle(); }} 
            className="btn p-0 border-0 bg-transparent"
            disabled={loading}
        >
            <Heart 
                size={22} 
                fill={isFavourite ? "red" : "none"} 
                color={isFavourite ? "red" : "gray"} 
            />
        </button>
    );
};
export default FavouriteButton;