ALTER TABLE "payment_history" DROP CONSTRAINT "payment_history_order_id_unique";--> statement-breakpoint
ALTER TABLE "payment_history" RENAME COLUMN "order_id" TO "transaction_id";--> statement-breakpoint
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_transaction_id_unique" UNIQUE("transaction_id");--> statement-breakpoint
ALTER TABLE "payment_history" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TABLE "site_sections";--> statement-breakpoint
