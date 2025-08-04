import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Settings } from "lucide-react";

export default function QuickActions() {
  const [, setLocation] = useLocation();

  const actions = [
    {
      title: "Add New Provider",
      description: "Register a new loan provider",
      icon: Plus,
      onClick: () => setLocation("/loan-providers"),
      color: "bg-blue-100 group-hover:bg-blue-200 text-blue-600",
    },
    {
      title: "Export Reports",
      description: "Generate detailed reports", 
      icon: FileText,
      onClick: () => setLocation("/reports"),
      color: "bg-green-100 group-hover:bg-green-200 text-green-600",
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      onClick: () => alert("Settings feature coming soon!"),
      color: "bg-purple-100 group-hover:bg-purple-200 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action) => {
        const Icon = action.icon;
        
        return (
          <Button
            key={action.title}
            variant="ghost"
            className="admin-card h-auto p-6 text-left hover:shadow-md transition-all group justify-start"
            onClick={action.onClick}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${action.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{action.title}</h4>
                <p className="text-slate-600 text-sm">{action.description}</p>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
