import { ApprovalStatus, ApprovalStep } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type ApprovalFlowActionsProps = {
  approvalSteps: ApprovalStep[];
  onAddStep: () => void;
}

export function ApprovalFlowActions({ approvalSteps, onAddStep }: ApprovalFlowActionsProps) {
  const hasRejectedStep = approvalSteps.some(step => step.status === ApprovalStatus.REJECTED);
  
  return (
    <div className="approval-flow-actions">
      <Button
        onClick={onAddStep}
        disabled={hasRejectedStep}
        variant={hasRejectedStep ? "secondary" : "outline"}
        className={`approval-flow-add-button ${hasRejectedStep ? 'approval-flow-add-button-disabled' : ''}`}
        title={hasRejectedStep ? "Cannot add steps after a rejection" : "Add a new approval step"}
      >
        <Plus className="w-4 h-4" />
        Add Step
      </Button>
      
      {hasRejectedStep && (
        <p className="approval-flow-add-message">
          Cannot add new steps after a rejection has occurred
        </p>
      )}
    </div>
  );
}
