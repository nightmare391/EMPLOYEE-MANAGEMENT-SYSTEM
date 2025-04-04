import { Card, CardContent } from "@/components/ui/card";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AddEmployee() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  const handleCancel = () => {
    navigate("/");
  };
  
  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Employee has been added successfully.",
    });
    navigate("/");
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Employee</h1>
      
      <Card>
        <CardContent className="p-6">
          <EmployeeForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
