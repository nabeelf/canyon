"use client";

import { ApprovalStatus, Quote, ApprovalStep, ApprovalParty } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Calendar, Building, Hash, FileText, Save, GripVertical, Trash2, Mail, User, DollarSign, Star, Users, Plus, XCircle } from "lucide-react";
import { downloadQuoteDocument } from "@/app/utils/download_file";
import { StatusPill } from "@/components/ui/status-pill";
import { useState, useMemo } from "react";
import { APPROVER_LIST_BY_ID } from "@/app/consts";

interface QuoteDetailsProps {
  quote: Quote;
  onBack: () => void;
}

interface DeleteConfirmationDialogProps {
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

interface AddStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (team: ApprovalParty, approverId: number) => void;
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
            onClick={() => approverId && onConfirm(team, approverId)}
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
  const [currentStepPosition, setCurrentStepPosition] = useState<number>(() => {
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

  const handleAddStep = (team: ApprovalParty, approverId: number) => {
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

      const result = await response.json();
      
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
              // Extract file extension from the actual filename
              const fileExtension = quote.filename.includes('.') ? quote.filename.split('.').pop() : '';
              const extension = fileExtension ? `.${fileExtension}` : '';
              await downloadQuoteDocument(quote.filename, quote.name || 'Quote', extension);
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Approval Flow</CardTitle>
              <CardDescription>Track the progress of your quote through the approval process</CardDescription>
            </div>
            {quote.step_number > 0 && (
              <>
                <Button
                  onClick={handleSaveApprovalFlow}
                  disabled={isSaving || !hasChanges || approvalSteps.some(step => step.status === ApprovalStatus.REJECTED)}
                  variant={hasChanges ? "default" : "outline"}
                  className="flex items-center gap-2"
                  title={approvalSteps.some(step => step.status === ApprovalStatus.REJECTED) ? "Cannot save changes after a rejection" : ""}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
                </Button>
                {approvalSteps.some(step => step.status === ApprovalStatus.REJECTED) && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Flow frozen due to rejection)
                  </span>
                )}
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!approvalSteps || quote.step_number === 0 ? (
            <p className="text-muted-foreground text-center py-8">No approval steps defined yet.</p>
          ) : approvalSteps.some(step => step.status === ApprovalStatus.REJECTED) ? (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Approval flow frozen</span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                A step has been rejected. No further changes can be made to the approval flow.
              </p>
            </div>
          ) : null}
          {approvalSteps && quote.step_number > 0 && (
            <div className="space-y-4">              
              {approvalSteps.map((step, index) => {
                // Use the tracked current step position instead of trying to match by ID
                const isCurrentStep = currentStepPosition === index;
                
                // Check if any previous step is rejected
                const hasRejectedStepBefore = approvalSteps.slice(0, index).some(s => s.status === ApprovalStatus.REJECTED);
                const isAfterRejectedStep = hasRejectedStepBefore;
                
                const canEdit = step.status === ApprovalStatus.PENDING && 
                  (currentStepPosition === -1 || index >= currentStepPosition) &&
                  !isAfterRejectedStep;
                
                return (
                  <div key={step.id}>
                    <div 
                      className={`flex items-start gap-4 p-4 border rounded-lg transition-all duration-200 ${
                        isDragging && dragIndex === index 
                          ? 'opacity-50 scale-95 bg-muted/50' 
                          : isAfterRejectedStep
                            ? 'opacity-50 bg-gray-100 border-gray-200'
                            : isCurrentStep
                              ? 'border-blue-300 bg-blue-50'
                              : step.status === ApprovalStatus.PENDING 
                                ? 'hover:bg-muted/30' 
                                : ''
                      }`}
                      draggable={canEdit && !isAfterRejectedStep}
                      onDragStart={() => canEdit && !isAfterRejectedStep && handleDragStart(index)}
                      onDragOver={(e) => canEdit && !isAfterRejectedStep && handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mt-2 ${
                        isAfterRejectedStep
                          ? 'bg-gray-400 text-white'
                          : isCurrentStep 
                            ? 'bg-blue-500 text-white ring-2 ring-blue-200' 
                            : 'bg-primary text-primary-foreground'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 relative">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{step.assignee.role}</span>
                          {step.assignee && (
                            <>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-sm text-muted-foreground mt-0.5">{step.assignee.name}</span>
                              <a
                                href={`mailto:${step.assignee.email}`}
                                className="ml-1 mt-0.25 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors"
                                title={`Send email to ${step.assignee.name}`}
                              >
                                <Mail className="w-3 h-3" />
                              </a>
                            </>
                          )}
                          {isCurrentStep && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Current
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Created: {formatDate(step.created_at)}</div>
                          {step.info_requested && (
                            <div className="text-red-600 text-sm">
                              <span className="font-bold">Info requested:</span> {step.info_requested}
                            </div>
                          )}
                        </div>
                        
                        {/* Status and Actions positioned in middle-right */}
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center gap-2">
                          <StatusPill status={step.status} size="sm" />
                          {canEdit && (
                            <>
                              <button
                                onClick={() => handleDeleteStep(index)}
                                className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                                title="Delete approval step"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-5 h-5 text-muted-foreground" />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < quote.step_number - 1 && <Separator className="my-4" />}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Add Step Button */}
          <div className="mt-8 pt-6 border-t text-center">
            <Button
              onClick={() => setAddStepDialogOpen(true)}
              disabled={approvalSteps.some(step => step.status === ApprovalStatus.REJECTED)}
              variant={approvalSteps.some(step => step.status === ApprovalStatus.REJECTED) ? "secondary" : "outline"}
              className={`flex items-center gap-2 mx-auto ${
                approvalSteps.some(step => step.status === ApprovalStatus.REJECTED) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              title={approvalSteps.some(step => step.status === ApprovalStatus.REJECTED) ? "Cannot add steps after a rejection" : "Add a new approval step"}
            >
              <Plus className="w-4 h-4" />
              Add Step
            </Button>
            {approvalSteps.some(step => step.status === ApprovalStatus.REJECTED) && (
              <p className="text-sm text-muted-foreground mt-2">
                Cannot add new steps after a rejection has occurred
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Contact details and company information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building className="w-4 h-4" />
                Company Name
              </div>
              <p className="text-sm font-medium">{quote.company.name}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="w-4 h-4" />
                Contact Person
              </div>
              <p className="text-sm">{quote.company.contact_name}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="w-4 h-4" />
                Contact Email
              </div>
              <a
                href={`mailto:${quote.company.contact_email}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
              >
                {quote.company.contact_email}
                <Mail className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
          <CardDescription>Business information about this quote</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                Total Contract Value
              </div>
              <p className="text-sm font-medium">${quote.tcv.toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Term (Months)
              </div>
              <p className="text-sm">{quote.term_months} months</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Star className="w-4 h-4" />
                Plan
              </div>
              <p className="text-sm font-medium">{quote.plan}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="w-4 h-4" />
                Number of Seats
              </div>
              <p className="text-sm">{quote.seats.toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="w-4 h-4" />
                Quote Type
              </div>
              <p className="text-sm font-medium">{quote.quote_type}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Last Updated
              </div>
              <p className="text-sm">{formatDate(quote.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
