import { Plus, Check, Edit, X } from "lucide-react";
import type { AuditLog } from "@shared/schema";

interface ActivityFeedProps {
  activities: AuditLog[];
  isLoading: boolean;
}

const actionIcons = {
  create: Plus,
  update: Edit,
  delete: X,
  view: Check,
};

const actionColors = {
  create: "bg-blue-100 text-blue-600",
  update: "bg-yellow-100 text-yellow-600", 
  delete: "bg-red-100 text-red-600",
  view: "bg-green-100 text-green-600",
};

export default function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="admin-card">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        </div>
        <div className="p-6 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
      </div>
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-center text-slate-500">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const Icon = actionIcons[activity.action as keyof typeof actionIcons] || Check;
            const iconColors = actionColors[activity.action as keyof typeof actionColors] || "bg-gray-100 text-gray-600";

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.details}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
