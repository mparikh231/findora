CREATE TYPE "public"."listing_statuses" AS ENUM('active', 'rejected', 'pending');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" date NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
SELECT id, email, user_name FROM users;