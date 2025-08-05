import { sql } from "drizzle-orm";
import { sqliteTable, sqliteText, sqliteReal, sqliteInteger } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const loanProviders = sqliteTable("loan_providers", {
  id: sqliteText("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  name: sqliteText("name").notNull(),
  email: sqliteText("email").notNull().unique(),
  phone: sqliteText("phone").notNull(),
  address: sqliteText("address").notNull(),
  website: sqliteText("website"),
  licenseNumber: sqliteText("license_number").notNull(),
  status: sqliteText("status").notNull().default("active"), // active, inactive, suspended
  interestRateMin: sqliteReal("interest_rate_min").notNull(),
  interestRateMax: sqliteReal("interest_rate_max").notNull(),
  maxLoanAmount: sqliteReal("max_loan_amount").notNull(),
  createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).defaultNow().notNull(),
});

export const applicants = sqliteTable("applicants", {
  id: sqliteText("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  firstName: sqliteText("first_name").notNull(),
  lastName: sqliteText("last_name").notNull(),
  email: sqliteText("email").notNull().unique(),
  phone: sqliteText("phone").notNull(),
  address: sqliteText("address").notNull(),
  dateOfBirth: sqliteText("date_of_birth").notNull(),
  ssn: sqliteText("ssn").notNull(),
  employmentStatus: sqliteText("employment_status").notNull(), // employed, unemployed, self-employed, retired
  annualIncome: sqliteReal("annual_income").notNull(),
  creditScore: sqliteInteger("credit_score"),
  createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).defaultNow().notNull(),
});

export const loanApplications = sqliteTable("loan_applications", {
  id: sqliteText("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  applicantId: sqliteText("applicant_id").notNull().references(() => applicants.id),
  providerId: sqliteText("provider_id").notNull().references(() => loanProviders.id),
  loanAmount: sqliteReal("loan_amount").notNull(),
  loanPurpose: sqliteText("loan_purpose").notNull(),
  loanTerm: sqliteInteger("loan_term").notNull(), // in months
  interestRate: sqliteReal("interest_rate"),
  status: sqliteText("status").notNull().default("pending"), // pending, approved, rejected, under_review
  notes: sqliteText("notes"),
  submittedAt: sqliteInteger("submitted_at", { mode: 'timestamp' }).defaultNow().notNull(),
  reviewedAt: sqliteInteger("reviewed_at", { mode: 'timestamp' }),
  reviewedBy: sqliteText("reviewed_by"),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: sqliteText("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  entityType: sqliteText("entity_type").notNull(), // provider, applicant, application
  entityId: sqliteText("entity_id").notNull(),
  action: sqliteText("action").notNull(), // create, update, delete, view
  details: sqliteText("details").notNull(),
  userId: sqliteText("user_id").notNull().default("admin"),
  timestamp: sqliteInteger("timestamp", { mode: 'timestamp' }).defaultNow().notNull(),
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