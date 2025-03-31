import { useState } from "react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopProducts from "@/components/TopProducts";
import ProductComparisonChart from "@/components/ProductComparisonChart";
import ProductAttributeAnalysis from "@/components/ProductAttributeAnalysis";
import ProductDetailView from "@/components/ProductDetailView";
import {
  getDatasetContent,
  getTopProducts,
  datasets,
  Product
} from "@/data/mockData";
import DatasetSelector from "@/components/DatasetSelector";

const ProductInsights = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0].id);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, reviews } = getDatasetContent(selectedDatasetId);
  
  const topPositiveProducts = getTopProducts(products, reviews, "positive", 5);
  const topNegativeProducts = getTopProducts(products, reviews, "negative", 5);
  
  // Handle product selection for detailed view
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <Layout>
      <DashboardHeader 
        title="Product Insights"
        subtitle="In-depth product performance analysis"
      />
      
      <div className="mb-6">
        <DatasetSelector 
          selectedDataset={selectedDatasetId}
          onSelectDataset={setSelectedDatasetId}
        />
      </div>

      <div className="grid gap-6">
        {selectedProduct ? (
          <div className="space-y-4">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="flex items-center text-sm font-medium text-primary hover:underline"
            >
              ← Back to Product Overview
            </button>
            <ProductDetailView 
              product={selectedProduct} 
              reviews={reviews.filter(review => review.productId === selectedProduct.id)} 
            />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TopProducts products={topPositiveProducts} type="positive" onProductSelect={handleProductSelect} />
                <TopProducts products={topNegativeProducts} type="negative" onProductSelect={handleProductSelect} />
              </div>
              
              <ProductOverview products={products} reviews={reviews} />
            </TabsContent>
            
            <TabsContent value="comparison">
              <ProductComparisonChart 
                products={products.slice(0, 5)} 
                reviews={reviews} 
                onProductSelect={handleProductSelect}
              />
            </TabsContent>
            
            <TabsContent value="attributes">
              <ProductAttributeAnalysis products={products} reviews={reviews} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

const ProductOverview = ({ products, reviews }: { products: Product[], reviews: any[] }) => {
  const categories = [...new Set(products.map(p => p.category))];
  const reviewsPerCategory = categories.map(category => {
    const categoryProducts = products.filter(p => p.category === category);
    const categoryProductIds = categoryProducts.map(p => p.id);
    const categoryReviews = reviews.filter(r => categoryProductIds.includes(r.productId));
    const positiveCount = categoryReviews.filter(r => r.sentiment === "positive").length;
    const negativeCount = categoryReviews.filter(r => r.sentiment === "negative").length;
    const sentimentScore = categoryReviews.length > 0 ? 
      positiveCount / categoryReviews.length : 0;
    
    return {
      category,
      productCount: categoryProducts.length,
      reviewCount: categoryReviews.length,
      sentimentScore,
    };
  });
  
  reviewsPerCategory.sort((a, b) => b.sentimentScore - a.sentimentScore);
  
  return (
    <div className="grid gap-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-medium mb-4">Product Categories Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviewsPerCategory.map(item => (
            <div key={item.category} className="p-4 border rounded-md bg-muted/50">
              <h4 className="font-medium">{item.category}</h4>
              <div className="mt-2 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Products:</span>
                  <span>{item.productCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviews:</span>
                  <span>{item.reviewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sentiment:</span>
                  <span className={item.sentimentScore > 0.6 ? 'text-green-600' : item.sentimentScore < 0.4 ? 'text-red-600' : 'text-amber-600'}>
                    {Math.round(item.sentimentScore * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInsights;
