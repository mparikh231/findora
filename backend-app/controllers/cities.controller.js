const db = require('../db/db');
const { cities, states } = require('../db/schema');
const { eq } = require('drizzle-orm');

const getCities = async (req, res) => {
    try {
        const { stateId } = req.query;
        const whereConditions = [];

        if (stateId && stateId !== "") {
            whereConditions.push(eq(cities.stateId, stateId));
        }

        const allCities = await db.select({
            id: cities.id,
            name: cities.name,
            stateId: cities.stateId,
            stateName: states.name,
            createdAt: cities.createdAt,
        })
            .from(cities)
            .innerJoin(states, eq(cities.stateId, states.id))
            .where(...whereConditions);
        if (!allCities || allCities.length <= 0) {
            return res.json({ status: false, message: 'No cities found' });
        }
        return res.json({ status: true, message: 'Cities fetched successfully', data: allCities });
    } catch (error) {
        console.error('Error during city fetching:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const getCity = async (req, res) => {
    try {
        const cityId = req.params.id;
        const city = await db.select({
            id: cities.id,
            name: cities.name,
            stateId: cities.stateId,
            stateName: states.name,
            createdAt: cities.createdAt,
        })
            .from(cities)
            .innerJoin(states, eq(cities.stateId, states.id))
            .where(eq(cities.id, cityId));
        return res.json({ status: true, message: 'City fetched successfully', data: city });
    } catch (error) {
        console.error('Error during city fetching:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const addCity = async (req, res) => {
    try {
        const { name, stateId } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ status: false, message: 'City name is required' });
        }

        if (!stateId || parseInt(stateId, 10) <= 0) {
            return res.status(400).json({ status: false, message: 'State ID is required' });
        }

        const newCity = await db.insert(cities).values({ name: name.trim(), stateId: parseInt(stateId) }).returning();
        if (!newCity || newCity.length <= 0) {
            return res.status(500).json({ status: false, message: 'Failed to add city' });
        }
        return res.json({ status: true, message: 'City added successfully', data: newCity });
    } catch (error) {
        console.error('Error during city addition:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const updateCity = async (req, res) => {
    try {
        const cityId = req.params.id;
        const { name, stateId } = req.body;

        if (!name && !stateId) {
            return res.status(400).json({ status: false, message: 'City name or State ID is required' });
        }

        const updateValues = {};
        if (name && name.trim() !== "") {
            updateValues.name = name.trim();
        }

        if (stateId && parseInt(stateId, 10) > 0) {
            updateValues.stateId = parseInt(stateId);
        }

        const updatedCity = await db.update(cities).set(updateValues).where(eq(cities.id, cityId)).returning();
        return res.json({ status: true, message: 'City updated successfully', data: updatedCity });
    } catch (error) {
        console.error('Error during city update:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const deleteCity = async (req, res) => {
    try {
        const cityId = req.params.id;
        await db.delete(cities).where(eq(cities.id, cityId));
        return res.json({ status: true, message: 'City deleted successfully' });
    } catch (error) {
        console.error('Error during city deletion:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

module.exports = {
    getCities,
    getCity,
    addCity,
    updateCity,
    deleteCity
};