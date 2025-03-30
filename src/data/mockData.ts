
export interface Review {
  id: string;
  productId: string;
  text: string;
  rating: number;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  date: string;
  keywords: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  imageUrl: string;
  releaseDate: string;
}

export interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
}

export interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  productCount: number;
  reviewCount: number;
}

export const datasets: DatasetInfo[] = [
  {
    id: "womens-apparel",
    name: "Women's Apparel Collection",
    description: "Dresses, tops, bottoms, and outerwear",
    productCount: 40,
    reviewCount: 650,
  },
  {
    id: "mens-casual",
    name: "Men's Casual Wear",
    description: "T-shirts, jeans, hoodies, and shorts",
    productCount: 35,
    reviewCount: 520,
  },
  {
    id: "accessories",
    name: "Accessories Collection",
    description: "Bags, jewelry, scarves, and hats",
    productCount: 30,
    reviewCount: 480,
  },
];

// Helper function to generate random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString().split("T")[0];
};

// Helper function to generate random sentiment
const generateSentiment = (rating: number) => {
  if (rating >= 4) return "positive";
  if (rating <= 2) return "negative";
  return "neutral";
};

// Helper function to generate random sentiment score
const generateSentimentScore = (sentiment: string) => {
  if (sentiment === "positive") return 0.6 + Math.random() * 0.4;
  if (sentiment === "negative") return Math.random() * 0.4;
  return 0.4 + Math.random() * 0.2;
};

// Keywords for each sentiment
const positiveKeywords = [
  "comfortable", "stylish", "perfect fit", "high quality", "durable",
  "versatile", "beautiful", "excellent", "fashionable", "soft",
  "elegant", "trendy", "well made", "love", "recommend"
];

const negativeKeywords = [
  "uncomfortable", "poor quality", "wrong size", "overpriced", "disappointing",
  "not durable", "defective", "cheap looking", "tight", "loose",
  "not as pictured", "bad fit", "terrible", "waste", "avoid"
];

const neutralKeywords = [
  "okay", "average", "as expected", "fair", "decent",
  "standard", "normal", "basic", "simple", "functional",
  "acceptable", "regular", "ordinary", "common", "usual"
];

// Products for women's apparel collection
export const womensProducts: Product[] = [
  { id: "w1", name: "Floral Summer Dress", category: "Dresses", subCategory: "Summer", price: 79.99, imageUrl: "placeholder.svg", releaseDate: "2023-03-15" },
  { id: "w2", name: "Slim Fit Jeans", category: "Bottoms", subCategory: "Jeans", price: 69.99, imageUrl: "placeholder.svg", releaseDate: "2023-02-10" },
  { id: "w3", name: "Casual Blouse", category: "Tops", subCategory: "Blouses", price: 49.99, imageUrl: "placeholder.svg", releaseDate: "2023-04-05" },
  { id: "w4", name: "Winter Coat", category: "Outerwear", subCategory: "Coats", price: 129.99, imageUrl: "placeholder.svg", releaseDate: "2022-11-20" },
  { id: "w5", name: "Cotton T-Shirt", category: "Tops", subCategory: "T-Shirts", price: 29.99, imageUrl: "placeholder.svg", releaseDate: "2023-05-01" },
  { id: "w6", name: "Pencil Skirt", category: "Bottoms", subCategory: "Skirts", price: 59.99, imageUrl: "placeholder.svg", releaseDate: "2023-03-25" },
];

// Products for men's casual wear
export const mensProducts: Product[] = [
  { id: "m1", name: "Basic T-Shirt", category: "Tops", subCategory: "T-Shirts", price: 24.99, imageUrl: "placeholder.svg", releaseDate: "2023-04-12" },
  { id: "m2", name: "Relaxed Fit Jeans", category: "Bottoms", subCategory: "Jeans", price: 74.99, imageUrl: "placeholder.svg", releaseDate: "2023-03-05" },
  { id: "m3", name: "Zip-Up Hoodie", category: "Tops", subCategory: "Hoodies", price: 54.99, imageUrl: "placeholder.svg", releaseDate: "2023-01-20" },
  { id: "m4", name: "Chino Shorts", category: "Bottoms", subCategory: "Shorts", price: 44.99, imageUrl: "placeholder.svg", releaseDate: "2023-05-15" },
  { id: "m5", name: "Polo Shirt", category: "Tops", subCategory: "Polos", price: 39.99, imageUrl: "placeholder.svg", releaseDate: "2023-04-25" },
  { id: "m6", name: "Slim Fit Chinos", category: "Bottoms", subCategory: "Pants", price: 59.99, imageUrl: "placeholder.svg", releaseDate: "2023-02-28" },
];

// Products for accessories
export const accessoriesProducts: Product[] = [
  { id: "a1", name: "Leather Tote Bag", category: "Bags", subCategory: "Totes", price: 89.99, imageUrl: "placeholder.svg", releaseDate: "2023-03-10" },
  { id: "a2", name: "Statement Necklace", category: "Jewelry", subCategory: "Necklaces", price: 49.99, imageUrl: "placeholder.svg", releaseDate: "2023-04-20" },
  { id: "a3", name: "Silk Scarf", category: "Scarves", subCategory: "Silk", price: 34.99, imageUrl: "placeholder.svg", releaseDate: "2023-02-15" },
  { id: "a4", name: "Beanie Hat", category: "Hats", subCategory: "Winter", price: 24.99, imageUrl: "placeholder.svg", releaseDate: "2022-11-05" },
  { id: "a5", name: "Leather Belt", category: "Belts", subCategory: "Leather", price: 39.99, imageUrl: "placeholder.svg", releaseDate: "2023-01-25" },
  { id: "a6", name: "Sunglasses", category: "Eyewear", subCategory: "Sunglasses", price: 79.99, imageUrl: "placeholder.svg", releaseDate: "2023-05-10" },
];

