import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = "md" 
}: StarRatingProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const getRatingColor = (starIndex: number) => {
    if (starIndex <= rating) {
      if (rating >= 4.5) return "text-rating-excellent fill-rating-excellent";
      if (rating >= 3.5) return "text-rating-good fill-rating-good";
      if (rating >= 2.5) return "text-rating-average fill-rating-average";
      return "text-rating-poor fill-rating-poor";
    }
    return "text-rating-inactive fill-rating-inactive";
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange(star)}
          disabled={readonly}
          className={cn(
            "transition-all duration-200 hover:scale-110",
            readonly ? "cursor-default" : "cursor-pointer hover:brightness-110",
            sizes[size]
          )}
        >
          <Star
            className={cn(
              "transition-colors duration-200",
              getRatingColor(star)
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground">
        {rating > 0 ? `${rating}/5` : "Not rated"}
      </span>
    </div>
  );
};