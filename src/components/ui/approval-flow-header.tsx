import { ApprovalStatus, ApprovalStep } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type ApprovalFlowHeaderProps = {
  stepNumber: number;
  isSaving: boolean;
  hasChanges: boolean;
  approvalSteps: ApprovalStep[];
  onSave: () => void;
}

export function ApprovalFlowHeader({ 
  stepNumber, 
  isSaving, 
  hasChanges, 
  approvalSteps, 
  onSave 
}: ApprovalFlowHeaderProps) {
  const hasRejectedStep = approvalSteps.some(step => step.status === ApprovalStatus.REJECTED);
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Approval Flow</h3>
        <p className="text-sm text-muted-foreground">
          Track the progress of your quote through the approval process
        </p>
      </div>
      
      {stepNumber > 0 && (
        <div className="flex items-center gap-2">
          <Button
            onClick={onSave}
            disabled={isSaving || !hasChanges || hasRejectedStep}
            variant={hasChanges ? "default" : "outline"}
            className="flex items-center gap-2"
            title={hasRejectedStep ? "Cannot save changes after a rejection" : ""}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
          </Button>
          
          {hasRejectedStep && (
            <span className="text-xs text-muted-foreground">
              (Flow frozen due to rejection)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
