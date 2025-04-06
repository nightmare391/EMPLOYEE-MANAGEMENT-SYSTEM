import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { type Employee } from "@shared/schema";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EditEmployeeDialog from "@/components/employees/EditEmployeeDialog";
import DeleteEmployeeDialog from "@/components/employees/DeleteEmployeeDialog";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Manage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });
  
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.city.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (employee: Employee) => {
    console.log("Delete clicked for employee:", employee);
    // Create a fresh copy of the employee object to avoid any reference issues
    const employeeCopy = { ...employee };
    setSelectedEmployee(employeeCopy);
    setIsDeleteDialogOpen(true);
  };
  
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };
  
  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Employees</h1>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search employees..."
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}
      
      <EditEmployeeDialog
        employee={selectedEmployee}
        isOpen={isEditDialogOpen}
        onClose={handleEditDialogClose}
      />
      
      <DeleteEmployeeDialog
        employee={selectedEmployee}
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
      />
    </div>
  );
}
