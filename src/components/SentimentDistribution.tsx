
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { SentimentData } from "@/data/mockData";

interface SentimentDistributionProps {
  data: SentimentData;
}

const COLORS = ["#4ade80", "#f87171", "#94a3b8"];

const SentimentDistribution = ({ data }: SentimentDistributionProps) => {
  const chartData = [
    { name: "Positive", value: data.positive },
    { name: "Negative", value: data.negative },
    { name: "Neutral", value: data.neutral },
  ];

  const total = data.positive + data.negative + data.neutral;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} reviews (${((value / total) * 100).toFixed(1)}%)`, 'Reviews']} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 rounded bg-gray-50">
            <div className="text-xs text-gray-500">Positive</div>
            <div className="text-2xl font-medium text-green-500">{data.positive}</div>
            <div className="text-xs text-gray-500">{((data.positive / total) * 100).toFixed(1)}%</div>
          </div>
          <div className="p-2 rounded bg-gray-50">
            <div className="text-xs text-gray-500">Negative</div>
            <div className="text-2xl font-medium text-red-500">{data.negative}</div>
            <div className="text-xs text-gray-500">{((data.negative / total) * 100).toFixed(1)}%</div>
          </div>
          <div className="p-2 rounded bg-gray-50">
            <div className="text-xs text-gray-500">Neutral</div>
            <div className="text-2xl font-medium text-slate-500">{data.neutral}</div>
            <div className="text-xs text-gray-500">{((data.neutral / total) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentDistribution;
