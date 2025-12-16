ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_listing_id_listings_id_fk";
--> statement-breakpoint
DROP INDEX "favorites_user_listing_unique";--> statement-breakpoint
ALTER TABLE "favorites" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_listing_id_unique" UNIQUE("user_id","listing_id");