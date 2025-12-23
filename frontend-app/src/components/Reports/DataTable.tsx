interface DataTableProps {
  columns: {
    key: string;
    label: string;
  }[];
  data: any[];
  title: string;
  loading?: boolean;
}

const DataTable = ({
  columns,
  data,
  title,
  loading = false,
}: DataTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>📋</span> {title}
      </h3>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                {columns.map((col) => (
                  <th key={col.key} className="text-left py-3 px-4 font-semibold text-gray-700">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-gray-800">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTable;