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
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private loanProviders: Map<string, LoanProvider> = new Map();
  private applicants: Map<string, Applicant> = new Map();
  private loanApplications: Map<string, LoanApplication> = new Map();
  private auditLogs: Map<string, AuditLog> = new Map();

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample providers
    const provider1 = await this.createLoanProvider({
      name: "First National Bank",
      email: "contact@firstnational.com",
      phone: "+1-555-0101",
      address: "123 Banking St, Finance City, FC 12345",
      website: "https://firstnational.com",
      licenseNumber: "LIC001",
      status: "active",
      interestRateMin: "3.5",
      interestRateMax: "15.0",
      maxLoanAmount: "1000000.00"
    });

    const provider2 = await this.createLoanProvider({
      name: "Credit Union Plus",
      email: "info@creditunionplus.com",
      phone: "+1-555-0102",
      address: "456 Credit Ave, Money Town, MT 67890",
      website: "https://creditunionplus.com",
      licenseNumber: "LIC002",
      status: "active",
      interestRateMin: "3.0",
      interestRateMax: "12.0",
      maxLoanAmount: "500000.00"
    });

    // Sample applicants
    const applicant1 = await this.createApplicant({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0201",
      address: "789 Applicant St, Client City, CC 11111",
      dateOfBirth: "1985-05-15",
      ssn: "***-**-1234",
      employmentStatus: "employed",
      annualIncome: "75000.00",
      creditScore: 720
    });

    const applicant2 = await this.createApplicant({
      firstName: "Sarah",
      lastName: "Miller",
      email: "sarah.miller@example.com",
      phone: "+1-555-0202",
      address: "321 Borrower Ave, Loan City, LC 22222",
      dateOfBirth: "1990-08-22",
      ssn: "***-**-5678",
      employmentStatus: "employed",
      annualIncome: "65000.00",
      creditScore: 680
    });

    // Sample applications
    await this.createLoanApplication({
      applicantId: applicant1.id,
      providerId: provider1.id,
      loanAmount: "25000.00",
      loanPurpose: "Home improvement",
      loanTerm: 60,
      interestRate: "5.5",
      status: "pending",
      notes: "Initial application review pending"
    });

    await this.createLoanApplication({
      applicantId: applicant2.id,
      providerId: provider2.id,
      loanAmount: "15000.00",
      loanPurpose: "Debt consolidation",
      loanTerm: 36,
      interestRate: "4.8",
      status: "approved",
      notes: "Application approved after review"
    });
  }

  // Loan Providers
  async getLoanProviders(): Promise<LoanProvider[]> {
    return Array.from(this.loanProviders.values());
  }

  async getLoanProvider(id: string): Promise<LoanProvider | undefined> {
    return this.loanProviders.get(id);
  }

  async createLoanProvider(provider: InsertLoanProvider): Promise<LoanProvider> {
    const id = randomUUID();
    const newProvider: LoanProvider = {
      ...provider,
      id,
      status: provider.status || "active",
      website: provider.website || null,
      createdAt: new Date(),
    };
    this.loanProviders.set(id, newProvider);
    
    await this.createAuditLog({
      entityType: "provider",
      entityId: id,
      action: "create",
      details: `Created loan provider: ${provider.name}`,
      userId: "admin"
    });

    return newProvider;
  }

  async updateLoanProvider(id: string, provider: Partial<InsertLoanProvider>): Promise<LoanProvider | undefined> {
    const existing = this.loanProviders.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...provider };
    this.loanProviders.set(id, updated);

    await this.createAuditLog({
      entityType: "provider",
      entityId: id,
      action: "update",
      details: `Updated loan provider: ${updated.name}`,
      userId: "admin"
    });

    return updated;
  }

  async deleteLoanProvider(id: string): Promise<boolean> {
    const provider = this.loanProviders.get(id);
    if (!provider) return false;

    this.loanProviders.delete(id);

    await this.createAuditLog({
      entityType: "provider",
      entityId: id,
      action: "delete",
      details: `Deleted loan provider: ${provider.name}`,
      userId: "admin"
    });

    return true;
  }

  // Applicants
  async getApplicants(): Promise<Applicant[]> {
    return Array.from(this.applicants.values());
  }

  async getApplicant(id: string): Promise<Applicant | undefined> {
    return this.applicants.get(id);
  }

  async createApplicant(applicant: InsertApplicant): Promise<Applicant> {
    const id = randomUUID();
    const newApplicant: Applicant = {
      ...applicant,
      id,
      creditScore: applicant.creditScore || null,
      createdAt: new Date(),
    };
    this.applicants.set(id, newApplicant);

    await this.createAuditLog({
      entityType: "applicant",
      entityId: id,
      action: "create",
      details: `Created applicant: ${applicant.firstName} ${applicant.lastName}`,
      userId: "admin"
    });

    return newApplicant;
  }

  async updateApplicant(id: string, applicant: Partial<InsertApplicant>): Promise<Applicant | undefined> {
    const existing = this.applicants.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...applicant };
    this.applicants.set(id, updated);

    await this.createAuditLog({
      entityType: "applicant",
      entityId: id,
      action: "update",
      details: `Updated applicant: ${updated.firstName} ${updated.lastName}`,
      userId: "admin"
    });

    return updated;
  }

  async deleteApplicant(id: string): Promise<boolean> {
    const applicant = this.applicants.get(id);
    if (!applicant) return false;

    this.applicants.delete(id);

    await this.createAuditLog({
      entityType: "applicant",
      entityId: id,
      action: "delete",
      details: `Deleted applicant: ${applicant.firstName} ${applicant.lastName}`,
      userId: "admin"
    });

    return true;
  }

  // Loan Applications
  async getLoanApplications(): Promise<LoanApplicationWithDetails[]> {
    const applications = Array.from(this.loanApplications.values());
    return applications.map(app => ({
      ...app,
      applicant: this.applicants.get(app.applicantId)!,
      provider: this.loanProviders.get(app.providerId)!,
    }));
  }

  async getLoanApplication(id: string): Promise<LoanApplicationWithDetails | undefined> {
    const application = this.loanApplications.get(id);
    if (!application) return undefined;

    return {
      ...application,
      applicant: this.applicants.get(application.applicantId)!,
      provider: this.loanProviders.get(application.providerId)!,
    };
  }

  async createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication> {
    const id = randomUUID();
    const newApplication: LoanApplication = {
      ...application,
      id,
      status: application.status || "pending",
      interestRate: application.interestRate || null,
      notes: application.notes || null,
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    };
    this.loanApplications.set(id, newApplication);

    await this.createAuditLog({
      entityType: "application",
      entityId: id,
      action: "create",
      details: `Created loan application for amount: $${application.loanAmount}`,
      userId: "admin"
    });

    return newApplication;
  }

  async updateLoanApplication(id: string, application: Partial<InsertLoanApplication>): Promise<LoanApplication | undefined> {
    const existing = this.loanApplications.get(id);
    if (!existing) return undefined;

    const updated = { 
      ...existing, 
      ...application,
      reviewedAt: application.status && application.status !== existing.status ? new Date() : existing.reviewedAt,
      reviewedBy: application.status && application.status !== existing.status ? "admin" : existing.reviewedBy,
    };
    this.loanApplications.set(id, updated);

    await this.createAuditLog({
      entityType: "application",
      entityId: id,
      action: "update",
      details: `Updated loan application status: ${updated.status}`,
      userId: "admin"
    });

    return updated;
  }

  async deleteLoanApplication(id: string): Promise<boolean> {
    const application = this.loanApplications.get(id);
    if (!application) return false;

    this.loanApplications.delete(id);

    await this.createAuditLog({
      entityType: "application",
      entityId: id,
      action: "delete",
      details: `Deleted loan application`,
      userId: "admin"
    });

    return true;
  }

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const newLog: AuditLog = {
      ...log,
      id,
      userId: log.userId || "admin",
      timestamp: new Date(),
    };
    this.auditLogs.set(id, newLog);
    return newLog;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalApplications: number;
    approvedLoans: number;
    pendingReview: number;
    totalValue: number;
  }> {
    const applications = Array.from(this.loanApplications.values());
    
    return {
      totalApplications: applications.length,
      approvedLoans: applications.filter(app => app.status === "approved").length,
      pendingReview: applications.filter(app => app.status === "pending" || app.status === "under_review").length,
      totalValue: applications
        .filter(app => app.status === "approved")
        .reduce((sum, app) => sum + parseFloat(app.loanAmount), 0),
    };
  }
}

export const storage = new MemStorage();
