import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CriteriaReviewForm, ReviewCriteria } from "./CriteriaReviewForm";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateEmail: string;
  position: string;
  interviewDate?: string;
  onSave: (reviewData: ReviewData) => void;
}

export interface ReviewData {
  candidateName: string;
  candidateEmail: string;
  position: string;
  criteria: ReviewCriteria[];
  overallRating: number;
  reviewDate: string;
  status: 'draft' | 'completed';
}

const defaultCriteria: ReviewCriteria[] = [
  {
    id: "technical-knowledge",
    name: "Technical Knowledge",
    description: "Understanding of core concepts, frameworks, and best practices relevant to the role",
    rating: 0,
    comment: ""
  },
  {
    id: "communication-clarity",
    name: "Communication Clarity",
    description: "Ability to explain concepts clearly, listen actively, and articulate thoughts effectively",
    rating: 0,
    comment: ""
  },
  {
    id: "problem-solving",
    name: "Problem-Solving Ability",
    description: "Approach to handling challenges, analytical thinking, and solution-oriented mindset",
    rating: 0,
    comment: ""
  },
  {
    id: "professional-attitude",
    name: "Professional Attitude",
    description: "Punctuality, politeness, interest in the role, and overall professional demeanor",
    rating: 0,
    comment: ""
  },
  {
    id: "cultural-fit",
    name: "Cultural Fit",
    description: "Alignment with team values, collaboration style, and organizational culture",
    rating: 0,
    comment: ""
  },
  {
    id: "experience-relevance",
    name: "Experience Relevance",
    description: "How well past experience aligns with job requirements and responsibilities",
    rating: 0,
    comment: ""
  }
];

export const ReviewModal = ({
  isOpen,
  onClose,
  candidateName,
  candidateEmail,
  position,
  interviewDate,
  onSave
}: ReviewModalProps) => {
  const [criteria, setCriteria] = useState<ReviewCriteria[]>(defaultCriteria);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCriteria(defaultCriteria);
    }
  }, [isOpen]);

  const getOverallRating = () => {
    const validRatings = criteria.filter(c => c.rating > 0);
    if (validRatings.length === 0) return 0;
    return Number((validRatings.reduce((sum, c) => sum + c.rating, 0) / validRatings.length).toFixed(1));
  };

  const getCompletionPercentage = () => {
    const completedCriteria = criteria.filter(c => c.rating > 0).length;
    return (completedCriteria / criteria.length) * 100;
  };

  const isReviewComplete = () => {
    return criteria.every(c => c.rating > 0);
  };

  const handleSave = async (isDraft = false) => {
    setIsSaving(true);
    
    try {
      const reviewData: ReviewData = {
        candidateName,
        candidateEmail,
        position,
        criteria,
        overallRating: getOverallRating(),
        reviewDate: new Date().toISOString(),
        status: isDraft || !isReviewComplete() ? 'draft' : 'completed'
      };

      await onSave(reviewData);
      
      toast({
        title: isDraft ? "Review saved as draft" : "Review completed",
        description: isDraft 
          ? "You can continue editing this review later" 
          : "Review has been successfully submitted",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error saving review",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">
                Candidate Review
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{candidateName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{position}</Badge>
                </div>
                {interviewDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{interviewDate}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                {isReviewComplete() ? (
                  <CheckCircle className="h-5 w-5 text-review-success" />
                ) : (
                  <Clock className="h-5 w-5 text-review-warning" />
                )}
                <span className="text-sm font-medium">
                  {Math.round(getCompletionPercentage())}% Complete
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {criteria.filter(c => c.rating > 0).length} of {criteria.length} criteria rated
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            <CriteriaReviewForm
              criteria={criteria}
              onCriteriaChange={setCriteria}
            />
          </div>
        </ScrollArea>

        <Separator />
        
        <div className="px-6 py-4 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Overall Rating: {getOverallRating() > 0 ? `${getOverallRating()}/5` : "Pending"}
              </div>
              <div className="text-xs text-muted-foreground">
                {isReviewComplete() ? "All criteria completed" : "Complete all ratings to finish review"}
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="bg-review-accent hover:bg-review-accent/90"
              >
                {isSaving ? "Saving..." : isReviewComplete() ? "Complete Review" : "Save Progress"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};