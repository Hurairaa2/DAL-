import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig = {
  active: {
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  inactive: {
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  suspended: {
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  pending: {
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  approved: {
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  rejected: {
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  under_review: {
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  employed: {
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  unemployed: {
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  "self-employed": {
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  retired: {
    variant: "secondary" as const,
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </Badge>
  );
}
