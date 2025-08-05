import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './db';
import {
  loanProviders,
  applicants,
  loanApplications,
  auditLogs,
  type LoanProvider,
  type InsertLoanProvider,
  type Applicant,
  type InsertApplicant,
  type LoanApplication,
  type InsertLoanApplication,
  type AuditLog,
  type InsertAuditLog,
  type LoanApplicationWithDetails
} from '@shared/schema';

export class PostgresStorage {
  // Loan Providers
  async getLoanProviders(): Promise<LoanProvider[]> {
    try {
      return await db.select().from(loanProviders).orderBy(desc(loanProviders.createdAt));
    } catch (error) {
      console.error('Error fetching loan providers:', error);
      throw new Error('Failed to fetch loan providers');
    }
  }

  async getLoanProvider(id: string): Promise<LoanProvider | undefined> {
    try {
      const result = await db.select().from(loanProviders).where(eq(loanProviders.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching loan provider:', error);
      throw new Error('Failed to fetch loan provider');
    }
  }

  async createLoanProvider(provider: InsertLoanProvider): Promise<LoanProvider> {
    try {
      const result = await db.insert(loanProviders).values(provider).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating loan provider:', error);
      throw new Error('Failed to create loan provider');
    }
  }

  async updateLoanProvider(id: string, provider: Partial<InsertLoanProvider>): Promise<LoanProvider | undefined> {
    try {
      const result = await db
        .update(loanProviders)
        .set(provider)
        .where(eq(loanProviders.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating loan provider:', error);
      throw new Error('Failed to update loan provider');
    }
  }

  async deleteLoanProvider(id: string): Promise<boolean> {
    try {
      const result = await db.delete(loanProviders).where(eq(loanProviders.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting loan provider:', error);
      throw new Error('Failed to delete loan provider');
    }
  }

  // Applicants
  async getApplicants(): Promise<Applicant[]> {
    try {
      return await db.select().from(applicants).orderBy(desc(applicants.createdAt));
    } catch (error) {
      console.error('Error fetching applicants:', error);
      throw new Error('Failed to fetch applicants');
    }
  }

  async getApplicant(id: string): Promise<Applicant | undefined> {
    try {
      const result = await db.select().from(applicants).where(eq(applicants.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching applicant:', error);
      throw new Error('Failed to fetch applicant');
    }
  }

  async createApplicant(applicant: InsertApplicant): Promise<Applicant> {
    try {
      const result = await db.insert(applicants).values(applicant).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating applicant:', error);
      throw new Error('Failed to create applicant');
    }
  }

  async updateApplicant(id: string, applicant: Partial<InsertApplicant>): Promise<Applicant | undefined> {
    try {
      const result = await db
        .update(applicants)
        .set(applicant)
        .where(eq(applicants.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating applicant:', error);
      throw new Error('Failed to update applicant');
    }
  }

  async deleteApplicant(id: string): Promise<boolean> {
    try {
      const result = await db.delete(applicants).where(eq(applicants.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting applicant:', error);
      throw new Error('Failed to delete applicant');
    }
  }

  // Loan Applications
  async getLoanApplications(): Promise<LoanApplicationWithDetails[]> {
    try {
      const result = await db
        .select({
          ...loanApplications,
          applicant: applicants,
          provider: loanProviders,
        })
        .from(loanApplications)
        .leftJoin(applicants, eq(loanApplications.applicantId, applicants.id))
        .leftJoin(loanProviders, eq(loanApplications.providerId, loanProviders.id))
        .orderBy(desc(loanApplications.submittedAt));

      return result.map(row => ({
        ...row,
        applicant: row.applicant!,
        provider: row.provider!,
      }));
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      throw new Error('Failed to fetch loan applications');
    }
  }

  async getLoanApplication(id: string): Promise<LoanApplicationWithDetails | undefined> {
    try {
      const result = await db
        .select({
          ...loanApplications,
          applicant: applicants,
          provider: loanProviders,
        })
        .from(loanApplications)
        .leftJoin(applicants, eq(loanApplications.applicantId, applicants.id))
        .leftJoin(loanProviders, eq(loanApplications.providerId, loanProviders.id))
        .where(eq(loanApplications.id, id));

      if (result.length === 0) return undefined;

      const row = result[0];
      return {
        ...row,
        applicant: row.applicant!,
        provider: row.provider!,
      };
    } catch (error) {
      console.error('Error fetching loan application:', error);
      throw new Error('Failed to fetch loan application');
    }
  }

  async createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication> {
    try {
      const result = await db.insert(loanApplications).values(application).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating loan application:', error);
      throw new Error('Failed to create loan application');
    }
  }

  async updateLoanApplication(id: string, application: Partial<InsertLoanApplication>): Promise<LoanApplication | undefined> {
    try {
      const result = await db
        .update(loanApplications)
        .set(application)
        .where(eq(loanApplications.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating loan application:', error);
      throw new Error('Failed to update loan application');
    }
  }

  async deleteLoanApplication(id: string): Promise<boolean> {
    try {
      const result = await db.delete(loanApplications).where(eq(loanApplications.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting loan application:', error);
      throw new Error('Failed to delete loan application');
    }
  }

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      return await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    try {
      const result = await db.insert(auditLogs).values(log).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw new Error('Failed to create audit log');
    }
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalApplications: number;
    approvedLoans: number;
    pendingReview: number;
    totalValue: number;
  }> {
    try {
      const [totalResult, approvedResult, pendingResult, valueResult] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(loanApplications),
        db.select({ count: sql<number>`count(*)` }).from(loanApplications).where(eq(loanApplications.status, 'approved')),
        db.select({ count: sql<number>`count(*)` }).from(loanApplications).where(eq(loanApplications.status, 'pending')),
        db.select({ total: sql<number>`coalesce(sum(${loanApplications.loanAmount}), 0)` }).from(loanApplications),
      ]);

      return {
        totalApplications: totalResult[0]?.count || 0,
        approvedLoans: approvedResult[0]?.count || 0,
        pendingReview: pendingResult[0]?.count || 0,
        totalValue: Number(valueResult[0]?.total || 0),
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard stats');
    }
  }
} 