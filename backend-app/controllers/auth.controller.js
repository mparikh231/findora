const db = require('../db/db');
const { users } = require('../db/schema');
const { and, eq } = require('drizzle-orm');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const strToMd5 = (str) => {
    return crypto.createHash('md5').update(str).digest('hex');
}

const signIn = async (req, res) => {
    try {
        const { email } = req.body;
        const password = (req.body.password ?? "").toString().trim();
        const computed = strToMd5(password);

        // validate input
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }

        // check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: false, message: 'Invalid email format' });
        }

        // validate user details
        const userData = await db.select({
            id: users.id,
            password: users.password,
            role: users.role
        }).from(users).where(and(eq(users.email, email))).limit(1);

        if (!userData || userData.length <= 0) {
            return res.status(409).json({ status: false, message: 'User is not existing' });
        }

        // after fetching userData
            console.log("DB stored password:", userData[0].password);
            const providedHash = strToMd5(password.trim());
            console.log("Provided password (trimmed):", password.trim());
            console.log("Provided password MD5:", providedHash);

        if (userData[0].password !== providedHash) {
            return res.status(401).json({ status: false, message: 'Incorrect password' });
        }

        // generate JWT token
        const tokenExpiry = Math.floor(Date.now() / 1000) + (2 * 60 * 60); // 2 hours from now
        const payload = {
            userId: userData[0].id,
            email: email,
            userRole: userData[0].role
        };
        const token = jwt.sign(payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: tokenExpiry }
        );

        res.json({ status: true, message: 'User signed in successfully', token });
    } catch (error) {
        console.error('Error during sign-in:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const signUp = async (req, res) => {
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

        res.json({ status: true, message: 'User signed up successfully', userData: newUser });
    } catch (error) {
        console.error('Error during sign-up:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

module.exports = {
    signIn,
    signUp
};