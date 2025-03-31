import { useState } from "react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SentimentDistribution from "@/components/SentimentDistribution";
import SentimentTrend from "@/components/SentimentTrend";
import KeywordsCloud from "@/components/KeywordsCloud";
import ReviewExplorer from "@/components/ReviewExplorer";
import {
  getDatasetContent,
  getSentimentBreakdown,
  getSentimentOverTime,
  getTopKeywords,
  datasets
} from "@/data/mockData";
import DatasetSelector from "@/components/DatasetSelector";

const SentimentAnalysis = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0].id);
  const { reviews } = getDatasetContent(selectedDatasetId);
  
  // Get sentiment data
  const sentimentData = getSentimentBreakdown(reviews);
  const trendData = getSentimentOverTime(reviews);
  const positiveKeywords = getTopKeywords(reviews, "positive", 15);
  const negativeKeywords = getTopKeywords(reviews, "negative", 15);
  const neutralKeywords = getTopKeywords(reviews, "neutral", 15);

  return (
    <Layout>
      <DashboardHeader 
        title="Sentiment Analysis"
        subtitle="Detailed review sentiment breakdown"
      />
      
      <div className="mb-6">
        <DatasetSelector 
          selectedDataset={selectedDatasetId}
          onSelectDataset={setSelectedDatasetId}
        />
      </div>

      <div className="grid gap-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SentimentDistribution data={sentimentData} />
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sentiment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <h3 className="font-medium">Key Findings</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                          {sentimentData.positive > sentimentData.negative 
                            ? `Positive sentiment is dominant (${((sentimentData.positive / (sentimentData.positive + sentimentData.negative + sentimentData.neutral)) * 100).toFixed(1)}% of reviews)`
                            : `Negative sentiment is concerning (${((sentimentData.negative / (sentimentData.positive + sentimentData.negative + sentimentData.neutral)) * 100).toFixed(1)}% of reviews)`}
                        </li>
                        <li>
                          {trendData.length > 1 && 
                            `${trendData[trendData.length - 1].positive > trendData[0].positive 
                              ? "Positive sentiment is trending upward"
                              : "Positive sentiment is trending downward"} over the last 6 months`}
                        </li>
                        <li>
                          Top positive keyword: {positiveKeywords[0]?.keyword || "N/A"}
                        </li>
                        <li>
                          Top area for improvement: {negativeKeywords[0]?.keyword || "N/A"}
                        </li>
                      </ul>
                    </div>
                    
                    <div className="grid gap-2">
                      <h3 className="font-medium">Recommended Actions</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                          {sentimentData.negative > sentimentData.positive * 0.5
                            ? "Investigate negative sentiment drivers as a priority"
                            : "Continue building on positive sentiment drivers"}
                        </li>
                        <li>
                          {`Focus improvement efforts on "${negativeKeywords[0]?.keyword || "product quality"}" concerns`}
                        </li>
                        <li>
                          {`Highlight "${positiveKeywords[0]?.keyword || "positive aspects"}" in marketing materials`}
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <SentimentTrend data={trendData} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sentiment Anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendData.length > 1 ? (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Notable Shifts</h3>
                      <ul className="space-y-3">
                        {(() => {
                          const shifts = [];
                          for (let i = 1; i < trendData.length; i++) {
                            const prevMonth = trendData[i-1];
                            const currMonth = trendData[i];
                            
                            // Calculate percentage changes
                            const posChange = ((currMonth.positive - prevMonth.positive) / prevMonth.positive) * 100;
                            const negChange = ((currMonth.negative - prevMonth.negative) / prevMonth.negative) * 100;
                            
                            // Add significant changes to the list
                            if (Math.abs(posChange) > 15) {
                              const [year, month] = currMonth.month.split('-');
                              const date = new Date(parseInt(year), parseInt(month) - 1);
                              const monthName = date.toLocaleString('default', { month: 'long' });
                              
                              shifts.push(
                                <li key={`pos-${currMonth.month}`} className="flex items-center gap-2">
                                  <span className={`inline-block w-3 h-3 rounded-full ${posChange > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  <span>
                                    {monthName}: Positive sentiment 
                                    <strong className={posChange > 0 ? 'text-green-600' : 'text-red-600'}>
                                      {` ${posChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(posChange).toFixed(1)}%`}
                                    </strong>
                                  </span>
                                </li>
                              );
                            }
                            
                            if (Math.abs(negChange) > 15) {
                              const [year, month] = currMonth.month.split('-');
                              const date = new Date(parseInt(year), parseInt(month) - 1);
                              const monthName = date.toLocaleString('default', { month: 'long' });
                              
                              shifts.push(
                                <li key={`neg-${currMonth.month}`} className="flex items-center gap-2">
                                  <span className={`inline-block w-3 h-3 rounded-full ${negChange > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                  <span>
                                    {monthName}: Negative sentiment 
                                    <strong className={negChange > 0 ? 'text-red-600' : 'text-green-600'}>
                                      {` ${negChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(negChange).toFixed(1)}%`}
                                    </strong>
                                  </span>
                                </li>
                              );
                            }
                          }
                          
                          return shifts.length > 0 ? shifts : (
                            <li className="text-muted-foreground text-sm">No significant sentiment shifts detected</li>
                          );
                        })()}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Not enough trend data available for anomaly detection</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <KeywordsCloud keywords={positiveKeywords} type="positive" />
              <KeywordsCloud keywords={neutralKeywords} type="neutral" />
              <KeywordsCloud keywords={negativeKeywords} type="negative" />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Keyword Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <h3 className="font-medium mb-2">Top Positive Keywords</h3>
                    <ul className="space-y-2">
                      {positiveKeywords.slice(0, 5).map((item, index) => (
                        <li key={item.keyword} className="flex justify-between">
                          <span>{index + 1}. {item.keyword}</span>
                          <span className="text-green-600 font-medium">{item.count} mentions</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Top Neutral Keywords</h3>
                    <ul className="space-y-2">
                      {neutralKeywords.slice(0, 5).map((item, index) => (
                        <li key={item.keyword} className="flex justify-between">
                          <span>{index + 1}. {item.keyword}</span>
                          <span className="text-slate-600 font-medium">{item.count} mentions</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Top Negative Keywords</h3>
                    <ul className="space-y-2">
                      {negativeKeywords.slice(0, 5).map((item, index) => (
                        <li key={item.keyword} className="flex justify-between">
                          <span>{index + 1}. {item.keyword}</span>
                          <span className="text-red-600 font-medium">{item.count} mentions</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewExplorer reviews={reviews} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SentimentAnalysis;
