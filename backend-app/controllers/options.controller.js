const db = require('../db/db');
const { options } = require('../db/schema');
const { eq } = require('drizzle-orm');

const getOption = async (req, res) => {
    try {
        const { key } = req.params;
        const option = await db.select().from(options).where(eq(options.optionKey, key)).limit(1);
        
        if (!option || option.length <= 0) {
            return res.status(404).json({ status: false, message: 'Option not found' });
        }

        return res.json({ status: true, message: 'Option fetched successfully', data: option[0] });
    } catch (error) {
        console.error('Error during option fetching:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
};

const getAllOptions = async (req, res) => {
    try {
        const allOptions = await db.select().from(options);
        
        if (!allOptions || allOptions.length <= 0) {
            return res.json({ status: false, message: 'No options found' });
        }

        return res.json({ status: true, message: 'Options fetched successfully', data: allOptions });
    } catch (error) {
        console.error('Error during options fetching:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
};

const createOrUpdateOption = async (req, res) => {
    try {
        const { optionKey, optionValue } = req.body;
        const { key } = req.params;

        // Determine the key to use (from params or body)
        const finalKey = key || optionKey;

        if (!finalKey || finalKey.trim() === '') {
            return res.status(400).json({ status: false, message: 'Option key is required' });
        }

        // Validate option key format (alphanumeric and underscores only)
        const keyRegex = /^[a-z0-9_]+$/;
        if (!keyRegex.test(finalKey)) {
            return res.status(400).json({ 
                status: false, 
                message: 'Option key must contain only lowercase letters, numbers, and underscores' 
            });
        }

        // Validate JSON if it's navigation_menu
        if (finalKey === 'navigation_menu' && optionValue) {
            try {
                const parsedValue = JSON.parse(optionValue);
                if (!parsedValue.items || !Array.isArray(parsedValue.items)) {
                    return res.status(400).json({ 
                        status: false, 
                        message: 'Invalid navigation menu structure. Expected { items: [...] }' 
                    });
                }
            } catch (jsonError) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Invalid JSON format for option value' 
                });
            }
        }

        // Check if option exists
        const existingOption = await db.select().from(options).where(eq(options.optionKey, finalKey)).limit(1);

        let result;
        if (existingOption.length > 0) {
            // Update existing option
            result = await db
                .update(options)
                .set({ optionValue: optionValue || null })
                .where(eq(options.optionKey, finalKey))
                .returning();
            
            return res.json({ 
                status: true, 
                message: 'Option updated successfully', 
                data: result[0] 
            });
        } else {
            // Create new option
            result = await db
                .insert(options)
                .values({
                    optionKey: finalKey,
                    optionValue: optionValue || null
                })
                .returning();
            
            return res.status(201).json({ 
                status: true, 
                message: 'Option created successfully', 
                data: result[0] 
            });
        }
    } catch (error) {
        console.error('Error during option creation/update:', error);
        
        // Handle unique constraint violation
        if (error.code === '23505') {
            return res.status(409).json({ 
                status: false, 
                message: 'Option with this key already exists' 
            });
        }
        
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
};

const deleteOption = async (req, res) => {
    try {
        const { key } = req.params;

        if (!key || key.trim() === '') {
            return res.status(400).json({ status: false, message: 'Option key is required' });
        }

        // Check if option exists
        const existingOption = await db.select().from(options).where(eq(options.optionKey, key)).limit(1);

        if (!existingOption || existingOption.length <= 0) {
            return res.status(404).json({ status: false, message: 'Option not found' });
        }

        // Delete the option
        await db.delete(options).where(eq(options.optionKey, key));

        return res.json({ status: true, message: 'Option deleted successfully' });
    } catch (error) {
        console.error('Error during option deletion:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
};

module.exports = {
    getOption,
    getAllOptions,
    createOrUpdateOption,
    deleteOption
};