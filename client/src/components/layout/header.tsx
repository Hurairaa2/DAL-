import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const pagetitles = {
  "/": "Dashboard",
  "/loan-providers": "Loan Providers",
  "/applicants": "Applicants", 
  "/applications": "Applications",
  "/audit-log": "Audit Log",

};

const pageDescriptions = {
  "/": "Monitor your loan management system",
  "/loan-providers": "Manage loan providers and their information",
  "/applicants": "View and manage loan applicants",
  "/applications": "Track and manage loan applications",
  "/audit-log": "View system activity and changes",

};

export default function Header() {
  const [location] = useLocation();
  const title = pagetitles[location as keyof typeof pagetitles] || "Page";
  const description = pageDescriptions[location as keyof typeof pageDescriptions] || "";

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="text-slate-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-64 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} className="text-slate-400" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
