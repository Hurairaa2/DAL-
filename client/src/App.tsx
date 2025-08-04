import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LoanProviders from "@/pages/loan-providers";
import Applicants from "@/pages/applicants";
import Applications from "@/pages/applications";
import AuditLog from "@/pages/audit-log";
import Reports from "@/pages/reports";
import MainLayout from "@/components/layout/main-layout";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/loan-providers" component={LoanProviders} />
        <Route path="/applicants" component={Applicants} />
        <Route path="/applications" component={Applications} />
        <Route path="/audit-log" component={AuditLog} />
        <Route path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
