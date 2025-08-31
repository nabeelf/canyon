import { ApprovalStep, ApprovalStatus } from "@/app/types";
import { StatusPill } from "@/components/ui/status-pill";
import { Mail, Trash2, GripVertical } from "lucide-react";

interface ApprovalStepProps {
  step: ApprovalStep;
  index: number;
  isCurrentStep: boolean;
  isAfterRejectedStep: boolean;
  canEdit: boolean;
  isDragging: boolean;
  isDragTarget: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
}

export function ApprovalStepItem({
  step,
  index,
  isCurrentStep,
  isAfterRejectedStep,
  canEdit,
  isDragging,
  isDragTarget,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDelete,
  formatDate
}: ApprovalStepProps) {
  return (
    <div 
      className={`approval-step ${isDragging ? 'approval-step-dragging' : ''} ${isDragTarget ? 'approval-step-drag-target' : ''} ${isAfterRejectedStep ? 'approval-step-frozen' : ''} ${isCurrentStep ? 'approval-step-current' : ''}`}
      draggable={canEdit && !isAfterRejectedStep}
      onDragStart={() => canEdit && !isAfterRejectedStep && onDragStart()}
      onDragOver={(e) => canEdit && !isAfterRejectedStep && onDragOver(e)}
      onDragEnd={onDragEnd}
    >
      <div className={`approval-step-number ${isAfterRejectedStep ? 'approval-step-number-frozen' : ''} ${isCurrentStep ? 'approval-step-number-current' : ''}`}>
        {index + 1}
      </div>

      <div className="approval-step-content">
        <div className="approval-step-header">
          <span className="approval-step-role">{step.assignee.role}</span>
          {step.assignee && (
            <>
              <span className="approval-step-separator">·</span>
              <span className="approval-step-name">{step.assignee.name}</span>
              <a
                href={`mailto:${step.assignee.email}`}
                className="approval-step-email"
                title={`Send email to ${step.assignee.name}`}
              >
                <Mail className="w-3 h-3" />
              </a>
            </>
          )}
          {isCurrentStep && (
            <span className="approval-step-current-badge">
              Current
            </span>
          )}
        </div>
        
        <div className="approval-step-details">
          <div>Created: {formatDate(step.created_at)}</div>
          {step.info_requested && (
            <div className="approval-step-info-requested">
              <span className="font-bold">Info requested:</span> {step.info_requested}
            </div>
          )}
        </div>
        
        <div className="approval-step-actions">
          <StatusPill status={step.status} size="sm" />
          {canEdit && (
            <>
              <button
                onClick={onDelete}
                className="approval-step-delete-button"
                title="Delete approval step"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="approval-step-drag-handle">
                <GripVertical className="w-5 h-5" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
