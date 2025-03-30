
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { datasets, DatasetInfo } from "@/data/mockData";

interface DatasetSelectorProps {
  selectedDataset: string;
  onSelectDataset: (datasetId: string) => void;
}

const DatasetSelector = ({ selectedDataset, onSelectDataset }: DatasetSelectorProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">Sample Datasets</h3>
        <RadioGroup value={selectedDataset} onValueChange={onSelectDataset} className="space-y-2">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value={dataset.id} id={dataset.id} className="mt-1" />
              <div className="flex-grow">
                <Label htmlFor={dataset.id} className="font-medium cursor-pointer">
                  {dataset.name}
                </Label>
                <p className="text-sm text-gray-500">{dataset.description}</p>
                <div className="flex space-x-4 mt-1 text-xs text-gray-500">
                  <span>{dataset.productCount} products</span>
                  <span>{dataset.reviewCount} reviews</span>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default DatasetSelector;
