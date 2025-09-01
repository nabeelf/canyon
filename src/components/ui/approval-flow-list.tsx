import { ApprovalStatus, ApprovalStep } from "@/app/types";
import { Separator } from "@/components/ui/separator";
import { ApprovalStepItem } from "@/components/ui/approval-step";

type ApprovalFlowListProps = {
  approvalSteps: ApprovalStep[];
  stepNumber: number;
  currentStepPosition: number;
  isDragging: boolean;
  dragIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDeleteStep: (index: number) => void;
  formatDate: (date: string) => string;
}

export function ApprovalFlowList({
  approvalSteps,
  stepNumber,
  currentStepPosition,
  isDragging,
  dragIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDeleteStep,
  formatDate
}: ApprovalFlowListProps) {
  if (!approvalSteps || stepNumber === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No approval steps defined yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {approvalSteps.map((step, index) => {
        const isCurrentStep = currentStepPosition === index;
        const hasRejectedStepBefore = approvalSteps.slice(0, index).some(s => s.status === ApprovalStatus.REJECTED);
        const isAfterRejectedStep = hasRejectedStepBefore;
        const canEdit = step.status === ApprovalStatus.PENDING && 
          (currentStepPosition === -1 || index >= currentStepPosition) &&
          !isAfterRejectedStep;
        
        return (
          <div key={step.id}>
            <ApprovalStepItem
              step={step}
              index={index}
              isCurrentStep={isCurrentStep}
              isAfterRejectedStep={isAfterRejectedStep}
              canEdit={canEdit}
              isDragging={isDragging}
              isDragTarget={dragIndex === index}
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              onDelete={() => onDeleteStep(index)}
              formatDate={formatDate}
            />
            {index < stepNumber - 1 && <Separator className="my-4" />}
          </div>
        );
      })}
    </div>
  );
}
