
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Keyword {
  keyword: string;
  count: number;
}

interface KeywordsCloudProps {
  keywords: Keyword[];
  type: "positive" | "negative" | "neutral";
}

const getColorClass = (type: "positive" | "negative" | "neutral", intensity: number) => {
  if (type === "positive") {
    if (intensity > 0.8) return "bg-green-600 text-white";
    if (intensity > 0.6) return "bg-green-500 text-white";
    if (intensity > 0.4) return "bg-green-400 text-white";
    if (intensity > 0.2) return "bg-green-300";
    return "bg-green-200";
  } else if (type === "negative") {
    if (intensity > 0.8) return "bg-red-600 text-white";
    if (intensity > 0.6) return "bg-red-500 text-white";
    if (intensity > 0.4) return "bg-red-400 text-white";
    if (intensity > 0.2) return "bg-red-300";
    return "bg-red-200";
  } else {
    if (intensity > 0.8) return "bg-slate-600 text-white";
    if (intensity > 0.6) return "bg-slate-500 text-white";
    if (intensity > 0.4) return "bg-slate-400 text-white";
    if (intensity > 0.2) return "bg-slate-300";
    return "bg-slate-200";
  }
};

const getFontSize = (count: number, max: number) => {
  const minSize = 0.8;
  const maxSize = 1.6;
  const ratio = count / max;
  const size = minSize + ratio * (maxSize - minSize);
  return `${size}rem`;
};

const KeywordsCloud = ({ keywords, type }: KeywordsCloudProps) => {
  const maxCount = Math.max(...keywords.map((k) => k.count));
  
  const getTitle = () => {
    if (type === "positive") return "Positive Keywords";
    if (type === "negative") return "Areas for Improvement";
    return "Neutral Topics";
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-center">
          {keywords.map((item) => {
            const intensity = item.count / maxCount;
            const colorClass = getColorClass(type, intensity);
            
            return (
              <div
                key={item.keyword}
                className={`px-3 py-1 rounded-full ${colorClass} transition-transform hover:scale-105`}
                style={{ fontSize: getFontSize(item.count, maxCount) }}
                title={`${item.keyword}: ${item.count} occurrences`}
              >
                {item.keyword}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordsCloud;
