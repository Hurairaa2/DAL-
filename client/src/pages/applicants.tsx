import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { applicantsApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import ApplicantForm from "@/components/forms/applicant-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Applicant } from "@shared/schema";

export default function Applicants() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [deletingApplicant, setDeletingApplicant] = useState<Applicant | null>(null);

  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ["/api/applicants"],
    queryFn: applicantsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: applicantsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applicants"] });
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Applicant created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create applicant",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      applicantsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applicants"] });
      setEditingApplicant(null);
      toast({
        title: "Success",
        description: "Applicant updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update applicant",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: applicantsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applicants"] });
      setDeletingApplicant(null);
      toast({
        title: "Success",
        description: "Applicant deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete applicant",
        variant: "destructive",
      });
    },
  });

  const columns: Column<Applicant>[] = [
    {
      key: "fullName",
      header: "Name",
      sortable: true,
      render: (applicant) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-xs font-medium text-slate-600">
              {applicant.firstName[0]}{applicant.lastName[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {applicant.firstName} {applicant.lastName}
            </p>
            <p className="text-sm text-slate-500">{applicant.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "employmentStatus",
      header: "Employment",
      render: (applicant) => <StatusBadge status={applicant.employmentStatus} />,
    },
    {
      key: "annualIncome",
      header: "Annual Income",
      render: (applicant) => 
        `$${parseFloat(applicant.annualIncome).toLocaleString()}`,
    },
    {
      key: "creditScore",
      header: "Credit Score",
      render: (applicant) => applicant.creditScore || "N/A",
    },
    {
      key: "createdAt",
      header: "Registered",
      render: (applicant) => 
        new Date(applicant.createdAt).toLocaleDateString(),
    },
  ];

  const handleAdd = () => {
    setEditingApplicant(null);
    setIsFormOpen(true);
  };

  const handleEdit = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setIsFormOpen(true);
  };

  const handleDelete = (applicant: Applicant) => {
    setDeletingApplicant(applicant);
  };

  const handleFormSubmit = (data: any) => {
    if (editingApplicant) {
      updateMutation.mutate({ id: editingApplicant.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (deletingApplicant) {
      deleteMutation.mutate(deletingApplicant.id);
    }
  };

  return (
    <div>
      <DataTable
        data={applicants}
        columns={columns}
        searchPlaceholder="Search applicants..."
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        addButtonText="Add Applicant"
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingApplicant ? "Edit Applicant" : "Add New Applicant"}
            </DialogTitle>
          </DialogHeader>
          <ApplicantForm
            initialData={editingApplicant}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingApplicant} onOpenChange={() => setDeletingApplicant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the applicant
              "{deletingApplicant?.firstName} {deletingApplicant?.lastName}" and all associated data.
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
