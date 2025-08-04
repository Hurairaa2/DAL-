import { useQuery } from "@tanstack/react-query";
import { dashboardApi, loanApplicationsApi, auditLogsApi } from "@/lib/api";
import StatsCard from "@/components/dashboard/stats-card";
import RecentApplications from "@/components/dashboard/recent-applications";
import ActivityFeed from "@/components/dashboard/activity-feed";
import QuickActions from "@/components/dashboard/quick-actions";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: dashboardApi.getStats,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/loan-applications"],
    queryFn: loanApplicationsApi.getAll,
  });

  const { data: auditLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["/api/audit-logs"],
    queryFn: auditLogsApi.getAll,
  });

  // Get recent applications (last 5)
  const recentApplications = applications
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  // Get recent activity (last 10)
  const recentActivity = auditLogs.slice(0, 10);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          change="+12%"
          trend="up"
          icon="applications"
        />
        <StatsCard
          title="Approved Loans"
          value={stats?.approvedLoans || 0}
          change="+8%"
          trend="up"
          icon="approved"
        />
        <StatsCard
          title="Pending Review"
          value={stats?.pendingReview || 0}
          change="Needs attention"
          trend="neutral"
          icon="pending"
        />
        <StatsCard
          title="Total Value"
          value={`$${((stats?.totalValue || 0) / 1000000).toFixed(1)}M`}
          change="+15%"
          trend="up"
          icon="value"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <RecentApplications 
            applications={recentApplications}
            isLoading={applicationsLoading}
          />
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityFeed 
            activities={recentActivity}
            isLoading={logsLoading}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
