import { CheckCircle, XCircle, Clock, User } from "lucide-react";
import { ApprovalParty, ApprovalStatus } from "@/app/types";

type StatusPillProps = {
  status: ApprovalStatus;
  approvalParty?: ApprovalParty;
  size?: "sm" | "md" | "lg";
}

export function StatusPill({ status, approvalParty, size = "md" }: StatusPillProps) {
  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ApprovalStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ApprovalStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ApprovalStatus.INFO_REQUESTED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return <CheckCircle className="w-3 h-3" />;
      case ApprovalStatus.REJECTED:
        return <XCircle className="w-3 h-3" />;
      case ApprovalStatus.PENDING:
        return <Clock className="w-3 h-3" />;
      case ApprovalStatus.INFO_REQUESTED:
        return <User className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-sm gap-1.5";
      case "md":
        return "px-2.5 py-1.5 text-base gap-1.5";
      case "lg":
        return "px-3 py-2 text-lg gap-2";
      default:
        return "px-2.5 py-1.5 text-base gap-1.5";
    }
  };

  return (
    <div className={`rounded-full font-medium flex items-center justify-center max-w-fit ${getSizeClasses(size)} ${getStatusColor(status)}`}>
      <span className="flex items-center gap-1.5">
        {getStatusIcon(status)}
        <span className="leading-none">
          {status === ApprovalStatus.APPROVED ? status : approvalParty ? `${approvalParty}: ${status}` : status}
        </span>
      </span>
    </div>
  );
}
