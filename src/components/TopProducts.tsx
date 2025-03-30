
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/data/mockData";

interface TopProductProps {
  products: Array<Product & { score: number; reviewCount: number }>;
  type: "positive" | "negative";
  onProductSelect?: (product: Product) => void;
}

const TopProducts = ({ products, type, onProductSelect }: TopProductProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {type === "positive" ? "Top Rated Products" : "Products Needing Improvement"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="w-24">Score</TableHead>
              <TableHead className="text-right w-24">Reviews</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id} 
                className={onProductSelect ? "cursor-pointer hover:bg-muted" : ""}
                onClick={() => onProductSelect && onProductSelect(product)}
              >
                <TableCell className="font-medium">
                  <div>{product.name}</div>
                  <div className="text-xs text-gray-500">{product.category} • ${product.price}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={product.score * 100} 
                      className={`${type === "positive" ? "bg-green-100" : "bg-red-100"}`}
                      indicatorClassName={`${type === "positive" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span className="text-xs font-medium">
                      {(product.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{product.reviewCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
