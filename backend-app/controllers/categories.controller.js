const db = require('../db/db');
const { categories } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

const getCategories = async (req, res) => {
    try {
        const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));
        if (!allCategories || allCategories.length === 0) {
           return res.json({status: false, message: "No categories found" });
        }
        const categoriesData = [];
        allCategories.forEach(cat => {
            const categoryObj = {
                id: cat.id,
                name: cat.name,
                description: cat.description,
                parentCategoryId: cat.parentCategoryId,
                subCategories: [],
                createdAt: cat.createdAt
            };
            if (cat.parentCategoryId === 0) {
                const childCategory = allCategories.filter(childCat => childCat.parentCategoryId === cat.id);
                console.log("childCategory:", childCategory);

                if (childCategory) {
                    categoryObj.subCategories.push(...childCategory);
                }
                categoriesData.push(categoryObj);
            }
        });
        return res.json({status: true, message: 'Categories fetched successfully', categoriesData });
    }catch(error){
        console.error("Error fetching categories:", error);
        res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const getCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await db.select().from(categories).where(eq(categories.id, categoryId));
        if (!category || category.length <= 0) {
            return res.status(404).json({ status: false, message: 'Category not found' });
        }

        if (category[0].parentCategoryId !== 0) {
            const parentCategory = await db.select().from(categories).where(eq(categories.id, category[0].parentCategoryId));
            category[0].parentCategory = parentCategory.length > 0 ? parentCategory[0] : null;
        } else {
            const childCategory = await db.select().from(categories).where(eq(categories.parentCategoryId, category[0].id));
            category[0].childCategory = childCategory.length > 0 ? childCategory : null;
        }

        return res.json({ status: true, message: 'Category fetched successfully', categoryData: category[0] });
    } catch (error) {
        console.error('Error during category fetching:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const addCategory = async (req, res) => {
    try {
        const { name, description, parentId = 0 } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ status: false, message: 'Category name is required' });
        }
        const newCategory = await db.insert(categories).values({ name: name.trim(), description: description.trim(), parentCategoryId: parentId }).returning();
        if (!newCategory || newCategory.length <= 0) {
            return res.status(500).json({ status: false, message: 'Failed to add category' });
        }
        return res.json({ status: true, message: 'Category added successfully', categoryData: newCategory });
    } catch (error) {
        console.error('Error during category addition:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description, parentId } = req.body;
        if (name && name.trim() === "") {
            return res.status(400).json({ status: false, message: 'Category name is required' });
        }

        const updateData = {};
        if (name && name.trim() !== "") updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (parentId !== undefined) updateData.parentCategoryId = parentId;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ status: false, message: 'No data provided for update' });
        }

        const updatedCategory = await db.update(categories).set(updateData).where(eq(categories.id, categoryId)).returning();
        return res.json({ status: true, message: 'Category updated successfully', categoryData: updatedCategory });
    } catch (error) {
        console.error('Error during category update:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        // await db.delete(categories).where(eq(categories.id, categoryId));
        return res.json({ status: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error during category deletion:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
}

module.exports = {
    getCategories,
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory
}; 