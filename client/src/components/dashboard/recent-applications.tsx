import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/ui/status-badge";
import type { LoanApplicationWithDetails } from "@shared/schema";

interface RecentApplicationsProps {
  applications: LoanApplicationWithDetails[];
  isLoading: boolean;
}

export default function RecentApplications({ applications, isLoading }: RecentApplicationsProps) {
  if (isLoading) {
    return (
      <div className="admin-card">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Applications</h3>
        </div>
        <div className="p-6 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Recent Applications</h3>
          <Link href="/applications">
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
              View All
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No recent applications
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow key={application.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-slate-600">
                          {application.applicant.firstName[0]}{application.applicant.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900">
                          {application.applicant.firstName} {application.applicant.lastName}
                        </p>
                        <p className="text-sm text-slate-500">{application.applicant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-900">
                    ${parseFloat(application.loanAmount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-slate-900">
                    {application.provider.name}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
