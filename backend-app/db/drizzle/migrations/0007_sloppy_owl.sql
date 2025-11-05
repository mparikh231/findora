ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
ALTER TABLE "users" RENAME COLUMN "userRole" TO "role";
