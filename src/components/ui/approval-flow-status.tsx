import { ApprovalStatus, ApprovalStep } from "@/app/types";
import { XCircle } from "lucide-react";

interface ApprovalFlowStatusProps {
  approvalSteps: ApprovalStep[];
}

export function ApprovalFlowStatus({ approvalSteps }: ApprovalFlowStatusProps) {
  const hasRejectedStep = approvalSteps.some(step => step.status === ApprovalStatus.REJECTED);
  
  if (!hasRejectedStep) {
    return null;
  }
  
  return (
    <div className="approval-flow-warning">
      <div className="approval-flow-warning-header">
        <XCircle className="w-4 h-4" />
        <span className="approval-flow-warning-title">Approval flow frozen</span>
      </div>
      <p className="approval-flow-warning-message">
        A step has been rejected. No further changes can be made to the approval flow.
      </p>
    </div>
  );
}
