import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  imageUrl: string;
  releaseDate: string;
}

interface Review {
  id: string;
  productId: string;
  text: string;
  rating: number;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  date: string;
  keywords: string[];
}

interface ProductAttributeAnalysisProps {
  products: Product[];
  reviews: Review[];
}

const ProductAttributeAnalysis = ({ products, reviews }: ProductAttributeAnalysisProps) => {
  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [priceRangeData, setPriceRangeData] = useState([]);

  useEffect(() => {
    // Category Analysis
    const categoryCounts: { [category: string]: number } = {};
    products.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    const categoryAnalysis = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
    setCategoryData(categoryAnalysis);

    // Subcategory Analysis
    const subcategoryCounts: { [subcategory: string]: number } = {};
    products.forEach(product => {
      subcategoryCounts[product.subCategory] = (subcategoryCounts[product.subCategory] || 0) + 1;
    });
    const subcategoryAnalysis = Object.entries(subcategoryCounts).map(([subcategory, count]) => ({
      subcategory,
      count,
    }));
    setSubcategoryData(subcategoryAnalysis);

    // Price Range Analysis
    const priceRanges = [
      { range: "Under $50", min: 0, max: 50 },
      { range: "$50 - $100", min: 50, max: 100 },
      { range: "$100 - $150", min: 100, max: 150 },
      { range: "Over $150", min: 150, max: Infinity },
    ];
    const priceRangeCounts = priceRanges.map(range => {
      const count = products.filter(product => product.price >= range.min && product.price < range.max).length;
      return {
        range: range.range,
        count,
      };
    });
    setPriceRangeData(priceRangeCounts);
  }, [products]);

  const renderBarChart = (data: any[], dataKey: string, nameKey: string, title: string) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} products`, 'Products']} />
              <Legend />
              <Bar dataKey={dataKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderSentimentAnalysis = () => {
    const categorySentiment: { [category: string]: { positive: number; negative: number; total: number } } = {};

    products.forEach(product => {
      categorySentiment[product.category] = categorySentiment[product.category] || { positive: 0, negative: 0, total: 0 };
    });

    reviews.forEach(review => {
      const product = products.find(p => p.id === review.productId);
      if (product) {
        categorySentiment[product.category].total++;
        if (review.sentiment === "positive") {
          categorySentiment[product.category].positive++;
        } else if (review.sentiment === "negative") {
          categorySentiment[product.category].negative++;
        }
      }
    });

    const sentimentData = Object.entries(categorySentiment).map(([category, sentiment]) => ({
      category,
      positive: sentiment.positive,
      negative: sentiment.negative,
      total: sentiment.total,
      positivePercent: sentiment.total > 0 ? sentiment.positive / sentiment.total : 0,
      negativePercent: sentiment.total > 0 ? sentiment.negative / sentiment.total : 0,
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`} />
              <Tooltip formatter={(value: number) => {
                if (typeof value === 'number') {
                  return `${(value * 100).toFixed(1)}%`;
                }
                return '0';
              }} />
              <Legend />
              <Bar dataKey="positivePercent" fill="#4ade80" name="Positive Sentiment" />
              <Bar dataKey="negativePercent" fill="#f87171" name="Negative Sentiment" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderKeywordAnalysis = () => {
    const categoryKeywords: { [category: string]: { [keyword: string]: number } } = {};

    products.forEach(product => {
      categoryKeywords[product.category] = {};
    });

    reviews.forEach(review => {
      const product = products.find(p => p.id === review.productId);
      if (product) {
        review.keywords.forEach(keyword => {
          categoryKeywords[product.category][keyword] = (categoryKeywords[product.category][keyword] || 0) + 1;
        });
      }
    });

    const keywordData = Object.entries(categoryKeywords).map(([category, keywords]) => {
      const totalKeywords = Object.values(keywords).reduce((sum, count) => sum + count, 0);
      const keywordPercentages = Object.entries(keywords).map(([keyword, count]) => ({
        keyword,
        value: totalKeywords > 0 ? count / totalKeywords : 0,
      }));
      return {
        category,
        keywords: keywordPercentages.sort((a, b) => b.value - a.value).slice(0, 5),
      };
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Keywords by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywordData.map(item => (
              <div key={item.category}>
                <h3 className="text-lg font-medium mb-2">{item.category}</h3>
                <ul>
                  {item.keywords.map(keyword => (
                    <li key={keyword.keyword} className="flex justify-between">
                      <span>{keyword.keyword}</span>
                      <span>{typeof keyword.value === 'number' ? (keyword.value * 100).toFixed(1) : '0'}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderBarChart(categoryData, "count", "category", "Products by Category")}
      {renderBarChart(subcategoryData, "count", "subcategory", "Products by Subcategory")}
      {renderBarChart(priceRangeData, "count", "range", "Products by Price Range")}
      {renderSentimentAnalysis()}
      {renderKeywordAnalysis()}
    </div>
  );
};

export default ProductAttributeAnalysis;
