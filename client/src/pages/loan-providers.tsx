import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { loanProvidersApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import ProviderForm from "@/components/forms/provider-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { LoanProvider } from "@shared/schema";

export default function LoanProviders() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<LoanProvider | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<LoanProvider | null>(null);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["/api/loan-providers"],
    queryFn: loanProvidersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: loanProvidersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-providers"] });
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Loan provider created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create loan provider",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      loanProvidersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-providers"] });
      setEditingProvider(null);
      toast({
        title: "Success",
        description: "Loan provider updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update loan provider",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: loanProvidersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-providers"] });
      setDeletingProvider(null);
      toast({
        title: "Success",
        description: "Loan provider deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete loan provider",
        variant: "destructive",
      });
    },
  });

  const columns: Column<LoanProvider>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "licenseNumber",
      header: "License",
    },
    {
      key: "status",
      header: "Status",
      render: (provider) => <StatusBadge status={provider.status} />,
    },
    {
      key: "interestRateRange",
      header: "Interest Rate",
      render: (provider) => 
        `${provider.interestRateMin}% - ${provider.interestRateMax}%`,
    },
    {
      key: "maxLoanAmount",
      header: "Max Loan",
      render: (provider) => 
        `$${parseFloat(provider.maxLoanAmount).toLocaleString()}`,
    },
  ];

  const handleAdd = () => {
    setEditingProvider(null);
    setIsFormOpen(true);
  };

  const handleEdit = (provider: LoanProvider) => {
    setEditingProvider(provider);
    setIsFormOpen(true);
  };

  const handleDelete = (provider: LoanProvider) => {
    setDeletingProvider(provider);
  };

  const handleFormSubmit = (data: any) => {
    if (editingProvider) {
      updateMutation.mutate({ id: editingProvider.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (deletingProvider) {
      deleteMutation.mutate(deletingProvider.id);
    }
  };

  return (
    <div>
      <DataTable
        data={providers}
        columns={columns}
        searchPlaceholder="Search providers..."
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        addButtonText="Add Provider"
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProvider ? "Edit Loan Provider" : "Add New Loan Provider"}
            </DialogTitle>
          </DialogHeader>
          <ProviderForm
            initialData={editingProvider}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingProvider} onOpenChange={() => setDeletingProvider(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the loan provider
              "{deletingProvider?.name}" and all associated data.
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
