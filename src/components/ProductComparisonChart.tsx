
import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Checkbox } from "./ui/checkbox";
import { Product, Review } from "@/data/mockData";

interface ProductComparisonChartProps {
  products: Product[];
  reviews: Review[];
  onProductSelect: (product: Product) => void;
}

const ProductComparisonChart = ({
  products,
  reviews,
  onProductSelect,
}: ProductComparisonChartProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    products.slice(0, 3).map((p) => p.id)
  );

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Calculate metrics for each product
  const productMetrics = useMemo(() => {
    return products.map((product) => {
      const productReviews = reviews.filter((r) => r.productId === product.id);
      const totalReviews = productReviews.length;
      
      if (totalReviews === 0) return {
        id: product.id,
        name: product.name,
        positivePercent: 0,
        negativePercent: 0,
        neutralPercent: 0,
        averageRating: 0,
        reviewCount: 0
      };
      
      const positiveReviews = productReviews.filter((r) => r.sentiment === "positive").length;
      const negativeReviews = productReviews.filter((r) => r.sentiment === "negative").length;
      const neutralReviews = productReviews.filter((r) => r.sentiment === "neutral").length;
      
      return {
        id: product.id,
        name: product.name,
        positivePercent: (positiveReviews / totalReviews) * 100,
        negativePercent: (negativeReviews / totalReviews) * 100,
        neutralPercent: (neutralReviews / totalReviews) * 100,
        averageRating:
          productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews,
        reviewCount: totalReviews,
      };
    });
  }, [products, reviews]);

  const filteredMetrics = productMetrics.filter((p) =>
    selectedProducts.includes(p.id)
  );

  // Prepare data for radar chart
  const radarData = useMemo(() => {
    const allKeywords = new Set<string>();
    
    // Collect all keywords from selected products
    selectedProducts.forEach(productId => {
      const productReviews = reviews.filter(r => r.productId === productId);
      productReviews.forEach(review => {
        review.keywords.forEach(keyword => {
          allKeywords.add(keyword);
        });
      });
    });
    
    // Count keyword frequencies for each product
    const keywordData = Array.from(allKeywords).map(keyword => {
      const data: { [key: string]: any } = { keyword };
      
      selectedProducts.forEach(productId => {
        const product = products.find(p => p.id === productId);
        const productName = product ? product.name : productId;
        const productReviews = reviews.filter(r => r.productId === productId);
        const keywordCount = productReviews.filter(r => 
          r.keywords.includes(keyword)
        ).length;
        
        data[productName] = keywordCount;
      });
      
      return data;
    });
    
    return keywordData;
  }, [selectedProducts, products, reviews]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Product Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-muted transition-colors"
              >
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleProductToggle(product.id)}
                  id={`product-${product.id}`}
                />
                <span
                  className="text-sm"
                  onClick={() => onProductSelect(product)}
                >
                  {product.name}
                </span>
              </label>
            ))}
          </div>

          {selectedProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Select at least one product to compare
            </div>
          ) : (
            <Tabs defaultValue="sentiment" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
              </TabsList>

              <TabsContent value="sentiment">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredMetrics}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} unit="%" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`]}
                      />
                      <Legend />
                      <Bar
                        dataKey="positivePercent"
                        name="Positive"
                        fill="#4ade80"
                        barSize={20}
                      />
                      <Bar
                        dataKey="neutralPercent"
                        name="Neutral"
                        fill="#94a3b8"
                        barSize={20}
                      />
                      <Bar
                        dataKey="negativePercent"
                        name="Negative"
                        fill="#f87171"
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="ratings">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredMetrics}
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" domain={[0, 5]} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#82ca9d"
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="averageRating"
                        name="Average Rating"
                        fill="#f59e0b"
                        barSize={30}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="reviewCount"
                        name="Review Count"
                        fill="#3b82f6"
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="keywords">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="keyword" />
                      <PolarRadiusAxis />
                      {selectedProducts.map((productId, index) => {
                        const product = products.find(p => p.id === productId);
                        if (!product) return null;
                        
                        // Generate a distinct color based on index
                        const colors = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
                        const colorIndex = index % colors.length;
                        
                        return (
                          <Radar
                            key={product.id}
                            name={product.name}
                            dataKey={product.name}
                            stroke={colors[colorIndex]}
                            fill={colors[colorIndex]}
                            fillOpacity={0.3}
                          />
                        );
                      })}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductComparisonChart;
