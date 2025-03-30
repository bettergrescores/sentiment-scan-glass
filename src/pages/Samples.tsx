
import { useState } from "react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { DatasetInfo, datasets } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Download, Eye, FileText, Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

const Samples = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(null);
  
  const filteredDatasets = datasets.filter(
    dataset => dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (dataset: DatasetInfo) => {
    setSelectedDataset(dataset);
  };

  return (
    <Layout>
      <DashboardHeader 
        title="Sample Data"
        subtitle="Browse and manage sample datasets"
        onRefresh={() => setSearchQuery("")}
      />
      
      <div className="grid gap-6">
        {/* Search and Actions Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search datasets..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload size={16} className="mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Available Datasets</CardTitle>
            <CardDescription>Select a dataset to use in your analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Products</TableHead>
                    <TableHead className="text-center">Reviews</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDatasets.length > 0 ? (
                    filteredDatasets.map((dataset) => (
                      <TableRow key={dataset.id}>
                        <TableCell className="font-medium">{dataset.name}</TableCell>
                        <TableCell>{dataset.description}</TableCell>
                        <TableCell className="text-center">{dataset.productCount}</TableCell>
                        <TableCell className="text-center">{dataset.reviewCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(dataset)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                        No datasets found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredDatasets.length} of {datasets.length} datasets
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>

        {/* Dataset Details */}
        {selectedDataset && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedDataset.name}</CardTitle>
              <CardDescription>Dataset Details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedDataset.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Products</h4>
                    <p className="text-2xl font-bold">{selectedDataset.productCount}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Reviews</h4>
                    <p className="text-2xl font-bold">{selectedDataset.reviewCount}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-4">Sample Products & Reviews</h4>
                <div className="rounded-md bg-muted p-6 text-center">
                  <p className="text-muted-foreground">
                    Preview functionality will be available in the next update.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedDataset(null)}>
                Close
              </Button>
              <Button>
                Use Dataset
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Samples;
