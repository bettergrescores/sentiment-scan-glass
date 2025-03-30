
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FilterIcon, RefreshCcw } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onRefresh?: () => void;
}

const DashboardHeader = ({ title, subtitle, onRefresh }: DashboardHeaderProps) => {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    // Update date once per minute
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 flex items-center gap-2 mt-1">
          <CalendarIcon size={14} />
          <span>{formattedDate}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-sm">{subtitle}</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <FilterIcon size={16} className="mr-2" />
          Filter
        </Button>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCcw size={16} className="mr-2" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
