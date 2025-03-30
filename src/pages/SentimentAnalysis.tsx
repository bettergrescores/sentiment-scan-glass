
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";

const SentimentAnalysis = () => {
  return (
    <Layout>
      <DashboardHeader 
        title="Sentiment Analysis"
        subtitle="Detailed review sentiment breakdown"
      />
      <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
        <h2 className="text-2xl font-medium text-gray-600">Coming Soon</h2>
        <p className="text-gray-500 mt-2">
          The detailed sentiment analysis page will be available in the next phase.
        </p>
      </div>
    </Layout>
  );
};

export default SentimentAnalysis;
