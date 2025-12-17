const db = require('../db/db');
const { favorites, listings } = require('../db/schema');
const { and, eq, sql } = require('drizzle-orm');

//create - Add Favourite
const addFavourite = async (req, res) => {
    try {
        const user_id = req.user.id;  // ✅ Changed from req.user_id
        const listing_id = Number(req.params.listing_id);

        if(!listing_id) {
            return res.status(400).json({ message: "Invalid listing ID" });
        }

        const existingFavourite = await db.select().from(favorites).where(and(eq(favorites.userId, user_id), eq(favorites.listingId, listing_id)));
        if (existingFavourite.length > 0) {
            return res.status(409).json({ message: "Already added to Favourites" });
        }

        await db.insert(favorites).values({
            userId: user_id,
            listingId: listing_id
        });
        return res.status(201).json({ message: "Added to Favourites" });
    } catch (error) {
        console.error("Error adding favourite:", error);
        return res.status(500).json({ message: "Failed to add to Favourites" });
    }
};

//delete - Remove Favourite
const removeFavourite = async (req, res) => {
    try {
        const user_id = req.user.id;  // ✅ Changed from req.user_id
        const listing_id = Number(req.params.listing_id);

        if (!listing_id) {
            return res.status(400).json({ message: "Invalid listing ID" });
        }

        const deleteResult = await db.delete(favorites).where(and(eq(favorites.userId, user_id), eq(favorites.listingId, listing_id))).returning();
        if (deleteResult.length === 0) {
            return res.status(404).json({ message: "Favourite not found" });
        }
        return res.status(200).json({ message: "Removed from Favourites" });
    } catch (error) {
        console.error("Error removing favourite:", error);
        return res.status(500).json({ message: "Failed to remove from Favourites" });
    }
};

//read - Get user favourites
const getUserFavourites = async (req, res) => {
    try {
        const user_id = req.user.id;  // ✅ Changed from req.user_id
        const data = await db.select({
            favoriteId: favorites.id,
            favoriteCreatedAt: favorites.createdAt,
            listingId: listings.id,
            listingTitle: listings.title,
            listingDescription: listings.description,
            listingPrice: listings.price,
        }).from(favorites).leftJoin(listings, eq(favorites.listingId, listings.id)).where(eq(favorites.userId, user_id)).orderBy(sql`favorites.created_at DESC`);
        return res.status(200).json({ data, message: "Favourites fetched successfully" });
    } catch (error) {
        console.error("Error fetching user favourites:", error);
        return res.status(500).json({ message: "Failed to fetch user favourites" });
    }
};

//read - Favourite count
const getFavouriteCount = async (req, res) => {
    try {
        const user_id = req.user.id;  // ✅ Changed from req.user_id
        const count = await db.select({ total: sql`count(*)` }).from(favorites).where(eq(favorites.userId, user_id));
        return res.status(200).json({ count: count[0].total });
    } catch (error) {
        console.error("Error fetching favourite count:", error);
        return res.status(500).json({ message: "Failed to fetch favourite count" });
    }
};

//read - Check if listing is favourite
const checkIsFavourite = async (req, res) => {
    try {
        const user_id = req.user.id;  // ✅ Changed from req.user_id
        const listing_id = Number(req.params.listing_id);
        if (!listing_id) {
            return res.status(400).json({ isFavourite: false, message: "Invalid listing ID" });
        }
        const result = await db.select({ id: favorites.id }).from(favorites).where(and(eq(favorites.userId, user_id), eq(favorites.listingId, listing_id))).limit(1);
        return res.status(200).json({ isFavourite: result.length > 0, message: "Favourite status checked successfully" });
    } catch (error) {
        console.error("Error checking if listing is favourite:", error);
        return res.status(500).json({ message: "Failed to check if listing is favourite" });
    }
};

module.exports = { addFavourite, removeFavourite, getUserFavourites, getFavouriteCount, checkIsFavourite };