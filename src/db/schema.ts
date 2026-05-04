import { relations } from "drizzle-orm"
import {
  type AnyPgColumn,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const waitlistEntries = pgTable(
  "waitlist_entries",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    role: text("role").notNull(),
    teamType: text("team_type").notNull(),
    biggestFailureMode: text("biggest_failure_mode").notNull(),
    referralCode: text("referral_code").notNull(),
    dashboardToken: text("dashboard_token").notNull(),
    referredById: text("referred_by_id").references((): AnyPgColumn => waitlistEntries.id, {
      onDelete: "set null",
    }),
    emailVerificationTokenHash: text("email_verification_token_hash"),
    emailVerificationExpiresAt: timestamp("email_verification_expires_at", {
      mode: "date",
      withTimezone: true,
    }),
    emailVerifiedAt: timestamp("email_verified_at", {
      mode: "date",
      withTimezone: true,
    }),
    verifiedReferralCount: integer("verified_referral_count").notNull().default(0),
    priorityUnlockedAt: timestamp("priority_unlocked_at", {
      mode: "date",
      withTimezone: true,
    }),
    priorityNotifiedAt: timestamp("priority_notified_at", {
      mode: "date",
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    dashboardTokenIdx: uniqueIndex("waitlist_entries_dashboard_token_idx").on(table.dashboardToken),
    emailIdx: uniqueIndex("waitlist_entries_email_idx").on(table.email),
    referralCodeIdx: uniqueIndex("waitlist_entries_referral_code_idx").on(table.referralCode),
    verificationTokenIdx: uniqueIndex("waitlist_entries_verification_token_idx").on(
      table.emailVerificationTokenHash,
    ),
  }),
)

export const waitlistEntryRelations = relations(waitlistEntries, ({ one }) => ({
  referrer: one(waitlistEntries, {
    fields: [waitlistEntries.referredById],
    references: [waitlistEntries.id],
    relationName: "waitlist_referrer",
  }),
}))

export type WaitlistEntry = typeof waitlistEntries.$inferSelect
export type NewWaitlistEntry = typeof waitlistEntries.$inferInsert
