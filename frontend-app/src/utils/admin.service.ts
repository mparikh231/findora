import apiCall from "./axios";

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalUsers: number;
  pendingApprovals: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Activity {
  id: string;
  type: "listing" | "user" | "update" | "warning";
  message: string;
  timestamp: string;
}

export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const [listingsRes, usersRes] = await Promise.all([
        apiCall.get("/listings"),
        apiCall.get("/users"),
      ]);

      const listings = listingsRes.data.listingData || [];
      const users = usersRes.data.userData || [];

      const activeListings = listings.filter(
        (l: any) => l.status === "active"
      ).length;
      const pendingListings = listings.filter(
        (l: any) => l.status === "pending"
      ).length;

      return {
        totalListings: listings.length,
        activeListings: activeListings,
        totalUsers: users.length,
        pendingApprovals: pendingListings,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // Get listings by status for charts
  getListingsByStatus: async (): Promise<ChartData[]> => {
    try {
      const res = await apiCall.get("/listings?limit=1000");
      const listings = res.data.listingData || [];

      const statusCounts = {
        active: 0,
        pending: 0,
        rejected: 0,
      };

      listings.forEach((listing: any) => {
        if (statusCounts.hasOwnProperty(listing.status)) {
          statusCounts[listing.status as keyof typeof statusCounts]++;
        }
      });

      return [
        { name: "Active", value: statusCounts.active },
        { name: "Pending", value: statusCounts.pending },
        { name: "Rejected", value: statusCounts.rejected },
      ];
    } catch (error) {
      console.error("Error fetching listings by status:", error);
      throw error;
    }
  },

  // Get monthly listings data (simulated based on createdAt)
  getMonthlyListings: async (): Promise<ChartData[]> => {
    try {
      const res = await apiCall.get("/listings?limit=1000");
      const listings = res.data.listingData || [];

      // Group by month
      const monthlyData: { [key: string]: number } = {};
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      listings.forEach((listing: any) => {
        const date = new Date(listing.createdAt);
        const month = months[date.getMonth()];
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      // Return all months even if empty
      return months.map((month) => ({
        name: month,
        value: monthlyData[month] || 0,
      }));
    } catch (error) {
      console.error("Error fetching monthly listings:", error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async (): Promise<Activity[]> => {
    try {
      const [listingsRes, usersRes] = await Promise.all([
        apiCall.get("/listings?limit=100"),
        apiCall.get("/users"),
      ]);

      const listings = listingsRes.data.listingData || [];
      const users = usersRes.data.userData || [];

      const activities: Activity[] = [];

      // Add recent listings
      listings.slice(0, 5).forEach((listing: any, idx: number) => {
        activities.push({
          id: `listing-${idx}`,
          type: "listing",
          message: `New listing "${listing.title}" added by ${listing.user?.firstName} ${listing.user?.lastName}`,
          timestamp: new Date(listing.createdAt).toLocaleDateString(),
        });
      });

      // Add recent users
      users.slice(0, 3).forEach((user: any, idx: number) => {
        activities.push({
          id: `user-${idx}`,
          type: "user",
          message: `New user registered: ${user.email}`,
          timestamp: new Date(user.created_at).toLocaleDateString(),
        });
      });

      // Add pending approvals
      const pendingCount = listings.filter(
        (l: any) => l.status === "pending"
      ).length;
      if (pendingCount > 0) {
        activities.push({
          id: "pending",
          type: "warning",
          message: `${pendingCount} listings pending approval`,
          timestamp: new Date().toLocaleDateString(),
        });
      }

      return activities.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      throw error;
    }
  },

  // Get top listings
  getTopListings: async (): Promise<any[]> => {
    try {
      const res = await apiCall.get("/listings?limit=10");
      return res.data.listingData || [];
    } catch (error) {
      console.error("Error fetching top listings:", error);
      throw error;
    }
  },
};