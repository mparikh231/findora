const db = require('../db/db');
const { listings } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

const getListings = async (req, res) => {
    try {
        const listingData = await db.select().from(listings).orderBy(desc(listings.id));
        res.json({ status: true, message: 'Listings retrieved successfully', listingData });
    } catch (error) {
        console.error('Error during listing retrieval:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const getListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listingData = await db.select().from(listings).where(eq(listings.id, listingId)).limit(1);
        if (!listingData || listingData.length <= 0) {
            return res.status(404).json({ status: false, message: 'Listing not found' });
        }
        return res.json({ status: true, message: 'Listing retrieved successfully', listingData: listingData[0] });
    } catch (error) {
        console.error('Error during listing retrieval:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const addListing = async (req, res) => {
    try {
        const { title, description, price, location, isAvailable, status, userId } = req.body;

        // Basic validation
        if (!title || !description || !price || !location) {
            return res.status(400).json({ status: false, message: 'Title, description, price, and location are required' });
        }

        // sanitize inputs
        const sanitizedTitle = String(title).trim();
        const sanitizedDescription = String(description).trim();
        const sanitizedLocation = String(location).trim();
        const sanitizedPrice = parseFloat(price, 10);
        const sanitizedIsAvailable = typeof isAvailable !== 'undefined' ? (isAvailable === 'true' || isAvailable === true || isAvailable === 1 || isAvailable === "1" ? true : false) : true;
        let sanitizedStatus = 'pending';
        const sanitizedUserId = (req.userRole === 'admin' && userId) ? userId : req.userId;

        if (status && req.userRole === 'admin') {
            const validStatuses = ['active', 'rejected', 'pending'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ status: false, message: 'Invalid status value' });
            }
            sanitizedStatus = status;
        }

        const newListing = await db.insert(listings).values({
            title: sanitizedTitle,
            description: sanitizedDescription,
            price: sanitizedPrice,
            location: sanitizedLocation,
            isAvailable: sanitizedIsAvailable,
            status: sanitizedStatus,
            userId: sanitizedUserId
        }).returning();

        if (!newListing || newListing.length <= 0) {
            return res.status(500).json({ status: false, message: 'Failed to add listing' });
        }

        res.json({ status: true, message: 'Listing added successfully', listingData: newListing[0] });
    } catch (error) {
        console.error('Error during listing addition:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const updateListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        return res.json({ status: true, message: 'Listing updated successfully', listingData: {} });
    } catch (error) {
        console.error('Error during listing update:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const deleteListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const deletedCount = await db.delete(listings).where(eq(listings.id, listingId)).returning().then(result => result.length);
        if (deletedCount === 0) {
            return res.status(404).json({ status: false, message: 'Listing not found' });
        }
        return res.json({ status: true, message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error during listing deletion:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

module.exports = {
    getListings,
    getListing,
    addListing,
    updateListing,
    deleteListing
};