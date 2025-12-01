import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/consumer/button";
import { Badge } from "@/components/ui/consumer/badge";
import { Card, CardContent } from "@/components/ui/consumer/card";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  brand: string;
  price: number;
  unit: string;
  image: string;
  rating: number;
  reviewCount: number;
  badges: string[];
  deliveryEstimate: string;
}

const badgeColors: Record<string, string> = {
  "FPO-Verified": "bg-badge-fpo text-white",
  "Lab-Verified": "bg-badge-lab text-white",
  "FSSAI": "bg-badge-fssai text-white",
  "Organic": "bg-badge-organic text-white",
};

export const ProductCard = ({
  id,
  title,
  brand,
  price,
  unit,
  image,
  rating,
  reviewCount,
  badges,
  deliveryEstimate,
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardContent className="p-0">
        <Link to={`/product/${id}`}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </Link>

        <div className="p-4 space-y-3">
          <Link to={`/product/${id}`}>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">{brand}</p>
              <h3 className="font-semibold line-clamp-2 text-sm leading-tight">{title}</h3>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className={`text-xs px-2 py-0.5 ${badgeColors[badge] || ""}`}
              >
                {badge}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-bold">₹{price}</p>
              <p className="text-xs text-muted-foreground">{unit}</p>
            </div>
            <Button size="sm" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Delivery: {deliveryEstimate}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
