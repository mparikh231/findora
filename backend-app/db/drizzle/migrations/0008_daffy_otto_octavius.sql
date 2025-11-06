ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "user_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "city_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "city_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "state_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "state_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "category_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "category_id" DROP NOT NULL;