import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userRoles = pgEnum("user_roles", ["admin", "user"]);
export const listingStatuses = pgEnum("listing_statuses", ["active", "rejected", "pending"]);

export const users = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    user_name: text("user_name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    first_name: text("first_name"),
    last_name: text("last_name"),
    role: userRoles("role").notNull().default("user"),
    status: boolean("status").notNull().default(true),
    created_at: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull().unique(),
    description: text("description"),
    parentCategoryId: integer("parent_category_id").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const states = pgTable("states", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cities = pgTable("cities", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
    stateId: integer("state_id").notNull().references(() => states.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const listings = pgTable("listings", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    price: integer("price").notNull(),
    featuredImageUrl: text("featured_image_url"),
    imageUrls: text("image_urls").array().default([]),
    isAvailable: boolean("is_available").notNull().default(true),
    status: listingStatuses("status").notNull().default("pending"),
    user_id: integer("user_id")
        .default(null)
        .references(() => users.id, { onDelete: "cascade" }),
    cityId: integer("city_id")
        .references(() => cities.id, { onDelete: "set null" }).default(null),
    stateId: integer("state_id")
        .references(() => states.id, { onDelete: "set null" }).default(null),
    categoryId: integer("category_id")
        .references(() => categories.id, { onDelete: "set null" }).default(null),
    subCategoryId: integer("sub_category_id")
        .references(() => categories.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const options = pgTable("options", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    optionKey: text("option_key").notNull().unique(),
    optionValue: text("option_value"),
});