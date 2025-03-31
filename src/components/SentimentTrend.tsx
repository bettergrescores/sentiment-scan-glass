
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
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Sentiment Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent className="p-0 px-2 pb-2">
        <div className="h-[240px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 11 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis tick={{ fontSize: 11 }} width={25} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                labelFormatter={(label) => {
                  const [year, month] = label.split("-");
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return date.toLocaleString("default", { month: "long", year: "numeric" });
                }}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="#4ade80"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="#f87171"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="neutral"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentTrend;
