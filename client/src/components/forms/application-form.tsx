import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLoanApplicationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { LoanApplicationWithDetails, InsertLoanApplication, LoanProvider, Applicant } from "@shared/schema";

interface ApplicationFormProps {
  initialData?: LoanApplicationWithDetails | null;
  providers: LoanProvider[];
  applicants: Applicant[];
  onSubmit: (data: InsertLoanApplication) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ApplicationForm({ 
  initialData, 
  providers,
  applicants,
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ApplicationFormProps) {
  const form = useForm<InsertLoanApplication>({
    resolver: zodResolver(insertLoanApplicationSchema),
    defaultValues: initialData ? {
      applicantId: initialData.applicantId,
      providerId: initialData.providerId,
      loanAmount: initialData.loanAmount,
      loanPurpose: initialData.loanPurpose,
      loanTerm: initialData.loanTerm,
      interestRate: initialData.interestRate || undefined,
      status: initialData.status,
      notes: initialData.notes || "",
      reviewedBy: initialData.reviewedBy || undefined,
    } : {
      applicantId: "",
      providerId: "",
      loanAmount: "0",
      loanPurpose: "",
      loanTerm: 12,
      interestRate: undefined,
      status: "pending",
      notes: "",
      reviewedBy: undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="applicantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicant</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select applicant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {applicants.map((applicant) => (
                      <SelectItem key={applicant.id} value={applicant.id}>
                        {applicant.firstName} {applicant.lastName} - {applicant.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Provider</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {providers.filter(p => p.status === "active").map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    placeholder="0" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Term (months)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    max="360"
                    placeholder="12"
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 12)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (% - Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="0.0"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? e.target.value : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="loanPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Purpose</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Home improvement, Debt consolidation, Business expansion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reviewedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reviewed By (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter reviewer name" value={field.value || ""} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any additional notes or comments"
                  className="min-h-24"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update" : "Create"} Application
          </Button>
        </div>
      </form>
    </Form>
  );
}
