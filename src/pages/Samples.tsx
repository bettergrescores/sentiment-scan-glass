
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Samples = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [previewDataset, setPreviewDataset] = useState<DatasetInfo | null>(null);
  const { toast } = useToast();
  
  // Pagination constants
  const itemsPerPage = 5;
  
  // Filter datasets based on search query
  const filteredDatasets = datasets.filter(
    dataset => dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Paginate the filtered datasets
  const paginatedDatasets = filteredDatasets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);

  const handleViewDetails = (dataset: DatasetInfo) => {
    setSelectedDataset(dataset);
  };

  const handleFilePreview = (dataset: DatasetInfo) => {
    setPreviewDataset(dataset);
    setFilePreviewOpen(true);
  };

  const handleImport = () => {
    setImportDialogOpen(true);
  };

  const handleExport = (dataset?: DatasetInfo) => {
    const datasetName = dataset ? dataset.name : "all-datasets";
    toast({
      title: "Export Started",
      description: `Exporting ${datasetName} as CSV...`,
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${datasetName}.csv has been downloaded.`,
      });
    }, 1500);
  };

  const handleUseDataset = (dataset: DatasetInfo) => {
    toast({
      title: "Dataset Selected",
      description: `${dataset.name} has been selected for analysis.`,
    });
    setSelectedDataset(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Layout>
      <DashboardHeader 
        title="Sample Data"
        subtitle="Browse and manage sample datasets"
        onRefresh={() => {
          setSearchQuery("");
          setCurrentPage(1);
          toast({
            title: "Refreshed",
            description: "Sample datasets have been refreshed",
          });
        }}
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleImport}>
                  <Upload size={16} className="mr-2" />
                  Import
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport()}
                >
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
                  {paginatedDatasets.length > 0 ? (
                    paginatedDatasets.map((dataset) => (
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
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleFilePreview(dataset)}
                              title="Preview Data"
                            >
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
              Showing {paginatedDatasets.length} of {filteredDatasets.length} datasets
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
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
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary">Fashion</Badge>
                    <Badge variant="secondary">Reviews</Badge>
                    <Badge variant="secondary">{selectedDataset.productCount} Products</Badge>
                  </div>
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
                    Click the Preview button to see sample data from this dataset.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => handleFilePreview(selectedDataset)}
                  >
                    <FileText size={16} className="mr-2" />
                    Preview Data
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedDataset(null)}>
                Close
              </Button>
              <Button 
                onClick={() => handleUseDataset(selectedDataset)}
              >
                Use Dataset
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Import Dataset</DialogTitle>
              <DialogDescription>
                Upload a CSV or Excel file containing your dataset.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center cursor-pointer hover:border-gray-400 transition-colors">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-center text-gray-500 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-center text-gray-400">
                  CSV, Excel or JSON (max 10MB)
                </p>
                <Input 
                  type="file" 
                  className="hidden" 
                  accept=".csv,.xlsx,.json"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setImportDialogOpen(false);
                  toast({
                    title: "Import Successful",
                    description: "Your dataset has been uploaded successfully.",
                  });
                }}
                disabled
              >
                Upload & Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* File Preview Dialog */}
        <Dialog open={filePreviewOpen} onOpenChange={setFilePreviewOpen}>
          <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{previewDataset?.name} - Data Preview</DialogTitle>
              <DialogDescription>
                A preview of the raw data in this dataset.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="products" className="flex-grow overflow-hidden flex flex-col">
              <TabsList className="mb-2">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products" className="flex-grow overflow-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(12)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>PRD-{(10000 + i).toString().substring(1)}</TableCell>
                        <TableCell>{['Summer Dress', 'Casual Jeans', 'Evening Gown', 'Leather Jacket', 'Cotton Blouse'][i % 5]} {i}</TableCell>
                        <TableCell>{['Dresses', 'Pants', 'Formal', 'Outerwear', 'Tops'][i % 5]}</TableCell>
                        <TableCell>${Math.floor(20 + Math.random() * 180)}</TableCell>
                        <TableCell>{(3 + Math.random() * 2).toFixed(1)} ★</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="reviews" className="flex-grow overflow-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(12)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>REV-{(10000 + i).toString().substring(1)}</TableCell>
                        <TableCell>{['Summer Dress', 'Casual Jeans', 'Evening Gown', 'Leather Jacket', 'Cotton Blouse'][i % 5]} {i % 5}</TableCell>
                        <TableCell>{1 + Math.floor(Math.random() * 5)} ★</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {[
                            "Love this product! The quality is amazing.",
                            "Good fit but the color was not what I expected.",
                            "Comfortable but ran a bit small.",
                            "Perfect for the occasion, highly recommend.",
                            "Disappointed with the material quality."
                          ][i % 5]}
                        </TableCell>
                        <TableCell>
                          {new Date(2023, (i % 12), 1 + (i % 28)).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setFilePreviewOpen(false)}
              >
                Close
              </Button>
              <Button onClick={() => {
                handleExport(previewDataset!);
                setFilePreviewOpen(false);
              }}>
                <Download size={16} className="mr-2" />
                Export Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Samples;
