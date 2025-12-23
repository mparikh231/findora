interface ReportCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const ReportCard = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
  trend,
}: ReportCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow p-5 flex items-center justify-between`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <div className="text-3xl font-bold text-gray-900 mt-1">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-bold">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-1 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
         <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl bg-white`}
      >
        {icon}
      </div>
      </div>
    </div>
  );
};

export default ReportCard;