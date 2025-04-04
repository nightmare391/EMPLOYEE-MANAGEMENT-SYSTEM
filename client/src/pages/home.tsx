import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import EmployeeCard from "@/components/employees/EmployeeCard";
import EditEmployeeDialog from "@/components/employees/EditEmployeeDialog";
import { Link } from "wouter";
import { type Employee } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });
  
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const handleEmployeeEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };
  
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Employee Directory</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Quick search..."
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Link href="/add">
            <Button className="bg-primary text-white hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-1" /> Add Employee
            </Button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5">
              <div className="space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
                <div className="flex items-center">
                  <Skeleton className="h-4 w-1/3 mr-4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEditClick={handleEmployeeEdit}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No employees found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}
      
      <EditEmployeeDialog
        employee={selectedEmployee}
        isOpen={isEditDialogOpen}
        onClose={handleEditDialogClose}
      />
    </div>
  );
}
