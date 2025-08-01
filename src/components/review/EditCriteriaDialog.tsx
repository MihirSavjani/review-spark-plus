import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReviewCriteria } from "./CriteriaReviewForm";

interface EditCriteriaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: ReviewCriteria | null;
  onSave: (updatedCriteria: ReviewCriteria) => void;
}

export const EditCriteriaDialog = ({ isOpen, onClose, criteria, onSave }: EditCriteriaDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (criteria) {
      setName(criteria.name);
      setDescription(criteria.description);
    }
  }, [criteria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || !criteria) return;

    const updatedCriteria: ReviewCriteria = {
      ...criteria,
      name: name.trim(),
      description: description.trim()
    };

    onSave(updatedCriteria);
    onClose();
  };

  const handleCancel = () => {
    if (criteria) {
      setName(criteria.name);
      setDescription(criteria.description);
    }
    onClose();
  };

  if (!criteria) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Criteria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-criteria-name">Criteria Name *</Label>
            <Input
              id="edit-criteria-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Leadership Skills"
              maxLength={50}
              required
              disabled={!criteria.isCustom}
            />
            {!criteria.isCustom && (
              <p className="text-xs text-muted-foreground">Default criteria names cannot be edited</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-criteria-description">Description *</Label>
            <Textarea
              id="edit-criteria-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this criteria evaluates..."
              maxLength={200}
              className="min-h-[80px] resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !description.trim()}
              className="flex-1 bg-review-accent hover:bg-review-accent/90"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};