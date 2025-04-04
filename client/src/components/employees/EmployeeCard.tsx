import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, ExternalLink, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { type Employee } from "@shared/schema";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

interface EmployeeCardProps {
  employee: Employee;
  onEditClick: (employee: Employee) => void;
}

export default function EmployeeCard({ employee, onEditClick }: EmployeeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  const getDepartmentColor = (department: string) => {
    const colors = {
      Engineering: "bg-blue-100 text-blue-700",
      Design: "bg-pink-100 text-pink-700",
      Product: "bg-purple-100 text-purple-700",
      Marketing: "bg-green-100 text-green-700",
      Sales: "bg-orange-100 text-orange-700",
      "Human Resources": "bg-yellow-100 text-yellow-700",
      Finance: "bg-indigo-100 text-indigo-700",
      Operations: "bg-teal-100 text-teal-700",
    };
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick(employee);
  };
  
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return format(d, "MMM dd, yyyy");
  };
  
  const getJoinedMonth = (date: Date | string) => {
    const d = new Date(date);
    return format(d, "MMM yyyy");
  };
  
  return (
    <Card 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={toggleExpand}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{employee.name}</h3>
              <p className="text-primary font-medium">{employee.role}</p>
            </div>
            <div className={`text-xs font-medium px-2.5 py-1 rounded ${getDepartmentColor(employee.department)}`}>
              {employee.department}
            </div>
          </div>
          
          <p className="mt-3 text-gray-600 text-sm line-clamp-2">
            {employee.about || "No information available."}
          </p>
          
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{employee.city}</span>
            <Calendar className="h-4 w-4 ml-4 mr-1" />
            <span>Joined {getJoinedMonth(employee.joinDate)}</span>
          </div>
        </div>
        
        {/* Expanded View */}
        {isExpanded && (
          <div className="border-t border-gray-100 bg-gray-50 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{employee.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-gray-800">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Joining</p>
                <p className="text-gray-800">{formatDate(employee.joinDate)}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500">About</p>
              <p className="text-gray-800 text-sm mt-1">
                {employee.about || "No information available."}
              </p>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
                onClick={handleEditClick}
              >
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button size="sm" className="bg-primary text-white hover:bg-blue-600">
                <ExternalLink className="h-4 w-4 mr-1" /> View Full Profile
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
