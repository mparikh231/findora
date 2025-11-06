const db = require('../db/db');
const { listings, users, categories, states, cities } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

const getListings = async (req, res) => {
    try {
        const listingData = await db.select({
            id: listings.id,
            title: listings.title,
            description: listings.description,
            location: listings.location,
            price: listings.price,
            featuredImageUrl: listings.featuredImageUrl,
            imageUrls: listings.imageUrls,
            isAvailable: listings.isAvailable,
            status: listings.status,
            user: {
                id: users.id,
                userName: users.userName,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
            },
            category: {
                id: categories.id,
                name: categories.name,
                description: categories.description,
                parentCategoryId: categories.parentCategoryId,
            },
            state: {
                id: states.id,
                name: states.name,
            },
            city: {
                id: cities.id,
                name: cities.name,
            },
            createdAt: listings.createdAt,
            updatedAt: listings.updatedAt,
        })
            .from(listings)
            .leftJoin(users, eq(listings.userId, users.id))
            .leftJoin(categories, eq(listings.categoryId, categories.id))
            .leftJoin(states, eq(listings.stateId, states.id))
            .leftJoin(cities, eq(listings.cityId, cities.id))
            .orderBy(desc(listings.id));
        res.json({ status: true, message: 'Listings retrieved successfully', listingData });
    } catch (error) {
        console.error('Error during listing retrieval:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const getListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listingData = await await db.select({
            id: listings.id,
            title: listings.title,
            description: listings.description,
            location: listings.location,
            price: listings.price,
            featuredImageUrl: listings.featuredImageUrl,
            imageUrls: listings.imageUrls,
            isAvailable: listings.isAvailable,
            status: listings.status,
            user: {
                id: users.id,
                userName: users.userName,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
            },
            category: {
                id: categories.id,
                name: categories.name,
                description: categories.description,
                parentCategoryId: categories.parentCategoryId,
            },
            state: {
                id: states.id,
                name: states.name,
            },
            city: {
                id: cities.id,
                name: cities.name,
            },
            createdAt: listings.createdAt,
            updatedAt: listings.updatedAt,
        })
            .from(listings)
            .leftJoin(users, eq(listings.userId, users.id))
            .leftJoin(categories, eq(listings.categoryId, categories.id))
            .leftJoin(states, eq(listings.stateId, states.id))
            .leftJoin(cities, eq(listings.cityId, cities.id))
            .where(eq(listings.id, listingId))
            .limit(1);
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
        const { title, description, price, location, isAvailable, status, categoryId, subCategoryId, stateId, cityId, userId } = req.body;

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
            userId: sanitizedUserId,
            categoryId,
            subCategoryId,
            stateId,
            cityId
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
        const { title, description, price, location, isAvailable, status, categoryId, subCategoryId, stateId, cityId, userId } = req.body;

        const updateData = {};
        if (title && title.trim() !== '') updateData.title = String(title).trim();
        if (description && description.trim() !== '') updateData.description = String(description).trim();
        if (price) updateData.price = parseFloat(price, 10);
        if (location && location.trim() !== '') updateData.location = String(location).trim();
        if (typeof isAvailable !== "undefined") updateData.isAvailable = (isAvailable === 'true' || isAvailable === true || isAvailable === 1 || isAvailable === "1" ? true : false);
        if (categoryId) updateData.categoryId = categoryId;
        if (subCategoryId) updateData.subCategoryId = subCategoryId;
        if (stateId) updateData.stateId = stateId;
        if (cityId) updateData.cityId = cityId;
        if (req.userRole === 'admin' && userId) updateData.userId = userId;
        if (status && req.userRole === 'admin') {
            const validStatuses = ['active', 'rejected', 'pending'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ status: false, message: 'Invalid status value' });
            }
            updateData.status = status;
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ status: false, message: 'No valid fields provided for update' });
        }
        updateData.updatedAt = new Date();
        const updatedListing = await db.update(listings).set(updateData).where(eq(listings.id, listingId)).returning();

        return res.json({ status: true, message: 'Listing updated successfully', listingData: updatedListing[0] });
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