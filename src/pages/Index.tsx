
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import DatasetSelector from "@/components/DatasetSelector";
import SentimentDistribution from "@/components/SentimentDistribution";
import SentimentTrend from "@/components/SentimentTrend";
import TopProducts from "@/components/TopProducts";
import KeywordsCloud from "@/components/KeywordsCloud";
import InsightsCard from "@/components/InsightsCard";
import { 
  getDatasetContent, 
  getSentimentBreakdown,
  getSentimentOverTime,
  getTopProducts,
  getTopKeywords,
} from "@/data/mockData";

const Dashboard = () => {
  // State for selected dataset
  const [selectedDataset, setSelectedDataset] = useState("womens-apparel");
  const [loading, setLoading] = useState(true);
  
  // State for dataset content
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Derived data states
  const [sentimentData, setSentimentData] = useState({ positive: 0, negative: 0, neutral: 0 });
  const [sentimentTrend, setSentimentTrend] = useState([]);
  const [topPositiveProducts, setTopPositiveProducts] = useState([]);
  const [topNegativeProducts, setTopNegativeProducts] = useState([]);
  const [positiveKeywords, setPositiveKeywords] = useState([]);
  const [negativeKeywords, setNegativeKeywords] = useState([]);
  
  // Effect to load data when selected dataset changes
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const { products, reviews } = getDatasetContent(selectedDataset);
      setProducts(products);
      setReviews(reviews);
      
      // Calculate derived data
      setSentimentData(getSentimentBreakdown(reviews));
      setSentimentTrend(getSentimentOverTime(reviews));
      setTopPositiveProducts(getTopProducts(products, reviews, "positive"));
      setTopNegativeProducts(getTopProducts(products, reviews, "negative"));
      setPositiveKeywords(getTopKeywords(reviews, "positive"));
      setNegativeKeywords(getTopKeywords(reviews, "neutral"));
      
      setLoading(false);
    }, 500);
  }, [selectedDataset]);
  
  // Handle dataset selection
  const handleDatasetChange = (datasetId: string) => {
    setSelectedDataset(datasetId);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    // Re-fetch data for current dataset
    setLoading(true);
    
    setTimeout(() => {
      const { products, reviews } = getDatasetContent(selectedDataset);
      setProducts(products);
      setReviews(reviews);
      
      // Recalculate derived data
      setSentimentData(getSentimentBreakdown(reviews));
      setSentimentTrend(getSentimentOverTime(reviews));
      setTopPositiveProducts(getTopProducts(products, reviews, "positive"));
      setTopNegativeProducts(getTopProducts(products, reviews, "negative"));
      setPositiveKeywords(getTopKeywords(reviews, "positive"));
      setNegativeKeywords(getTopKeywords(reviews, "neutral"));
      
      setLoading(false);
    }, 500);
  };
  
  return (
    <Layout>
      <DashboardHeader 
        title="Fashion Feedback Dashboard"
        subtitle="Review insights and sentiment analysis"
        onRefresh={handleRefresh}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Dataset selection and sentiment overview */}
        <div className="space-y-6">
          <DatasetSelector 
            selectedDataset={selectedDataset}
            onSelectDataset={handleDatasetChange}
          />
          <SentimentDistribution data={sentimentData} />
        </div>
        
        {/* Middle column - Charts and trends */}
        <div className="space-y-6">
          <SentimentTrend data={sentimentTrend} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <KeywordsCloud keywords={positiveKeywords} type="positive" />
            <KeywordsCloud keywords={negativeKeywords} type="negative" />
          </div>
        </div>
        
        {/* Right column - Products and insights */}
        <div className="space-y-6">
          <TopProducts products={topPositiveProducts} type="positive" />
          <TopProducts products={topNegativeProducts} type="negative" />
          <InsightsCard reviews={reviews} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
