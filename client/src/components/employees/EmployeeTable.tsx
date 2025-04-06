import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { type Employee } from "@shared/schema";
import { format } from "date-fns";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

type SortField = "name" | "role" | "department" | "city" | "joinDate";
type SortDirection = "asc" | "desc";

export default function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  const getDepartmentStyle = (department: string) => {
    const styles = {
      Engineering: "bg-blue-100 text-blue-800",
      Design: "bg-pink-100 text-pink-800",
      Product: "bg-purple-100 text-purple-800",
      Marketing: "bg-green-100 text-green-800",
      Sales: "bg-orange-100 text-orange-800",
      "Human Resources": "bg-yellow-100 text-yellow-800",
      Finance: "bg-indigo-100 text-indigo-800",
      Operations: "bg-teal-100 text-teal-800",
    };
    return styles[department as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };
  
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const sortedEmployees = [...employees].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "role":
        comparison = a.role.localeCompare(b.role);
        break;
      case "department":
        comparison = a.department.localeCompare(b.department);
        break;
      case "city":
        comparison = a.city.localeCompare(b.city);
        break;
      case "joinDate":
        comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        break;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead 
                className="px-6 py-3 cursor-pointer hover:text-primary"
                onClick={() => handleSort("name")}
              >
                Name <ArrowUpDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead 
                className="px-6 py-3 cursor-pointer hover:text-primary"
                onClick={() => handleSort("role")}
              >
                Role <ArrowUpDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead 
                className="px-6 py-3 cursor-pointer hover:text-primary"
                onClick={() => handleSort("department")}
              >
                Department <ArrowUpDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead 
                className="px-6 py-3 cursor-pointer hover:text-primary"
                onClick={() => handleSort("city")}
              >
                City <ArrowUpDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead 
                className="px-6 py-3 cursor-pointer hover:text-primary"
                onClick={() => handleSort("joinDate")}
              >
                Join Date <ArrowUpDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead className="px-6 py-3 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.role}</div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDepartmentStyle(employee.department)}`}>
                    {employee.department}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.city}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(employee.joinDate)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 mr-3"
                    onClick={() => onEdit(employee)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Delete button clicked for employee ID:", employee.id);
                      onDelete(employee);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {employees.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{employees.length}</span> of <span className="font-medium">{employees.length}</span> employees
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={true}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={true}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
