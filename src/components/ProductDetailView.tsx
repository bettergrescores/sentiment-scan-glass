
import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Product, Review } from "@/data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import KeywordsCloud from "./KeywordsCloud";

interface ProductDetailViewProps {
  product: Product;
  reviews: Review[];
}

const ProductDetailView = ({ product, reviews }: ProductDetailViewProps) => {
  // Memoize computed values
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        avgRating: 0,
        positiveReviews: 0,
        negativeReviews: 0,
        neutralReviews: 0,
        positivePercentage: 0,
        negativePercentage: 0,
        neutralPercentage: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
      };
    }

    const positiveReviews = reviews.filter((r) => r.sentiment === "positive").length;
    const negativeReviews = reviews.filter((r) => r.sentiment === "negative").length;
    const neutralReviews = reviews.filter((r) => r.sentiment === "neutral").length;

    // Calculate rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating - 1]++;
      }
    });

    return {
      avgRating: reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews,
      positiveReviews,
      negativeReviews,
      neutralReviews,
      positivePercentage: (positiveReviews / totalReviews) * 100,
      negativePercentage: (negativeReviews / totalReviews) * 100,
      neutralPercentage: (neutralReviews / totalReviews) * 100,
      ratingDistribution,
    };
  }, [reviews]);

  // Calculate keywords for each sentiment
  const keywords = useMemo(() => {
    const positiveKeywords = new Map<string, number>();
    const negativeKeywords = new Map<string, number>();
    const neutralKeywords = new Map<string, number>();

    reviews.forEach((review) => {
      const keywordMap =
        review.sentiment === "positive"
          ? positiveKeywords
          : review.sentiment === "negative"
          ? negativeKeywords
          : neutralKeywords;

      review.keywords.forEach((keyword) => {
        keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
      });
    });

    const mapToArray = (map: Map<string, number>) =>
      Array.from(map.entries())
        .map(([keyword, count]) => ({ keyword, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    return {
      positive: mapToArray(positiveKeywords),
      negative: mapToArray(negativeKeywords),
      neutral: mapToArray(neutralKeywords),
    };
  }, [reviews]);

  // Calculate sentiment over time
  const sentimentTrend = useMemo(() => {
    // Group reviews by month
    const reviewsByMonth = new Map<string, Review[]>();

    reviews.forEach((review) => {
      const date = new Date(review.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!reviewsByMonth.has(monthKey)) {
        reviewsByMonth.set(monthKey, []);
      }

      reviewsByMonth.get(monthKey)?.push(review);
    });

    // Calculate sentiment for each month
    return Array.from(reviewsByMonth.entries())
      .map(([month, monthReviews]) => {
        const totalReviews = monthReviews.length;
        if (totalReviews === 0) return { month, positive: 0, negative: 0, neutral: 0 };

        const positive = monthReviews.filter((r) => r.sentiment === "positive").length;
        const negative = monthReviews.filter((r) => r.sentiment === "negative").length;
        const neutral = monthReviews.filter((r) => r.sentiment === "neutral").length;

        return {
          month,
          positive: (positive / totalReviews) * 100,
          negative: (negative / totalReviews) * 100,
          neutral: (neutral / totalReviews) * 100,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [reviews]);

  // Colors for the sentiment pie chart
  const SENTIMENT_COLORS = ["#4ade80", "#f87171", "#94a3b8"];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{product.category}</Badge>
          <Badge variant="outline">{product.subCategory}</Badge>
          <Badge variant="outline">${product.price}</Badge>
          <Badge variant="outline">Released: {formatDate(product.releaseDate)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Sentiment Trends</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Product Summary */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Product Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                      <div className="text-3xl font-bold mt-1">
                        {stats.avgRating.toFixed(1)}
                        <span className="text-base text-muted-foreground">/5</span>
                      </div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < Math.round(stats.avgRating)
                                ? "text-amber-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="text-sm text-muted-foreground">Total Reviews</div>
                      <div className="text-3xl font-bold mt-1">{reviews.length}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Sentiment Breakdown</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Positive</span>
                        <span className="text-green-600">
                          {stats.positiveReviews} ({stats.positivePercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={stats.positivePercentage}
                        className="bg-green-100"
                        indicatorClassName="bg-green-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Neutral</span>
                        <span className="text-slate-600">
                          {stats.neutralReviews} ({stats.neutralPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={stats.neutralPercentage}
                        className="bg-slate-100"
                        indicatorClassName="bg-slate-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Negative</span>
                        <span className="text-red-600">
                          {stats.negativeReviews} ({stats.negativePercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={stats.negativePercentage}
                        className="bg-red-100"
                        indicatorClassName="bg-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentiment Pie Chart */}
              <div>
                <h3 className="text-base font-medium mb-4">Sentiment Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Positive", value: stats.positiveReviews },
                          { name: "Negative", value: stats.negativeReviews },
                          { name: "Neutral", value: stats.neutralReviews },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {[0, 1, 2].map((index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${value} reviews`, "Count"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base font-medium mb-2">Key Insights</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    {stats.positivePercentage > stats.negativePercentage
                      ? `${product.name} is mostly well-received with ${stats.positivePercentage.toFixed(
                          1
                        )}% positive reviews.`
                      : `${product.name} shows concerning feedback with ${stats.negativePercentage.toFixed(
                          1
                        )}% negative reviews.`}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Top positive aspect:{" "}
                    <strong>{keywords.positive[0]?.keyword || "N/A"}</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Top area for improvement:{" "}
                    <strong>{keywords.negative[0]?.keyword || "N/A"}</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    {stats.avgRating >= 4
                      ? `Strong rating performance with an average of ${stats.avgRating.toFixed(
                          1
                        )} stars.`
                      : stats.avgRating >= 3
                      ? `Average rating performance with ${stats.avgRating.toFixed(
                          1
                        )} stars.`
                      : `Below average rating of ${stats.avgRating.toFixed(
                          1
                        )} stars indicates issues.`}
                  </span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="pt-4">
            <div className="h-80 mb-6">
              <h3 className="text-base font-medium mb-4">Sentiment Trends Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sentimentTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(monthKey) => {
                      const [year, month] = monthKey.split("-");
                      return `${new Date(
                        parseInt(year),
                        parseInt(month) - 1
                      ).toLocaleString("default", { month: "short" })}`;
                    }}
                  />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    formatter={(value: any) => [`${value.toFixed(1)}%`]}
                    labelFormatter={(label) => {
                      const [year, month] = label.split("-");
                      return `${new Date(
                        parseInt(year),
                        parseInt(month) - 1
                      ).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}`;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke="#4ade80"
                    fill="#4ade80"
                  />
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    stackId="1"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    stackId="1"
                    stroke="#f87171"
                    fill="#f87171"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {sentimentTrend.length > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="text-base font-medium mb-3">Trend Insights</h3>
                <ul className="space-y-2">
                  {sentimentTrend.length > 1 && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>
                          {sentimentTrend[sentimentTrend.length - 1].positive >
                          sentimentTrend[0].positive
                            ? "Positive sentiment has improved over time."
                            : "Positive sentiment has declined over time."}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>
                          {sentimentTrend[sentimentTrend.length - 1].negative <
                          sentimentTrend[0].negative
                            ? "Negative feedback has decreased, indicating product improvements."
                            : "Increase in negative feedback suggests attention is needed."}
                        </span>
                      </li>
                    </>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>
                      {`Latest sentiment breakdown: ${sentimentTrend[sentimentTrend.length - 1].positive.toFixed(1)}% positive, ${sentimentTrend[sentimentTrend.length - 1].negative.toFixed(1)}% negative.`}
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ratings" className="pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-base font-medium mb-3">Rating Distribution</h3>
                <div className="space-y-3">
                  {stats.ratingDistribution.map((count, index) => {
                    const stars = 5 - index;
                    const percentage =
                      reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center">
                        <span className="w-12 text-right mr-4">{stars} stars</span>
                        <div className="flex-1 h-4 bg-gray-200 rounded">
                          <div
                            className="h-full bg-amber-400 rounded"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-16 text-right ml-4">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-base font-medium mb-3">Rating Insights</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>
                      {stats.ratingDistribution[4] > stats.ratingDistribution[3] + stats.ratingDistribution[2] + stats.ratingDistribution[1] + stats.ratingDistribution[0]
                        ? "Majority of customers rate this product with 5 stars, indicating strong satisfaction."
                        : "5-star ratings are not the majority, suggesting improvement opportunities."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>
                      {stats.ratingDistribution[0] + stats.ratingDistribution[1] < stats.ratingDistribution[4] / 4
                        ? "Very few low ratings, indicating consistent product quality."
                        : "A significant number of low ratings suggests quality control issues."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>
                      Average rating of {stats.avgRating.toFixed(1)} places this product{" "}
                      {stats.avgRating > 4
                        ? "in the top tier of customer satisfaction."
                        : stats.avgRating > 3
                        ? "at an acceptable but not exceptional level of satisfaction."
                        : "below acceptable satisfaction levels, requiring attention."}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="pt-4">
            <div className="grid gap-6 md:grid-cols-3">
              <KeywordsCloud keywords={keywords.positive} type="positive" />
              <KeywordsCloud keywords={keywords.neutral} type="neutral" />
              <KeywordsCloud keywords={keywords.negative} type="negative" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductDetailView;
