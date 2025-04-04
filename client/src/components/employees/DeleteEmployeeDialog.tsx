import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Employee } from "@shared/schema";

interface DeleteEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteEmployeeDialog({
  employee,
  isOpen,
  onClose,
}: DeleteEmployeeDialogProps) {
  const { toast } = useToast();
  
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!employee) return;
      await apiRequest("DELETE", `/api/employees/${employee.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete employee: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleDelete = () => {
    deleteMutation.mutate();
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this employee? This action cannot be undone.
          </AlertDialogDescription>
          {employee && (
            <p className="mt-2 font-medium text-gray-900">
              {employee.name}
            </p>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
