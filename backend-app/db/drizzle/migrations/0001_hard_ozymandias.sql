CREATE TABLE "listings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "listings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"price" integer NOT NULL,
	"featured_image_url" text,
	"image_urls" text[] DEFAULT '{}',
	"is_available" boolean DEFAULT true NOT NULL,
	"status" "listing_statuses" DEFAULT 'pending' NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" date NOT NULL,
	"updated_at" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;