import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";
import { Review } from "@/data/mockData";
interface InsightsCardProps {
  reviews: Review[];
}
const InsightsCard = ({
  reviews
}: InsightsCardProps) => {
  // Generate some sample insights based on the review data
  const generateInsights = (reviews: Review[]) => {
    const positiveReviews = reviews.filter(r => r.sentiment === "positive").length;
    const negativeReviews = reviews.filter(r => r.sentiment === "negative").length;
    const totalReviews = reviews.length;
    const positivePercentage = positiveReviews / totalReviews * 100;
    const negativePercentage = negativeReviews / totalReviews * 100;
    const insights = [];

    // Overall sentiment insight
    if (positivePercentage > 70) {
      insights.push("Products are being very well-received with over 70% positive feedback.");
    } else if (positivePercentage > 50) {
      insights.push("Products are generally well-received with moderate positive feedback.");
    } else if (negativePercentage > 40) {
      insights.push("There is a concerning level of negative feedback that requires attention.");
    }

    // Common keywords insights
    const positiveKeywords = new Map<string, number>();
    const negativeKeywords = new Map<string, number>();
    reviews.forEach(review => {
      if (review.sentiment === "positive") {
        review.keywords.forEach(keyword => {
          positiveKeywords.set(keyword, (positiveKeywords.get(keyword) || 0) + 1);
        });
      } else if (review.sentiment === "negative") {
        review.keywords.forEach(keyword => {
          negativeKeywords.set(keyword, (negativeKeywords.get(keyword) || 0) + 1);
        });
      }
    });

    // Find most common positive and negative keywords
    let topPositiveKeyword = "";
    let topPositiveCount = 0;
    let topNegativeKeyword = "";
    let topNegativeCount = 0;
    positiveKeywords.forEach((count, keyword) => {
      if (count > topPositiveCount) {
        topPositiveCount = count;
        topPositiveKeyword = keyword;
      }
    });
    negativeKeywords.forEach((count, keyword) => {
      if (count > topNegativeCount) {
        topNegativeCount = count;
        topNegativeKeyword = keyword;
      }
    });
    if (topPositiveKeyword) {
      const percentage = (topPositiveCount / positiveReviews * 100).toFixed(1);
      insights.push(`${percentage}% of positive reviews mention "${topPositiveKeyword}" as a key factor.`);
    }
    if (topNegativeKeyword) {
      const percentage = (topNegativeCount / negativeReviews * 100).toFixed(1);
      insights.push(`${percentage}% of negative reviews mention "${topNegativeKeyword}" as a concern.`);
    }

    // Add a recommendation based on the most common negative keyword
    if (topNegativeKeyword) {
      insights.push(`Consider addressing "${topNegativeKeyword}" issues to improve customer satisfaction.`);
    }
    return insights;
  };
  const insights = generateInsights(reviews);
  return <Card className="h-half">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          AI-Generated Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.map((insight, index) => <li key={index} className="flex gap-2 items-start">
              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p>{insight}</p>
            </li>)}
        </ul>
      </CardContent>
    </Card>;
};
export default InsightsCard;