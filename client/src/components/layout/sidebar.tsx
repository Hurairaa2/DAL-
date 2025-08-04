import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Building, 
  Users, 
  FileText, 
  History, 
  BarChart, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    name: "Loan Providers",
    href: "/loan-providers",
    icon: Building,
  },
  {
    name: "Applicants",
    href: "/applicants",
    icon: Users,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: FileText,
  },
  {
    name: "Audit Log",
    href: "/audit-log",
    icon: History,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart,
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white text-sm" size={16} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">LoanAdmin</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <a className={cn(
                "admin-nav-item",
                isActive ? "admin-nav-item-active" : "admin-nav-item-inactive"
              )}>
                <Icon size={20} />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
            <span className="text-slate-600 text-sm font-medium">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Admin User</p>
            <p className="text-xs text-slate-500">admin@loanadmin.com</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
