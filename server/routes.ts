import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertLoanProviderSchema, 
  insertApplicantSchema, 
  insertLoanApplicationSchema,
  insertAuditLogSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Loan Providers routes
  app.get("/api/loan-providers", async (req, res) => {
    try {
      const providers = await storage.getLoanProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan providers" });
    }
  });

  app.get("/api/loan-providers/:id", async (req, res) => {
    try {
      const provider = await storage.getLoanProvider(req.params.id);
      if (!provider) {
        return res.status(404).json({ message: "Loan provider not found" });
      }
      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan provider" });
    }
  });

  app.post("/api/loan-providers", async (req, res) => {
    try {
      const validatedData = insertLoanProviderSchema.parse(req.body);
      const provider = await storage.createLoanProvider(validatedData);
      res.status(201).json(provider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan provider" });
    }
  });

  app.put("/api/loan-providers/:id", async (req, res) => {
    try {
      const validatedData = insertLoanProviderSchema.partial().parse(req.body);
      const provider = await storage.updateLoanProvider(req.params.id, validatedData);
      if (!provider) {
        return res.status(404).json({ message: "Loan provider not found" });
      }
      res.json(provider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update loan provider" });
    }
  });

  app.delete("/api/loan-providers/:id", async (req, res) => {
    try {
      const success = await storage.deleteLoanProvider(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Loan provider not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete loan provider" });
    }
  });

  // Applicants routes
  app.get("/api/applicants", async (req, res) => {
    try {
      const applicants = await storage.getApplicants();
      res.json(applicants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applicants" });
    }
  });

  app.get("/api/applicants/:id", async (req, res) => {
    try {
      const applicant = await storage.getApplicant(req.params.id);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      res.json(applicant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applicant" });
    }
  });

  app.post("/api/applicants", async (req, res) => {
    try {
      const validatedData = insertApplicantSchema.parse(req.body);
      const applicant = await storage.createApplicant(validatedData);
      res.status(201).json(applicant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create applicant" });
    }
  });

  app.put("/api/applicants/:id", async (req, res) => {
    try {
      const validatedData = insertApplicantSchema.partial().parse(req.body);
      const applicant = await storage.updateApplicant(req.params.id, validatedData);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      res.json(applicant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update applicant" });
    }
  });

  app.delete("/api/applicants/:id", async (req, res) => {
    try {
      const success = await storage.deleteApplicant(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete applicant" });
    }
  });

  // Loan Applications routes
  app.get("/api/loan-applications", async (req, res) => {
    try {
      const applications = await storage.getLoanApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan applications" });
    }
  });

  app.get("/api/loan-applications/:id", async (req, res) => {
    try {
      const application = await storage.getLoanApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan application" });
    }
  });

  app.post("/api/loan-applications", async (req, res) => {
    try {
      const validatedData = insertLoanApplicationSchema.parse(req.body);
      const application = await storage.createLoanApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan application" });
    }
  });

  app.put("/api/loan-applications/:id", async (req, res) => {
    try {
      const validatedData = insertLoanApplicationSchema.partial().parse(req.body);
      const application = await storage.updateLoanApplication(req.params.id, validatedData);
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update loan application" });
    }
  });

  app.delete("/api/loan-applications/:id", async (req, res) => {
    try {
      const success = await storage.deleteLoanApplication(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete loan application" });
    }
  });

  // Audit Logs routes
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const logs = await storage.getAuditLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
