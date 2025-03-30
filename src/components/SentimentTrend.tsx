
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SentimentTrendProps {
  data: Array<{
    month: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

const SentimentTrend = ({ data }: SentimentTrendProps) => {
  // Format x-axis labels to show month names
  const formatXAxis = (tickItem: string) => {
    const [year, month] = tickItem.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Sentiment Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                labelFormatter={(label) => {
                  const [year, month] = label.split("-");
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return date.toLocaleString("default", { month: "long", year: "numeric" });
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="#4ade80"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="#f87171"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="neutral"
                stroke="#94a3b8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentTrend;
