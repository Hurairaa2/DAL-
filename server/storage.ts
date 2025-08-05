import { 
  type LoanProvider, 
  type InsertLoanProvider,
  type Applicant,
  type InsertApplicant,
  type LoanApplication,
  type InsertLoanApplication,
  type AuditLog,
  type InsertAuditLog,
  type LoanApplicationWithDetails
} from "@shared/schema";
import { PostgresStorage } from "./postgres-storage";

export interface IStorage {
  // Loan Providers
  getLoanProviders(): Promise<LoanProvider[]>;
  getLoanProvider(id: string): Promise<LoanProvider | undefined>;
  createLoanProvider(provider: InsertLoanProvider): Promise<LoanProvider>;
  updateLoanProvider(id: string, provider: Partial<InsertLoanProvider>): Promise<LoanProvider | undefined>;
  deleteLoanProvider(id: string): Promise<boolean>;

  // Applicants
  getApplicants(): Promise<Applicant[]>;
  getApplicant(id: string): Promise<Applicant | undefined>;
  createApplicant(applicant: InsertApplicant): Promise<Applicant>;
  updateApplicant(id: string, applicant: Partial<InsertApplicant>): Promise<Applicant | undefined>;
  deleteApplicant(id: string): Promise<boolean>;

  // Loan Applications
  getLoanApplications(): Promise<LoanApplicationWithDetails[]>;
  getLoanApplication(id: string): Promise<LoanApplicationWithDetails | undefined>;
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  updateLoanApplication(id: string, application: Partial<InsertLoanApplication>): Promise<LoanApplication | undefined>;
  deleteLoanApplication(id: string): Promise<boolean>;

  // Audit Logs
  getAuditLogs(): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalApplications: number;
    approvedLoans: number;
    pendingReview: number;
    totalValue: number;
  }>;
}

// Use PostgreSQL storage by default
export const storage = new PostgresStorage();
