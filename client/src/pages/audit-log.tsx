import { useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "@/lib/api";
import DataTable, { type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import type { AuditLog } from "@shared/schema";

const actionColorMap = {
  create: "bg-blue-100 text-blue-800",
  update: "bg-yellow-100 text-yellow-800",
  delete: "bg-red-100 text-red-800",
  view: "bg-green-100 text-green-800",
};

const entityTypeMap = {
  provider: "Loan Provider",
  applicant: "Applicant",
  application: "Application",
};

export default function AuditLog() {
  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ["/api/audit-logs"],
    queryFn: auditLogsApi.getAll,
  });

  const columns: Column<AuditLog>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (log) => (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {new Date(log.timestamp).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-500">
            {new Date(log.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (log) => (
        <Badge 
          className={actionColorMap[log.action as keyof typeof actionColorMap] || "bg-gray-100 text-gray-800"}
        >
          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
        </Badge>
      ),
    },
    {
      key: "entityType",
      header: "Entity Type",
      render: (log) => 
        entityTypeMap[log.entityType as keyof typeof entityTypeMap] || log.entityType,
    },
    {
      key: "entityId",
      header: "Entity ID",
      render: (log) => (
        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
          {log.entityId.slice(0, 8)}...
        </code>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (log) => (
        <div className="max-w-md">
          <p className="text-sm text-slate-900 truncate" title={log.details}>
            {log.details}
          </p>
        </div>
      ),
    },
    {
      key: "userId",
      header: "User",
      render: (log) => (
        <span className="text-sm text-slate-900">{log.userId}</span>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        data={auditLogs}
        columns={columns}
        searchPlaceholder="Search audit logs..."
        isLoading={isLoading}
      />
    </div>
  );
}
