CREATE TABLE "waitlist_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"team_type" text NOT NULL,
	"biggest_failure_mode" text NOT NULL,
	"referral_code" text NOT NULL,
	"dashboard_token" text NOT NULL,
	"referred_by_id" text,
	"email_verification_token_hash" text,
	"email_verification_expires_at" timestamp with time zone,
	"email_verified_at" timestamp with time zone,
	"verified_referral_count" integer DEFAULT 0 NOT NULL,
	"priority_unlocked_at" timestamp with time zone,
	"priority_notified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_referred_by_id_waitlist_entries_id_fk" FOREIGN KEY ("referred_by_id") REFERENCES "public"."waitlist_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_entries_dashboard_token_idx" ON "waitlist_entries" USING btree ("dashboard_token");--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_entries_email_idx" ON "waitlist_entries" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_entries_referral_code_idx" ON "waitlist_entries" USING btree ("referral_code");--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_entries_verification_token_idx" ON "waitlist_entries" USING btree ("email_verification_token_hash");