import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";
import { type Employee } from "@shared/schema";

interface EditEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditEmployeeDialog({ 
  employee, 
  isOpen, 
  onClose 
}: EditEmployeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        {employee && (
          <EmployeeForm 
            initialData={employee} 
            onSuccess={onClose}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
