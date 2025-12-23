interface Activity {
  id: string;
  type: "listing" | "user" | "update" | "warning";
  message: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
}

const ActivityFeed = ({ activities, loading = false }: ActivityFeedProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "listing":
        return "📝";
      case "user":
        return "👤";
      case "warning":
        return "⚠️";
      case "update":
        return "✅";
      default:
        return "📌";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No activities found</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
              <span className="text-xl">{getIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;