import { FileText, CheckCircle, Clock, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: "applications" | "approved" | "pending" | "value";
}

const iconMap = {
  applications: FileText,
  approved: CheckCircle,
  pending: Clock,
  value: DollarSign,
};

const iconColorMap = {
  applications: "bg-blue-100 text-blue-600",
  approved: "bg-green-100 text-green-600", 
  pending: "bg-yellow-100 text-yellow-600",
  value: "bg-purple-100 text-purple-600",
};

export default function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  const Icon = iconMap[icon];
  const iconColors = iconColorMap[icon];

  return (
    <div className="admin-stats-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          <p className={`text-sm mt-2 flex items-center ${
            trend === "up" ? "text-green-600" : 
            trend === "down" ? "text-red-600" : 
            "text-yellow-600"
          }`}>
            {trend === "up" && <TrendingUp size={14} className="mr-1" />}
            {trend === "down" && <TrendingDown size={14} className="mr-1" />}
            {trend === "neutral" && <Clock size={14} className="mr-1" />}
            {change}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColors}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
