import { sql } from "drizzle-orm";
import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const loanProviders = sqliteTable("loan_providers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  website: text("website"),
  licenseNumber: text("license_number").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, suspended
  interestRateMin: real("interest_rate_min").notNull(),
  interestRateMax: real("interest_rate_max").notNull(),
  maxLoanAmount: real("max_loan_amount").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const applicants = sqliteTable("applicants", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  ssn: text("ssn").notNull(),
  employmentStatus: text("employment_status").notNull(), // employed, unemployed, self-employed, retired
  annualIncome: real("annual_income").notNull(),
  creditScore: integer("credit_score"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const loanApplications = sqliteTable("loan_applications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  applicantId: text("applicant_id").notNull().references(() => applicants.id),
  providerId: text("provider_id").notNull().references(() => loanProviders.id),
  loanAmount: real("loan_amount").notNull(),
  loanPurpose: text("loan_purpose").notNull(),
  loanTerm: integer("loan_term").notNull(), // in months
  interestRate: real("interest_rate"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, under_review
  notes: text("notes"),
  submittedAt: integer("submitted_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  reviewedAt: integer("reviewed_at", { mode: 'timestamp' }),
  reviewedBy: text("reviewed_by"),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityType: text("entity_type").notNull(), // provider, applicant, application
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(), // create, update, delete, view
  details: text("details").notNull(),
  userId: text("user_id").notNull().default("admin"),
  timestamp: integer("timestamp", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
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

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
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

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Extended types for joined data
export type LoanApplicationWithDetails = LoanApplication & {
  applicant: Applicant;
  provider: LoanProvider;
};
