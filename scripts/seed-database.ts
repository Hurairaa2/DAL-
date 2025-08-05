import { db } from '../server/db';
import { loanProviders, applicants, loanApplications, auditLogs } from '../shared/schema';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.delete(loanApplications);
    await db.delete(auditLogs);
    await db.delete(applicants);
    await db.delete(loanProviders);

    // Seed loan providers
    console.log('🏦 Creating loan providers...');
    const [provider1, provider2] = await Promise.all([
      db.insert(loanProviders).values({
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
      }).returning(),
      db.insert(loanProviders).values({
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
      }).returning()
    ]);

    // Seed applicants
    console.log('👥 Creating applicants...');
    const [applicant1, applicant2, applicant3] = await Promise.all([
      db.insert(applicants).values({
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
      }).returning(),
      db.insert(applicants).values({
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
      }).returning(),
      db.insert(applicants).values({
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.johnson@example.com",
        phone: "+1-555-0203",
        address: "654 Finance Blvd, Money City, MC 33333",
        dateOfBirth: "1988-12-10",
        ssn: "***-**-9012",
        employmentStatus: "self-employed",
        annualIncome: "85000.00",
        creditScore: 750
      }).returning()
    ]);

    // Seed loan applications
    console.log('📋 Creating loan applications...');
    await Promise.all([
      db.insert(loanApplications).values({
        applicantId: applicant1[0].id,
        providerId: provider1[0].id,
        loanAmount: "25000.00",
        loanPurpose: "Home improvement",
        loanTerm: 60,
        interestRate: "5.5",
        status: "pending",
        notes: "Initial application review pending"
      }),
      db.insert(loanApplications).values({
        applicantId: applicant2[0].id,
        providerId: provider2[0].id,
        loanAmount: "15000.00",
        loanPurpose: "Debt consolidation",
        loanTerm: 36,
        interestRate: "4.8",
        status: "approved",
        notes: "Application approved after review"
      }),
      db.insert(loanApplications).values({
        applicantId: applicant3[0].id,
        providerId: provider1[0].id,
        loanAmount: "50000.00",
        loanPurpose: "Business expansion",
        loanTerm: 84,
        interestRate: "6.2",
        status: "under_review",
        notes: "Additional documentation requested"
      }),
      db.insert(loanApplications).values({
        applicantId: applicant1[0].id,
        providerId: provider2[0].id,
        loanAmount: "10000.00",
        loanPurpose: "Vehicle purchase",
        loanTerm: 48,
        interestRate: "7.1",
        status: "rejected",
        notes: "Insufficient credit score for requested amount"
      })
    ]);

    // Seed audit logs
    console.log('📝 Creating audit logs...');
    await Promise.all([
      db.insert(auditLogs).values({
        entityType: "provider",
        entityId: provider1[0].id,
        action: "create",
        details: "Created loan provider: First National Bank",
        userId: "admin"
      }),
      db.insert(auditLogs).values({
        entityType: "provider",
        entityId: provider2[0].id,
        action: "create",
        details: "Created loan provider: Credit Union Plus",
        userId: "admin"
      }),
      db.insert(auditLogs).values({
        entityType: "applicant",
        entityId: applicant1[0].id,
        action: "create",
        details: "Created applicant: John Doe",
        userId: "admin"
      }),
      db.insert(auditLogs).values({
        entityType: "application",
        entityId: "sample-app-1",
        action: "create",
        details: "Created loan application for amount: $25,000",
        userId: "admin"
      })
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created:
    - ${provider1.length + provider2.length} loan providers
    - ${applicant1.length + applicant2.length + applicant3.length} applicants
    - 4 loan applications
    - 4 audit log entries`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase(); 