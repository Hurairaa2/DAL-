import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { loanApplicationsApi, loanProvidersApi, applicantsApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import ApplicationForm from "@/components/forms/application-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { LoanApplicationWithDetails } from "@shared/schema";

export default function Applications() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<LoanApplicationWithDetails | null>(null);
  const [deletingApplication, setDeletingApplication] = useState<LoanApplicationWithDetails | null>(null);

  const { data: applications = [], isLoading } = useQuery({
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

  const createMutation = useMutation({
    mutationFn: loanApplicationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Loan application created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create loan application",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      loanApplicationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setEditingApplication(null);
      toast({
        title: "Success",
        description: "Loan application updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update loan application",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: loanApplicationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setDeletingApplication(null);
      toast({
        title: "Success",
        description: "Loan application deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete loan application",
        variant: "destructive",
      });
    },
  });

  const columns: Column<LoanApplicationWithDetails>[] = [
    {
      key: "applicant",
      header: "Applicant",
      sortable: true,
      render: (application) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-xs font-medium text-slate-600">
              {application.applicant.firstName[0]}{application.applicant.lastName[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {application.applicant.firstName} {application.applicant.lastName}
            </p>
            <p className="text-sm text-slate-500">{application.applicant.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "loanAmount",
      header: "Amount",
      sortable: true,
      render: (application) => 
        `$${parseFloat(application.loanAmount).toLocaleString()}`,
    },
    {
      key: "provider",
      header: "Provider",
      render: (application) => application.provider.name,
    },
    {
      key: "loanPurpose",
      header: "Purpose",
    },
    {
      key: "loanTerm",
      header: "Term",
      render: (application) => `${application.loanTerm} months`,
    },
    {
      key: "status",
      header: "Status",
      render: (application) => <StatusBadge status={application.status} />,
    },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (application) => 
        new Date(application.submittedAt).toLocaleDateString(),
    },
  ];

  const handleAdd = () => {
    setEditingApplication(null);
    setIsFormOpen(true);
  };

  const handleEdit = (application: LoanApplicationWithDetails) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const handleDelete = (application: LoanApplicationWithDetails) => {
    setDeletingApplication(application);
  };

  const handleFormSubmit = (data: any) => {
    if (editingApplication) {
      updateMutation.mutate({ id: editingApplication.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (deletingApplication) {
      deleteMutation.mutate(deletingApplication.id);
    }
  };

  return (
    <div>
      <DataTable
        data={applications}
        columns={columns}
        searchPlaceholder="Search applications..."
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        addButtonText="Add Application"
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingApplication ? "Edit Loan Application" : "Add New Loan Application"}
            </DialogTitle>
          </DialogHeader>
          <ApplicationForm
            initialData={editingApplication}
            providers={providers}
            applicants={applicants}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingApplication} onOpenChange={() => setDeletingApplication(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the loan application
              for "{deletingApplication?.applicant.firstName} {deletingApplication?.applicant.lastName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
