const { inArray } = require('drizzle-orm');
const db = require('../db/db');
const { states, cities, listings } = require('../db/schema');
const { eq, or } = require('drizzle-orm');

const getStates = async (req, res) => {
    try {
        const allStates = await db.select().from(states);
        if (!allStates || allStates.length <= 0) {
            return res.json({ status: false, message: 'No states found' });
        }
        return res.json({ status: true, message: 'States fetched successfully', data: allStates });
    } catch (error) {
        console.error('Error during state fetching:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const getState = async (req, res) => {
    try {
        const stateId = req.params.id;
        const state = await db.select().from(states).where(eq(states.id, stateId));
        return res.json({ status: true, message: 'State fetched successfully', data: state });
    } catch (error) {
        console.error('Error during state fetching:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const addState = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ status: false, message: 'State name is required' });
        }
        const newState = await db.insert(states).values({ name: name.trim() }).returning();
        if (!newState || newState.length <= 0) {
            return res.status(500).json({ status: false, message: 'Failed to add state' });
        }
        return res.json({ status: true, message: 'State added successfully', data: newState });
    } catch (error) {
        console.error('Error during state addition:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const updateState = async (req, res) => {
    try {
        const stateId = req.params.id;
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ status: false, message: 'State name is required' });
        }
        const updatedState = await db.update(states).set({ name: name.trim() }).where(eq(states.id, stateId)).returning();
        return res.json({ status: true, message: 'State updated successfully', data: updatedState });
    } catch (error) {
        console.error('Error during state update:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const deleteState = async (req, res) => {
    try {
        const stateId = req.params.id;
        const citiesInState = await db.select({
            id: cities.id
        }).from(cities).where(eq(cities.stateId, stateId));

        await db.delete(listings).where(or(
            eq(listings.stateId, stateId),
            (citiesInState && citiesInState.length > 0) ? inArray(listings.cityId, citiesInState.map(city => city.id)) : false
        ));
        await db.delete(cities).where(eq(cities.stateId, stateId));
        await db.delete(states).where(eq(states.id, stateId));
        return res.json({ status: true, message: 'State deleted successfully' });
    } catch (error) {
        console.error('Error during state deletion:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

module.exports = {
    getStates,
    getState,
    addState,
    updateState,
    deleteState
};