import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loanApplicationsApi, loanProvidersApi, applicantsApi, dashboardApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Date picker functionality will be handled by HTML date input
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, TrendingUp, Users, Building, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/loan-applications"],
    queryFn: loanApplicationsApi.getAll,
  });

  const { data: providers = [] } = useQuery({
    queryKey: ["/api/loan-providers"],
    queryFn: loanProvidersApi.getAll,
  });

  const { data: applicants = [] } = useQuery({
    queryKey: ["/api/applicants"],
    queryFn: applicantsApi.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: dashboardApi.getStats,
  });

  const reportTypes = [
    { value: "applications-summary", label: "Applications Summary" },
    { value: "provider-performance", label: "Provider Performance" },
    { value: "applicant-demographics", label: "Applicant Demographics" },
    { value: "loan-status-breakdown", label: "Loan Status Breakdown" },
    { value: "monthly-trends", label: "Monthly Trends" },
    { value: "financial-overview", label: "Financial Overview" },
  ];

  const generateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, this would make an API call to generate and download the report
      const reportData = generateReportData(reportType);
      downloadReport(reportData, reportType);
      
      toast({
        title: "Success",
        description: "Report generated and downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportData = (type: string) => {
    switch (type) {
      case "applications-summary":
        return applications.map(app => ({
          id: app.id,
          applicant: `${app.applicant.firstName} ${app.applicant.lastName}`,
          provider: app.provider.name,
          amount: app.loanAmount,
          status: app.status,
          submittedDate: new Date(app.submittedAt).toLocaleDateString(),
          purpose: app.loanPurpose,
        }));
      
      case "provider-performance":
        return providers.map(provider => {
          const providerApps = applications.filter(app => app.providerId === provider.id);
          const approvedApps = providerApps.filter(app => app.status === "approved");
          return {
            name: provider.name,
            totalApplications: providerApps.length,
            approvedApplications: approvedApps.length,
            approvalRate: providerApps.length > 0 ? ((approvedApps.length / providerApps.length) * 100).toFixed(1) + "%" : "0%",
            totalValue: approvedApps.reduce((sum, app) => sum + parseFloat(app.loanAmount), 0),
          };
        });
      
      case "applicant-demographics":
        return applicants.map(applicant => ({
          name: `${applicant.firstName} ${applicant.lastName}`,
          age: new Date().getFullYear() - new Date(applicant.dateOfBirth).getFullYear(),
          employmentStatus: applicant.employmentStatus,
          annualIncome: applicant.annualIncome,
          creditScore: applicant.creditScore || "N/A",
          registrationDate: new Date(applicant.createdAt).toLocaleDateString(),
        }));
      
      default:
        return [];
    }
  };

  const downloadReport = (data: any[], type: string) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${type}-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return "";
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === "string" ? `"${value}"` : value;
      });
      csvRows.push(values.join(","));
    }
    
    return csvRows.join("\n");
  };

  // Calculate some quick statistics for the overview cards
  const totalApplicationValue = applications.reduce((sum, app) => sum + parseFloat(app.loanAmount), 0);
  const approvedApplications = applications.filter(app => app.status === "approved");
  const averageLoanAmount = applications.length > 0 ? totalApplicationValue / applications.length : 0;
  const approvalRate = applications.length > 0 ? (approvedApplications.length / applications.length) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              All time applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.filter(p => p.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall approval rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Loan Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${averageLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Average requested amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">From Date (Optional)</Label>
              <Input
                type="date"
                id="date-from"
                onChange={(e) => setDateRange(prev => ({ ...prev, from: new Date(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">To Date (Optional)</Label>
              <Input
                type="date"
                id="date-to"
                onChange={(e) => setDateRange(prev => ({ ...prev, to: new Date(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={generateReport} 
              disabled={isGenerating || !reportType}
              className="min-w-32"
            >
              {isGenerating ? (
                "Generating..."
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Report Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => { setReportType("applications-summary"); generateReport(); }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Applications Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complete overview of all loan applications with applicant details, status, and amounts.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => { setReportType("provider-performance"); generateReport(); }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Provider Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analysis of loan provider performance including approval rates and total loan values.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => { setReportType("applicant-demographics"); generateReport(); }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Applicant Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Demographic breakdown of loan applicants including age, income, and employment status.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent exports available</p>
            <p className="text-sm">Generated reports will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
