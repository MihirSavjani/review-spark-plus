import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";

export interface ReviewCriteria {
  id: string;
  name: string;
  description: string;
  rating: number;
  comment: string;
}

interface CriteriaReviewFormProps {
  criteria: ReviewCriteria[];
  onCriteriaChange: (criteria: ReviewCriteria[]) => void;
}

export const CriteriaReviewForm = ({ criteria, onCriteriaChange }: CriteriaReviewFormProps) => {
  const updateCriteria = (id: string, field: keyof ReviewCriteria, value: any) => {
    const updated = criteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    onCriteriaChange(updated);
  };

  const getOverallRating = () => {
    const validRatings = criteria.filter(c => c.rating > 0);
    if (validRatings.length === 0) return 0;
    return Number((validRatings.reduce((sum, c) => sum + c.rating, 0) / validRatings.length).toFixed(1));
  };

  const getProgressPercentage = () => {
    const completedCriteria = criteria.filter(c => c.rating > 0).length;
    return (completedCriteria / criteria.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="p-4 bg-review-primary/10 border-review-primary/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Review Progress</h3>
          <Badge variant="secondary" className="bg-review-accent/10 text-review-accent">
            {criteria.filter(c => c.rating > 0).length}/{criteria.length} Completed
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-review-primary/20 rounded-full h-2">
              <div 
                className="bg-review-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-review-muted">Overall Rating</div>
            <StarRating
              rating={getOverallRating()}
              onRatingChange={() => {}}
              readonly
              size="sm"
            />
          </div>
        </div>
      </Card>

      {/* Criteria List */}
      <div className="space-y-4">
        {criteria.map((criterion, index) => (
          <Card key={criterion.id} className="p-5 transition-all duration-200 hover:shadow-md border-l-4 border-l-review-accent/30">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-xs font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </Badge>
                    <h4 className="font-semibold text-lg">{criterion.name}</h4>
                  </div>
                  <p className="text-sm text-review-muted leading-relaxed">
                    {criterion.description}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor={`rating-${criterion.id}`} className="text-sm font-medium">
                  Rating *
                </Label>
                <StarRating
                  rating={criterion.rating}
                  onRatingChange={(rating) => updateCriteria(criterion.id, 'rating', rating)}
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor={`comment-${criterion.id}`} className="text-sm font-medium">
                  Comments & Feedback
                </Label>
                <Textarea
                  id={`comment-${criterion.id}`}
                  placeholder="Provide specific feedback and observations..."
                  value={criterion.comment}
                  onChange={(e) => updateCriteria(criterion.id, 'comment', e.target.value)}
                  className="min-h-[80px] resize-none focus:ring-2 focus:ring-review-accent/20 border-gray-200"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};