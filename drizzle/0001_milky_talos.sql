ALTER TABLE "payment_history" ALTER COLUMN "payment_method" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_slug_unique" UNIQUE("slug");