import { useEffect, useState } from "react";
import ReportCard from "../../components/Reports/ReportCard";
import AreaChartComponent from "../../components/Reports/AreaChart";
import BarChartComponent from "../../components/Reports/BarChart";
import ActivityFeed from "../../components/Reports/ActivityFeed";
import DataTable from "../../components/Reports/DataTable";
import { adminService } from "../../utils/admin.service";
import type { DashboardStats, ChartData, Activity } from "../../utils/admin.service";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    totalUsers: 0,
    pendingApprovals: 0,
  });

  const [areaChartData, setAreaChartData] = useState<ChartData[]>([]);
  const [barChartData, setBarChartData] = useState<ChartData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [topListings, setTopListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsData, areaData, barData, activitiesData, listingsData] =
        await Promise.all([
          adminService.getDashboardStats(),
          adminService.getMonthlyListings(),
          adminService.getListingsByStatus(),
          adminService.getRecentActivities(),
          adminService.getTopListings(),
        ]);

      setStats(statsData);
      setAreaChartData(areaData);
      setBarChartData(barData);
      setActivities(activitiesData);
      setTopListings(listingsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your platform overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ReportCard
          title="Total Listings"
          value={stats.totalListings}
          icon="📋"
          bgColor="bg-blue-500"
          textColor="text-blue-600"
          trend={{ value: 12, isPositive: true }}
        />
        <ReportCard
          title="Active Listings"
          value={stats.activeListings}
          icon="✅"
          bgColor="bg-green-500"
          textColor="text-green-600"
          trend={{ value: 8, isPositive: true }}
        />
        <ReportCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          bgColor="bg-purple-500"
          textColor="text-purple-600"
          trend={{ value: 5, isPositive: true }}
        />
        <ReportCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon="⏳"
          bgColor="bg-yellow-500"
          textColor="text-yellow-600"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AreaChartComponent
          data={areaChartData}
          dataKey="value"
          title="Monthly Listings"
        />
        <BarChartComponent
          data={barChartData}
          dataKey="value"
          title="Listings by Status"
        />
      </div>

      {/* Recent Activity */}
      <ActivityFeed activities={activities} loading={loading} />

      {/* Top Listings Table */}
      <DataTable
        title="Recent Listings"
        columns={[
          { key: "title", label: "Title" },
          { key: "status", label: "Status" },
          { key: "price", label: "Price" },
          { key: "isAvailable", label: "Available" },
        ]}
        data={topListings.map((listing) => ({
          title: listing.title,
          status: listing.status,
          price: `$${listing.price}`,
          isAvailable: listing.isAvailable ? "Yes" : "No",
        }))}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
