import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AreaChartProps {
  data: any[];
  dataKey: string;
  title: string;
}

const AreaChartComponent = ({ data, dataKey, title }: AreaChartProps) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>📊</span> {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#2563eb"
            fillOpacity={1}
            fill="#93c5fd"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;