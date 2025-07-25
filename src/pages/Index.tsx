import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewModal, ReviewData } from "@/components/review/ReviewModal";
import { Users, Star, Calendar, Mail, Briefcase } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: string;
  interviewDate: string;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "VISHAL KORIYA",
    email: "vishalkoriya@ymail.com",
    position: "Tech Lead",
    status: "In Progress",
    interviewDate: "Jul 25, 2025"
  },
  {
    id: "2", 
    name: "Mihir Savjani",
    email: "savjanimihir@gmail.com",
    position: "Senior Backend & AI Engineer",
    status: "In Progress", 
    interviewDate: "Jul 25, 2025"
  }
];

const Index = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleAddReview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (reviewData: ReviewData) => {
    console.log("Review saved:", reviewData);
    // Here you would typically save to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-review-accent rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidates Management</h1>
              <p className="text-gray-600">Professional review system for candidate evaluation</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Candidate Database</h2>
              <Badge variant="secondary" className="bg-review-primary/20 text-review-primary-foreground">
                {mockCandidates.length} candidates
              </Badge>
            </div>
            <Button variant="outline" className="gap-2">
              <Star className="h-4 w-4" />
              View All Reviews
            </Button>
          </div>
        </Card>

        {/* Candidates List */}
        <div className="space-y-4">
          {mockCandidates.map((candidate) => (
            <Card key={candidate.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-review-primary rounded-full flex items-center justify-center">
                    <span className="text-review-primary-foreground font-semibold text-lg">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {candidate.position}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {candidate.interviewDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-700"
                  >
                    {candidate.status}
                  </Badge>
                  <Button 
                    onClick={() => handleAddReview(candidate)}
                    className="bg-review-accent hover:bg-review-accent/90"
                  >
                    Add Review
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {selectedCandidate && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedCandidate(null);
          }}
          candidateName={selectedCandidate.name}
          candidateEmail={selectedCandidate.email}
          position={selectedCandidate.position}
          interviewDate={selectedCandidate.interviewDate}
          onSave={handleSaveReview}
        />
      )}
    </div>
  );
};

export default Index;
