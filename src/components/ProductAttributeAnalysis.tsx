
import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Product, Review } from "@/data/mockData";

interface ProductAttributeAnalysisProps {
  products: Product[];
  reviews: Review[];
}

const ProductAttributeAnalysis = ({
  products,
  reviews,
}: ProductAttributeAnalysisProps) => {
  const [selectedAttribute, setSelectedAttribute] = useState<string>("category");

  // Extract unique attributes
  const attributes = useMemo(() => {
    const attributeMap = {
      category: [...new Set(products.map((p) => p.category))],
      subCategory: [...new Set(products.map((p) => p.subCategory))],
      price: ["0-25", "26-50", "51-75", "76-100", "100+"],
    };
    return attributeMap;
  }, [products]);

  // Group products by selected attribute
  const attributeData = useMemo(() => {
    let groupedData: Record<string, { products: Product[]; reviews: Review[] }> = {};
    
    if (selectedAttribute === "price") {
      // Group by price range
      groupedData = {
        "0-25": { products: [], reviews: [] },
        "26-50": { products: [], reviews: [] },
        "51-75": { products: [], reviews: [] },
        "76-100": { products: [], reviews: [] },
        "100+": { products: [], reviews: [] },
      };
      
      products.forEach(product => {
        let priceRange = "100+";
        if (product.price <= 25) priceRange = "0-25";
        else if (product.price <= 50) priceRange = "26-50";
        else if (product.price <= 75) priceRange = "51-75";
        else if (product.price <= 100) priceRange = "76-100";
        
        groupedData[priceRange].products.push(product);
        groupedData[priceRange].reviews.push(
          ...reviews.filter(r => r.productId === product.id)
        );
      });
    } else {
      // Group by category or subCategory
      products.forEach(product => {
        const attributeValue = product[selectedAttribute as keyof Product] as string;
        if (!groupedData[attributeValue]) {
          groupedData[attributeValue] = { products: [], reviews: [] };
        }
        
        groupedData[attributeValue].products.push(product);
        groupedData[attributeValue].reviews.push(
          ...reviews.filter(r => r.productId === product.id)
        );
      });
    }
    
    // Calculate metrics for each attribute value
    return Object.entries(groupedData).map(([attribute, data]) => {
      const { products, reviews } = data;
      const totalReviews = reviews.length;
      
      if (totalReviews === 0) {
        return {
          attribute,
          positivePercent: 0,
          negativePercent: 0,
          neutralPercent: 0,
          avgRating: 0,
          productCount: products.length,
          reviewCount: 0
        };
      }
      
      const positiveReviews = reviews.filter(r => r.sentiment === "positive").length;
      const negativeReviews = reviews.filter(r => r.sentiment === "negative").length;
      const neutralReviews = reviews.filter(r => r.sentiment === "neutral").length;
      
      return {
        attribute,
        positivePercent: (positiveReviews / totalReviews) * 100,
        negativePercent: (negativeReviews / totalReviews) * 100,
        neutralPercent: (neutralReviews / totalReviews) * 100,
        avgRating: reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews,
        productCount: products.length,
        reviewCount: totalReviews
      };
    }).filter(item => item.reviewCount > 0);
    
  }, [products, reviews, selectedAttribute]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Product Attribute Analysis</CardTitle>
        <Select
          value={selectedAttribute}
          onValueChange={(value) => setSelectedAttribute(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select attribute" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="subCategory">Subcategory</SelectItem>
            <SelectItem value="price">Price Range</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Sentiment Distribution by Attribute */}
          <div className="h-96">
            <h3 className="text-sm font-medium mb-2">Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attributeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="attribute"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`]} />
                <Legend />
                <Bar
                  dataKey="positivePercent"
                  name="Positive"
                  stackId="stack"
                  fill="#4ade80"
                />
                <Bar
                  dataKey="neutralPercent"
                  name="Neutral"
                  stackId="stack"
                  fill="#94a3b8"
                />
                <Bar
                  dataKey="negativePercent"
                  name="Negative"
                  stackId="stack"
                  fill="#f87171"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Average Rating by Attribute */}
          <div className="h-96">
            <h3 className="text-sm font-medium mb-2">Average Rating</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attributeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="attribute"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, 5]} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "avgRating"
                      ? `${value.toFixed(1)} stars`
                      : value,
                    name === "avgRating" ? "Average Rating" : name,
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="avgRating"
                  name="Average Rating"
                  fill="#f59e0b"
                  barSize={30}
                >
                  {attributeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.avgRating >= 4
                          ? "#4ade80"
                          : entry.avgRating >= 3
                          ? "#fbbf24"
                          : "#f87171"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attribute Statistics Table */}
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-3">
            {selectedAttribute === "category"
              ? "Category Statistics"
              : selectedAttribute === "subCategory"
              ? "Subcategory Statistics"
              : "Price Range Statistics"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-2 border-b">
                    {selectedAttribute === "price"
                      ? "Price Range"
                      : selectedAttribute === "category"
                      ? "Category"
                      : "Subcategory"}
                  </th>
                  <th className="text-center p-2 border-b">Products</th>
                  <th className="text-center p-2 border-b">Reviews</th>
                  <th className="text-center p-2 border-b">Avg. Rating</th>
                  <th className="text-center p-2 border-b">Positive</th>
                  <th className="text-center p-2 border-b">Neutral</th>
                  <th className="text-center p-2 border-b">Negative</th>
                </tr>
              </thead>
              <tbody>
                {attributeData.map((item) => (
                  <tr key={item.attribute} className="hover:bg-muted/50">
                    <td className="p-2 border-b font-medium">
                      {item.attribute}
                    </td>
                    <td className="text-center p-2 border-b">
                      {item.productCount}
                    </td>
                    <td className="text-center p-2 border-b">
                      {item.reviewCount}
                    </td>
                    <td className="text-center p-2 border-b">
                      <span
                        className={
                          item.avgRating >= 4
                            ? "text-green-600"
                            : item.avgRating >= 3
                            ? "text-amber-600"
                            : "text-red-600"
                        }
                      >
                        {item.avgRating.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-center p-2 border-b text-green-600">
                      {item.positivePercent.toFixed(1)}%
                    </td>
                    <td className="text-center p-2 border-b text-slate-600">
                      {item.neutralPercent.toFixed(1)}%
                    </td>
                    <td className="text-center p-2 border-b text-red-600">
                      {item.negativePercent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAttributeAnalysis;
