ALTER TYPE "public"."user_userRoles" RENAME TO "user_roles";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "userRole" TO "role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT () => /* @__PURE__ */ new Date();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP DEFAULT;