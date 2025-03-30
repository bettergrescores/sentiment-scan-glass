
import { useState } from "react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, FilePlus, Download, Calendar, BarChart2, Search, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Report templates and types
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: "sentiment" | "product" | "trend" | "comparison";
  createdAt: string;
}

interface SavedReport {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  createdAt: string;
  lastRun: string;
}

// Mock data for report templates
const reportTemplates: ReportTemplate[] = [
  {
    id: "template-1",
    name: "Sentiment Overview",
    description: "Comprehensive analysis of sentiment across all products",
    type: "sentiment",
    createdAt: "2023-06-15",
  },
  {
    id: "template-2",
    name: "Product Performance",
    description: "Detailed insights into individual product feedback",
    type: "product", 
    createdAt: "2023-07-02",
  },
  {
    id: "template-3",
    name: "Trend Analysis",
    description: "Monthly trend report with key insights",
    type: "trend",
    createdAt: "2023-08-17",
  },
  {
    id: "template-4",
    name: "Comparative Analysis",
    description: "Compare sentiment across different product categories",
    type: "comparison",
    createdAt: "2023-09-05",
  },
];

// Mock data for saved reports
const savedReports: SavedReport[] = [
  {
    id: "report-1",
    name: "Q3 2023 Sentiment Report",
    templateId: "template-1",
    templateName: "Sentiment Overview",
    createdAt: "2023-10-01",
    lastRun: "2023-10-01",
  },
  {
    id: "report-2",
    name: "Summer Collection Analysis",
    templateId: "template-2",
    templateName: "Product Performance",
    createdAt: "2023-09-15",
    lastRun: "2023-09-20",
  },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState<"templates" | "saved">("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportTemplate, setReportTemplate] = useState<ReportTemplate | null>(null);
  const [viewingReport, setViewingReport] = useState<SavedReport | null>(null);
  const [customReportDialog, setCustomReportDialog] = useState(false);
  const { toast } = useToast();
  
  // Filter templates or saved reports based on search query
  const filteredTemplates = reportTemplates.filter(
    template => template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSavedReports = savedReports.filter(
    report => report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              report.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateReport = (template: ReportTemplate) => {
    setReportTemplate(template);
    setGeneratingReport(true);
    
    // Simulate report generation
    toast({
      title: "Generating report",
      description: `Starting generation of ${template.name}`,
    });
    
    // Simulate report generation with a delay
    setTimeout(() => {
      setGeneratingReport(false);
      setReportTemplate(null);
      
      // Create a new "saved" report
      const newReport = {
        id: `report-${savedReports.length + 1}`,
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        templateId: template.id,
        templateName: template.name,
        createdAt: new Date().toISOString().split('T')[0],
        lastRun: new Date().toISOString().split('T')[0],
      };
      
      // In a real app, we would add this to the savedReports array
      // For demo purposes, we'll just show a success message
      toast({
        title: "Report generated",
        description: "Your report has been successfully generated and saved",
      });
    }, 3000);
  };

  const handleCancelGeneration = () => {
    setGeneratingReport(false);
    setReportTemplate(null);
    toast({
      title: "Cancelled",
      description: "Report generation has been cancelled",
      variant: "destructive",
    });
  };

  const handleViewReport = (report: SavedReport) => {
    setViewingReport(report);
    toast({
      title: "Opening report",
      description: `Viewing ${report.name}`,
    });
  };

  const handleDownloadReport = (report: SavedReport) => {
    toast({
      title: "Downloading report",
      description: `${report.name} will be downloaded shortly`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${report.name} has been downloaded`,
      });
    }, 2000);
  };

  const handleCreateCustomReport = () => {
    setCustomReportDialog(true);
  };

  const handleSaveCustomReport = () => {
    setCustomReportDialog(false);
    toast({
      title: "Custom report created",
      description: "Your custom report has been saved",
    });
  };

  return (
    <Layout>
      <DashboardHeader 
        title="Reports"
        subtitle="Generate custom reports and analytics"
        onRefresh={() => setSearchQuery("")}
      />
      
      <div className="grid gap-6">
        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "templates" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("templates")}
                >
                  Templates
                </Button>
                <Button 
                  variant={activeTab === "saved" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("saved")}
                >
                  Saved Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        {activeTab === "templates" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Choose a template to generate a new report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.length > 0 ? (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>{template.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {template.type === "sentiment" && (
                                <Badge variant="tag" className="flex items-center gap-1">
                                  <BarChart2 size={14} className="text-blue-500" />
                                  Sentiment
                                </Badge>
                              )}
                              {template.type === "product" && (
                                <Badge variant="tag" className="flex items-center gap-1">
                                  <FileText size={14} className="text-green-500" />
                                  Product
                                </Badge>
                              )}
                              {template.type === "trend" && (
                                <Badge variant="tag" className="flex items-center gap-1">
                                  <Calendar size={14} className="text-amber-500" />
                                  Trend
                                </Badge>
                              )}
                              {template.type === "comparison" && (
                                <Badge variant="tag" className="flex items-center gap-1">
                                  <BarChart2 size={14} className="text-purple-500" />
                                  Comparison
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              onClick={() => handleGenerateReport(template)}
                            >
                              Generate Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                          No templates found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Reports */}
        {activeTab === "saved" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>View and download your previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Generated On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSavedReports.length > 0 ? (
                      filteredSavedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{report.templateName}</TableCell>
                          <TableCell>{report.lastRun}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewReport(report)}
                                title="View report"
                              >
                                <FileText size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadReport(report)}
                                title="Download report"
                              >
                                <Download size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                          No saved reports found. Try adjusting your search or generate a new report.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleCreateCustomReport}>
                <FilePlus size={16} className="mr-2" />
                Create Custom Report
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Report Preview Dialog */}
        {viewingReport && (
          <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{viewingReport.name}</DialogTitle>
                <DialogDescription>
                  Generated on {viewingReport.lastRun} • Template: {viewingReport.templateName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Sample report content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Executive Summary</h3>
                  <p className="text-muted-foreground">
                    This report provides an overview of sentiment analysis across all products,
                    highlighting key trends and areas for improvement.
                  </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Sentiment Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Chart visualization</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <span>Positive Sentiment</span>
                            <span className="font-medium">68%</span>
                          </div>
                          <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between">
                            <span>Neutral Sentiment</span>
                            <span className="font-medium">22%</span>
                          </div>
                          <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: '22%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between">
                            <span>Negative Sentiment</span>
                            <span className="font-medium">10%</span>
                          </div>
                          <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Top Products</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Sentiment</TableHead>
                          <TableHead>Reviews</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Summer Linen Shirt</TableCell>
                          <TableCell>4.8</TableCell>
                          <TableCell>Positive (92%)</TableCell>
                          <TableCell>124</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Classic Denim Jeans</TableCell>
                          <TableCell>4.5</TableCell>
                          <TableCell>Positive (87%)</TableCell>
                          <TableCell>98</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Casual Cotton Dress</TableCell>
                          <TableCell>4.2</TableCell>
                          <TableCell>Positive (82%)</TableCell>
                          <TableCell>76</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleDownloadReport(viewingReport)}>
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Custom Report Dialog */}
        <Dialog open={customReportDialog} onOpenChange={setCustomReportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Report</DialogTitle>
              <DialogDescription>
                Design a custom report by selecting the metrics and visualizations you need.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label>Report Name</Label>
                <Input placeholder="Enter report name" />
              </div>
              
              <div className="space-y-2">
                <Label>Report Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Sentiment Analysis
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Product Performance
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Included Metrics</Label>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sentiment" className="rounded border-gray-300" checked />
                    <Label htmlFor="sentiment">Sentiment Distribution</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="trends" className="rounded border-gray-300" checked />
                    <Label htmlFor="trends">Trend Analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="keywords" className="rounded border-gray-300" />
                    <Label htmlFor="keywords">Keyword Analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="topProducts" className="rounded border-gray-300" />
                    <Label htmlFor="topProducts">Top Products</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCustomReportDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveCustomReport}>Create Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Report Builder/Preview */}
        {generatingReport && (
          <Card>
            <CardHeader>
              <CardTitle>Generating Report</CardTitle>
              <CardDescription>Please wait while your {reportTemplate?.name} report is being prepared</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Title</Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="grid gap-4">
                    <Skeleton className="h-[200px] w-full" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-[120px]" />
                      <Skeleton className="h-[120px]" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={handleCancelGeneration}
                className="flex items-center gap-1"
              >
                <X size={16} />
                Cancel
              </Button>
              <Button disabled>
                <Check size={16} className="mr-1" />
                Save Report
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
