// filepath: /Users/hardikkava/findora/frontend-app/src/components/Reports/BarChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: any[];
  dataKey: string;
  title: string;
}

const BarChartComponent = ({ data, dataKey, title }: BarChartProps) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-4 items-center">
        <span>📈</span> {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#1e40af" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;