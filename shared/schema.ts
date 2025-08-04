import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const loanProviders = pgTable("loan_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  website: text("website"),
  licenseNumber: text("license_number").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, suspended
  interestRateMin: decimal("interest_rate_min", { precision: 5, scale: 2 }).notNull(),
  interestRateMax: decimal("interest_rate_max", { precision: 5, scale: 2 }).notNull(),
  maxLoanAmount: decimal("max_loan_amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applicants = pgTable("applicants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  ssn: text("ssn").notNull(),
  employmentStatus: text("employment_status").notNull(), // employed, unemployed, self-employed, retired
  annualIncome: decimal("annual_income", { precision: 12, scale: 2 }).notNull(),
  creditScore: integer("credit_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantId: varchar("applicant_id").notNull().references(() => applicants.id),
  providerId: varchar("provider_id").notNull().references(() => loanProviders.id),
  loanAmount: decimal("loan_amount", { precision: 12, scale: 2 }).notNull(),
  loanPurpose: text("loan_purpose").notNull(),
  loanTerm: integer("loan_term").notNull(), // in months
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, under_review
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by"),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(), // provider, applicant, application
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(), // create, update, delete, view
  details: text("details").notNull(),
  userId: text("user_id").notNull().default("admin"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertLoanProviderSchema = createInsertSchema(loanProviders).omit({
  id: true,
  createdAt: true,
});

export const insertApplicantSchema = createInsertSchema(applicants).omit({
  id: true,
  createdAt: true,
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

// Types
export type LoanProvider = typeof loanProviders.$inferSelect;
export type InsertLoanProvider = z.infer<typeof insertLoanProviderSchema>;

export type Applicant = typeof applicants.$inferSelect;
export type InsertApplicant = z.infer<typeof insertApplicantSchema>;

export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// Extended types for joined data
export type LoanApplicationWithDetails = LoanApplication & {
  applicant: Applicant;
  provider: LoanProvider;
};
