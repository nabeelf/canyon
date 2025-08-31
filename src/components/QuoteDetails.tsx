"use client";

import { ApprovalStatus, Quote, ApprovalStep, ApprovalParty } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Calendar, Building, Hash, FileText, Mail, User, DollarSign, Star, Users } from "lucide-react";
import { downloadQuoteDocument } from "@/app/utils/download_file";
import { StatusPill } from "@/components/ui/status-pill";
import { useState, useMemo } from "react";
import { APPROVER_LIST_BY_ID } from "@/app/consts";
import { QuoteInfoCard, InfoItem } from "@/components/ui/quote-info-card";
import { ApprovalFlowHeader } from "@/components/ui/approval-flow-header";
import { ApprovalFlowStatus } from "@/components/ui/approval-flow-status";
import { ApprovalFlowList } from "@/components/ui/approval-flow-list";
import { ApprovalFlowActions } from "@/components/ui/approval-flow-actions";

type QuoteDetailsProps = {
  quote: Quote;
  onBack: () => void;
}

type DeleteConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

function DeleteConfirmationDialog({ open, onOpenChange, onConfirm }: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Approval Step</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this approval step? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Delete Step
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type AddStepDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (approverId: number) => void;
  team: ApprovalParty;
  approverId: number | null;
  approversByTeam: Array<{ id: number; name: string; email: string; role: ApprovalParty }>;
  onTeamChange: (team: ApprovalParty) => void;
  onApproverChange: (approverId: number | null) => void;
}

function AddStepDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  team, 
  approverId, 
  approversByTeam,
  onTeamChange, 
  onApproverChange 
}: AddStepDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Approval Step</DialogTitle>
          <DialogDescription>
            Create a new step in the approval flow
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Team</label>
            <Select value={team} onValueChange={(value) => onTeamChange(value as ApprovalParty)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ApprovalParty.DEAL_DESK}>Deal Desk</SelectItem>
                <SelectItem value={ApprovalParty.CRO}>CRO</SelectItem>
                <SelectItem value={ApprovalParty.LEGAL}>Legal</SelectItem>
                <SelectItem value={ApprovalParty.FINANCE}>Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Approver</label>
            <Select 
              value={approverId?.toString() || ""} 
              onValueChange={(value) => onApproverChange(value ? parseInt(value) : null)}
              disabled={approversByTeam.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an approver" />
              </SelectTrigger>
              <SelectContent>
                {approversByTeam.map((approver) => (
                  <SelectItem key={approver.id} value={approver.id.toString()}>
                    {approver.name} ({approver.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => approverId && onConfirm(approverId)}
            disabled={!approverId}
          >
            Add Step
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function QuoteDetails({ quote, onBack }: QuoteDetailsProps) {
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>(quote.approvalSteps || []);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<number | null>(null);
  const [addStepDialogOpen, setAddStepDialogOpen] = useState(false);
  const [newStepTeam, setNewStepTeam] = useState<ApprovalParty>(ApprovalParty.DEAL_DESK);
  const [newStepApprover, setNewStepApprover] = useState<number | null>(null);
  
  // Track the current step position to maintain it across saves
  const [currentStepPosition] = useState<number>(() => {
    if (quote.current_step) {
      return quote.approvalSteps.findIndex(s => s.id === quote.current_step!.id);
    }
    return -1;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get approvers filtered by team
  const approversByTeam = useMemo(() => {
    const approvers = Array.from(APPROVER_LIST_BY_ID.values());
    return approvers.filter(approver => approver.role === newStepTeam);
  }, [newStepTeam]);

  // Reset approver when team changes
  const handleTeamChange = (team: ApprovalParty) => {
    setNewStepTeam(team);
    setNewStepApprover(null);
  };

  const handleDragStart = (index: number) => {
    // Only allow dragging if the step is pending
    if (approvalSteps[index].status !== ApprovalStatus.PENDING) {
      return;
    }
    setIsDragging(true);
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    
    // Only allow dropping on pending steps
    if (approvalSteps[index].status !== ApprovalStatus.PENDING) return;
    
    const newSteps = [...approvalSteps];
    const draggedStep = newSteps[dragIndex];
    newSteps.splice(dragIndex, 1);
    newSteps.splice(index, 0, draggedStep);
    
    setApprovalSteps(newSteps);
    setDragIndex(index);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const handleDeleteStep = (index: number) => {
    if (approvalSteps[index].status !== ApprovalStatus.PENDING) {
      return;
    }
    
    setStepToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStep = () => {
    if (stepToDelete === null) return;
    
    const newSteps = [...approvalSteps];
    newSteps.splice(stepToDelete, 1);
    setApprovalSteps(newSteps);
    setHasChanges(true);
    
    setDeleteDialogOpen(false);
    setStepToDelete(null);
  };

  const handleAddStep = (approverId: number) => {
    const selectedApprover = APPROVER_LIST_BY_ID.get(approverId);
    if (!selectedApprover) return;
    
    // Create a new approval step with the selected approver defaulted to "PENDING" state
    const newStep: ApprovalStep = {
      id: Date.now(), // placeholder id
      status: ApprovalStatus.PENDING,
      assignee: selectedApprover,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      info_requested: null,
    };
    
    // Add the new step to the end of the approval flow
    const newSteps = [...approvalSteps, newStep];
    setApprovalSteps(newSteps);
    setHasChanges(true);
    
    // Close the dialog and reset form
    setAddStepDialogOpen(false);
    setNewStepTeam(ApprovalParty.DEAL_DESK);
    setNewStepApprover(null);
  };

  const handleSaveApprovalFlow = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/approval-flow`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quoteId: quote.id, approvalSteps }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save approval flow');
      }

      // Update the original quote object with the new approval steps
      quote.approvalSteps = approvalSteps;
      
      // Update the current step to point to the step at the current position
      if (currentStepPosition >= 0 && currentStepPosition < approvalSteps.length) {
        quote.current_step = approvalSteps[currentStepPosition];
      }
      
      // Reset the hasChanges flag
      setHasChanges(false);
      
    } catch (error) {
      console.error('Failed to save approval flow:', error);
      alert(`Failed to save approval flow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8 animate-slide-in-top space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quotes
        </Button>

        <Button
          onClick={async () => {
            try {
              await downloadQuoteDocument(quote.filename, quote.name || 'Quote');
            } catch (error) {
              console.error('Download failed:', error);
              alert('Download failed. Please try again.');
            }
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Quote
        </Button>
      </div>

      {/* Quote Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{quote.name}</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{quote.company.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(quote.created_at)}</span>
                </div>
              </CardDescription>
            </div>
            {quote.current_step && (<StatusPill status={quote.current_step.status} approvalParty={quote.current_step.assignee.role} size="md" />)}
          </div>
        </CardHeader>
      </Card>

      {/* Approval Flow Card */}
      <Card>
        <CardHeader>
          <ApprovalFlowHeader
            stepNumber={quote.step_number}
            isSaving={isSaving}
            hasChanges={hasChanges}
            approvalSteps={approvalSteps}
            onSave={handleSaveApprovalFlow}
          />
        </CardHeader>
        <CardContent>
          <ApprovalFlowStatus approvalSteps={approvalSteps} />
          
          <ApprovalFlowList
            approvalSteps={approvalSteps}
            stepNumber={quote.step_number}
            currentStepPosition={currentStepPosition}
            isDragging={isDragging}
            dragIndex={dragIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDeleteStep={handleDeleteStep}
            formatDate={formatDate}
          />
          
          <ApprovalFlowActions
            approvalSteps={approvalSteps}
            onAddStep={() => setAddStepDialogOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Company Information Card */}
      <QuoteInfoCard
        title="Company Information"
        description="Contact details and company information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            icon={<Building className="w-4 h-4" />}
            label="Company Name"
            value={quote.company.name}
          />
          
          <InfoItem
            icon={<User className="w-4 h-4" />}
            label="Contact Person"
            value={quote.company.contact_name}
          />
          
          <InfoItem
            icon={<Mail className="w-4 h-4" />}
            label="Contact Email"
            value={quote.company.contact_email}
            isEmail={true}
          />
        </div>
      </QuoteInfoCard>

      {/* Quote Details Card */}
      <QuoteInfoCard
        title="Quote Details"
        description="Business information about this quote"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            icon={<DollarSign className="w-4 h-4" />}
            label="Total Contract Value"
            value={`$${quote.tcv.toLocaleString()}`}
          />
          
          <InfoItem
            icon={<Calendar className="w-4 h-4" />}
            label="Term (Months)"
            value={`${quote.term_months} months`}
          />
          
          <InfoItem
            icon={<Star className="w-4 h-4" />}
            label="Plan"
            value={quote.plan}
          />
          
          <InfoItem
            icon={<Users className="w-4 h-4" />}
            label="Number of Seats"
            value={quote.seats.toLocaleString()}
          />
          
          <InfoItem
            icon={<FileText className="w-4 h-4" />}
            label="Quote Type"
            value={quote.quote_type}
          />
          
          <InfoItem
            icon={<Hash className="w-4 h-4" />}
            label="Discount Percentage"
            value="15%"
          />
        </div>
      </QuoteInfoCard>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteStep}
      />
      
      {/* Add Step Dialog */}
      <AddStepDialog
        open={addStepDialogOpen}
        onOpenChange={setAddStepDialogOpen}
        onConfirm={handleAddStep}
        team={newStepTeam}
        approverId={newStepApprover}
        approversByTeam={approversByTeam}
        onTeamChange={handleTeamChange}
        onApproverChange={setNewStepApprover}
      />
    </div>
  );
}
