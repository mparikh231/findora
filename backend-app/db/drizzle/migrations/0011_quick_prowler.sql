CREATE TABLE IF NOT EXISTS "options" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "options_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"option_key" text NOT NULL,
	"option_value" text,
	CONSTRAINT "options_option_key_unique" UNIQUE("option_key")
);
