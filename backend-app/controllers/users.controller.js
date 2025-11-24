const db = require('../db/db');
const { users } = require('../db/schema');
const { eq, desc, and } = require('drizzle-orm');
const crypto = require('crypto');

const strToMd5 = (str) => {
    return crypto.createHash('md5').update(str).digest('hex');
}

const getUsers = async (req, res) => {
    try {

        const { email, role, user_name } = req.query;
        const whereConditions = [];
        if (role) {
            whereConditions.push(eq(users.role, role));
        }
        if (email) {
            whereConditions.push(eq(users.email, email));
        }
        if (user_name) {
            whereConditions.push(eq(users.user_name, user_name));
        }
        const userData = await db.select().from(users).where(whereConditions.length > 0 ? and(...whereConditions) : undefined).orderBy(desc(users.id));

        if (!userData || userData.length <= 0) {
            return res.status(404).json({ status: false, message: 'No users found' });
        }

        res.json({ status: true, message: 'User list retrieved successfully', userData });
    } catch (error) {
        console.error('Error during user retrieval:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.params.id || req.userId;
        const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData || userData.length <= 0) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        return res.json({ status: true, message: 'User retrieved successfully', userData: userData[0] });
    } catch (error) {
        console.error('Error during user retrieval:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const addUser = async (req, res) => {
    try {
        // get user details from request body
        const { user_name, email, password, first_name, last_name } = req.body;

        // validate input
        if (!user_name || !email || !password) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }

        // check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: false, message: 'Invalid email format' });
        }

        // validate user details
        const userData = await db.select({
            id: users.id
        }).from(users).where(eq(users.email, email));
        if (userData.length > 0) {
            return res.status(409).json({ status: false, message: 'Email already in use' });
        }

        // create new user in database
        const newUser = await db.insert(users).values({
            user_name: user_name,
            email: email,
            password: strToMd5(password),
            first_name: first_name,
            last_name: last_name
        }).returning();

        if (newUser.length === 0) {
            return res.status(500).json({ status: false, message: 'Failed to create user' });
        }

        res.json({ status: true, message: 'User added successfully', userData: newUser });
    } catch (error) {
        console.error('Error during user addition:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id || req.userId;
        const { email, password, first_name, last_name, status, userRole } = req.body;
        const md5Password = (password && password !== "") ? strToMd5(password) : null;

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return res.status(400).json({ status: false, message: 'Invalid email format' });
        }

        const updateData = {};
        if (email) updateData.email = email;
        if (md5Password) updateData.password = md5Password;
        if (first_name) updateData.first_name = first_name;
        if (last_name) updateData.last_name = last_name;
        if (req.role === 'admin') {
            if (status && status !== "") updateData.status = (status === "true" || status === true || status === "1") ? true : false;
            if (role && (role === "admin" || role === "user")) updateData.role = role;
        }
        const updatedUser = await db.update(users).set(updateData).where(eq(users.id, userId)).returning();
        if (updatedUser.length === 0) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        return res.json({ status: true, message: 'User updated successfully', userData: updatedUser[0] });
    } catch (error) {
        console.error('Error during user update:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedCount = await db.delete(users).where(eq(users.id, userId)).returning().then(result => result.length);
        if (deletedCount === 0) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        return res.json({ status: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error during user deletion:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
};