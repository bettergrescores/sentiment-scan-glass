
import { useState } from "react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, FilePlus, Download, Calendar, BarChart2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

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
  
  // Filter templates or saved reports based on search query
  const filteredTemplates = reportTemplates.filter(
    template => template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSavedReports = savedReports.filter(
    report => report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              report.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateReport = (templateId: string) => {
    setGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false);
    }, 2000);
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
                              {template.type === "sentiment" && <BarChart2 size={14} className="mr-2 text-blue-500" />}
                              {template.type === "product" && <FileText size={14} className="mr-2 text-green-500" />}
                              {template.type === "trend" && <Calendar size={14} className="mr-2 text-amber-500" />}
                              {template.type === "comparison" && <BarChart2 size={14} className="mr-2 text-purple-500" />}
                              {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              onClick={() => handleGenerateReport(template.id)}
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
                              <Button variant="outline" size="sm">
                                <FileText size={16} />
                              </Button>
                              <Button variant="outline" size="sm">
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
              <Button variant="outline" className="w-full">
                <FilePlus size={16} className="mr-2" />
                Create Custom Report
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Report Builder/Preview */}
        {generatingReport && (
          <Card>
            <CardHeader>
              <CardTitle>Generating Report</CardTitle>
              <CardDescription>Please wait while your report is being prepared</CardDescription>
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
              <Button variant="outline">Cancel</Button>
              <Button disabled>Save Report</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
