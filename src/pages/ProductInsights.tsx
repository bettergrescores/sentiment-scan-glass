
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";

const ProductInsights = () => {
  return (
    <Layout>
      <DashboardHeader 
        title="Product Insights"
        subtitle="In-depth product performance analysis"
      />
      <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
        <h2 className="text-2xl font-medium text-gray-600">Coming Soon</h2>
        <p className="text-gray-500 mt-2">
          The product insights page will be available in the next phase.
        </p>
      </div>
    </Layout>
  );
};

export default ProductInsights;
