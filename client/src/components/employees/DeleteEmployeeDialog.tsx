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
      if (!employee) {
        console.error("Delete mutation attempted with null employee");
        throw new Error("No employee to delete");
      }
      
      console.log("Deleting employee with ID:", employee.id);
      
      try {
        const response = await apiRequest("DELETE", `/api/employees/${employee.id}`);
        console.log("Delete response:", { 
          status: response.status, 
          statusText: response.statusText,
          ok: response.ok,
          type: response.type,
          url: response.url
        });
        
        // For 204 responses, there's no body to parse
        if (response.status === 204) {
          console.log("Delete successful with 204 No Content response");
          return true;
        }
        
        // For other successful responses, try to parse the body if there is one
        try {
          const clonedResponse = response.clone();
          const text = await clonedResponse.text();
          console.log("Delete response body:", text || "(empty)");
        } catch (parseError) {
          console.log("Could not parse response body:", parseError);
        }
        
        return true; // Return something to indicate success
      } catch (error) {
        console.error("Error in delete mutation:", error);
        throw error; // Re-throw to trigger onError
      }
    },
    onSuccess: () => {
      console.log("Delete mutation successful, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
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
            onClick={(e) => {
              e.preventDefault(); // Prevent default action
              e.stopPropagation(); // Stop event propagation
              handleDelete(); // Call our delete handler
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
