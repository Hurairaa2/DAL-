import { apiRequest } from "./queryClient";
import type { 
  LoanProvider, 
  InsertLoanProvider,
  Applicant,
  InsertApplicant,
  LoanApplication,
  InsertLoanApplication,
  LoanApplicationWithDetails,
  AuditLog
} from "@shared/schema";

// Loan Providers API
export const loanProvidersApi = {
  getAll: (): Promise<LoanProvider[]> =>
    apiRequest("GET", "/api/loan-providers").then(res => res.json()),

  getById: (id: string): Promise<LoanProvider> =>
    apiRequest("GET", `/api/loan-providers/${id}`).then(res => res.json()),

  create: (data: InsertLoanProvider): Promise<LoanProvider> =>
    apiRequest("POST", "/api/loan-providers", data).then(res => res.json()),

  update: (id: string, data: Partial<InsertLoanProvider>): Promise<LoanProvider> =>
    apiRequest("PUT", `/api/loan-providers/${id}`, data).then(res => res.json()),

  delete: (id: string): Promise<void> =>
    apiRequest("DELETE", `/api/loan-providers/${id}`).then(() => {}),
};

// Applicants API
export const applicantsApi = {
  getAll: (): Promise<Applicant[]> =>
    apiRequest("GET", "/api/applicants").then(res => res.json()),

  getById: (id: string): Promise<Applicant> =>
    apiRequest("GET", `/api/applicants/${id}`).then(res => res.json()),

  create: (data: InsertApplicant): Promise<Applicant> =>
    apiRequest("POST", "/api/applicants", data).then(res => res.json()),

  update: (id: string, data: Partial<InsertApplicant>): Promise<Applicant> =>
    apiRequest("PUT", `/api/applicants/${id}`, data).then(res => res.json()),

  delete: (id: string): Promise<void> =>
    apiRequest("DELETE", `/api/applicants/${id}`).then(() => {}),
};

// Loan Applications API
export const loanApplicationsApi = {
  getAll: (): Promise<LoanApplicationWithDetails[]> =>
    apiRequest("GET", "/api/loan-applications").then(res => res.json()),

  getById: (id: string): Promise<LoanApplicationWithDetails> =>
    apiRequest("GET", `/api/loan-applications/${id}`).then(res => res.json()),

  create: (data: InsertLoanApplication): Promise<LoanApplication> =>
    apiRequest("POST", "/api/loan-applications", data).then(res => res.json()),

  update: (id: string, data: Partial<InsertLoanApplication>): Promise<LoanApplication> =>
    apiRequest("PUT", `/api/loan-applications/${id}`, data).then(res => res.json()),

  delete: (id: string): Promise<void> =>
    apiRequest("DELETE", `/api/loan-applications/${id}`).then(() => {}),
};

// Audit Logs API
export const auditLogsApi = {
  getAll: (): Promise<AuditLog[]> =>
    apiRequest("GET", "/api/audit-logs").then(res => res.json()),
};

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<{
    totalApplications: number;
    approvedLoans: number;
    pendingReview: number;
    totalValue: number;
  }> =>
    apiRequest("GET", "/api/dashboard/stats").then(res => res.json()),
};