// Function to generate mock reviews
const generateReviews = (products: Product[], count: number): Review[] => {
  const reviews: Review[] = [];
  
  for (let i = 0; i < count; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    const sentiment = generateSentiment(rating);
    
    let keywordPool: string[];
    if (sentiment === "positive") keywordPool = positiveKeywords;
    else if (sentiment === "negative") keywordPool = negativeKeywords;
    else keywordPool = neutralKeywords;
    
    // Get 1-3 random keywords
    const randomKeywords: string[] = [];
    const keywordCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < keywordCount; j++) {
      const keyword = keywordPool[Math.floor(Math.random() * keywordPool.length)];
      if (!randomKeywords.includes(keyword)) {
        randomKeywords.push(keyword);
      }
    }
    
    reviews.push({
      id: `review-${i}`,
      productId: product.id,
      text: `This is a sample ${sentiment} review for ${product.name}.`, // In a real implementation, we would have actual review text
      rating,
      sentiment,
      sentimentScore: generateSentimentScore(sentiment),
      date: randomDate(new Date('2023-01-01'), new Date()),
      keywords: randomKeywords,
    });
  }
  
  return reviews;
};

// Generate reviews for each dataset
export const womensReviews = generateReviews(womensProducts, 650);
export const mensReviews = generateReviews(mensProducts, 520);
export const accessoriesReviews = generateReviews(accessoriesProducts, 480);

// Function to get all products and reviews for a specific dataset
export const getDatasetContent = (datasetId: string): { products: Product[], reviews: Review[] } => {
  switch (datasetId) {
    case "womens-apparel":
      return { products: womensProducts, reviews: womensReviews };
    case "mens-casual":
      return { products: mensProducts, reviews: mensReviews };
    case "accessories":
      return { products: accessoriesProducts, reviews: accessoriesReviews };
    default:
      return { products: womensProducts, reviews: womensReviews }; // Default to women's apparel
  }
};

// Function to get sentiment breakdown
export const getSentimentBreakdown = (reviews: Review[]): SentimentData => {
  const positive = reviews.filter(review => review.sentiment === "positive").length;
  const negative = reviews.filter(review => review.sentiment === "negative").length;
  const neutral = reviews.filter(review => review.sentiment === "neutral").length;
  
  return { positive, negative, neutral };
};

// Function to get sentiment over time (last 6 months)
export const getSentimentOverTime = (reviews: Review[]) => {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  
  // Filter reviews from last 6 months
  const recentReviews = reviews.filter(review => new Date(review.date) >= sixMonthsAgo);
  
  // Group by month
  const months: Record<string, { positive: number; negative: number; neutral: number }> = {};
  
  recentReviews.forEach(review => {
    const date = new Date(review.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!months[monthYear]) {
      months[monthYear] = { positive: 0, negative: 0, neutral: 0 };
    }
    
    months[monthYear][review.sentiment]++;
  });
  
  // Convert to array for chart
  return Object.entries(months).map(([month, data]) => ({
    month,
    positive: data.positive,
    negative: data.negative,
    neutral: data.neutral,
  }));
};

// Function to get top products by sentiment
export const getTopProducts = (products: Product[], reviews: Review[], sentiment: "positive" | "negative", limit: number = 5) => {
  // Group reviews by product
  const productReviews: Record<string, Review[]> = {};
  
  reviews.forEach(review => {
    if (!productReviews[review.productId]) {
      productReviews[review.productId] = [];
    }
    productReviews[review.productId].push(review);
  });
  
  // Calculate average sentiment score for each product
  const productScores = Object.entries(productReviews).map(([productId, reviews]) => {
    const sentimentReviews = reviews.filter(review => review.sentiment === sentiment);
    if (sentimentReviews.length === 0) return { productId, score: 0, reviewCount: 0 };
    
    const avgScore = sentimentReviews.reduce((sum, review) => sum + review.sentimentScore, 0) / sentimentReviews.length;
    return {
      productId,
      score: avgScore,
      reviewCount: sentimentReviews.length,
    };
  });
  
  // Sort by score and limit
  productScores.sort((a, b) => {
    if (sentiment === "positive") {
      return b.score - a.score;
    } else {
      return a.score - b.score;
    }
  });
  
  const topProductScores = productScores
    .filter(item => item.reviewCount > 0)
    .slice(0, limit);
  
  // Get product details
  return topProductScores.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...product,
      score: item.score,
      reviewCount: item.reviewCount,
    };
  });
};

// Function to get most common keywords
export const getTopKeywords = (reviews: Review[], sentiment: "positive" | "negative" | "neutral", limit: number = 10) => {
  const keywords: Record<string, number> = {};
  
  reviews
    .filter(review => review.sentiment === sentiment)
    .forEach(review => {
      review.keywords.forEach(keyword => {
        if (!keywords[keyword]) {
          keywords[keyword] = 0;
        }
        keywords[keyword]++;
      });
    });
  
  return Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));
};
