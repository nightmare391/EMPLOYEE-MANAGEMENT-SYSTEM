import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search as SearchIcon } from "lucide-react";
import { departments, type Employee } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Search() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    department: "",
    role: "",
    city: "",
    joinedAfter: "",
  });
  
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const { data: allEmployees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });
  
  const handleInputChange = (field: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSearch = () => {
    setIsSearchActive(true);
  };
  
  // Filter employees based on search criteria
  const filteredEmployees = isSearchActive && allEmployees
    ? allEmployees.filter(employee => {
        if (searchParams.name && !employee.name.toLowerCase().includes(searchParams.name.toLowerCase())) {
          return false;
        }
        if (searchParams.department && searchParams.department !== "all" && employee.department !== searchParams.department) {
          return false;
        }
        if (searchParams.role && !employee.role.toLowerCase().includes(searchParams.role.toLowerCase())) {
          return false;
        }
        if (searchParams.city && !employee.city.toLowerCase().includes(searchParams.city.toLowerCase())) {
          return false;
        }
        if (searchParams.joinedAfter) {
          const joinedAfterDate = new Date(searchParams.joinedAfter);
          const employeeJoinDate = new Date(employee.joinDate);
          if (employeeJoinDate < joinedAfterDate) {
            return false;
          }
        }
        return true;
      })
    : [];
  
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };
  
  const getDepartmentBadgeClass = (department: string) => {
    const classes = {
      Engineering: "bg-blue-100 text-blue-800",
      Design: "bg-pink-100 text-pink-800",
      Product: "bg-purple-100 text-purple-800",
      Marketing: "bg-green-100 text-green-800",
      Sales: "bg-orange-100 text-orange-800",
      "Human Resources": "bg-yellow-100 text-yellow-800",
      Finance: "bg-indigo-100 text-indigo-800",
      Operations: "bg-teal-100 text-teal-800",
    };
    return classes[department as keyof typeof classes] || "bg-gray-100 text-gray-800";
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Search Employees</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="search-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              id="search-name"
              value={searchParams.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Search by name..."
            />
          </div>
          
          <div>
            <label htmlFor="search-department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <Select
              value={searchParams.department}
              onValueChange={(value) => handleInputChange("department", value)}
            >
              <SelectTrigger id="search-department">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="search-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <Input
              id="search-role"
              value={searchParams.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Search by role..."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="search-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <Input
              id="search-location"
              value={searchParams.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="City or remote..."
            />
          </div>
          
          <div>
            <label htmlFor="search-join-date" className="block text-sm font-medium text-gray-700 mb-1">Joined After</label>
            <Input
              id="search-join-date"
              type="date"
              value={searchParams.joinedAfter}
              onChange={(e) => handleInputChange("joinedAfter", e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button
              className="bg-primary text-white hover:bg-blue-600 w-full"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <SearchIcon className="h-4 w-4 mr-1" /> Search Employees
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 mr-2">Quick filters:</span>
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-1 text-xs rounded-full"
            onClick={() => {
              const today = new Date();
              const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              setSearchParams({
                ...searchParams,
                joinedAfter: format(firstDayOfMonth, "yyyy-MM-dd"),
              });
            }}
          >
            Joined this month
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-1 text-xs rounded-full"
            onClick={() => {
              setSearchParams({
                ...searchParams,
                department: "Engineering",
              });
            }}
          >
            Engineering team
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-1 text-xs rounded-full"
            onClick={() => {
              setSearchParams({
                ...searchParams,
                city: "remote",
              });
            }}
          >
            Remote employees
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-1 text-xs rounded-full"
            onClick={() => {
              setSearchParams({
                ...searchParams,
                role: "manager",
              });
            }}
          >
            Management
          </Button>
        </div>
      </div>
      
      {/* Search Results */}
      {isSearchActive && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Search Results</h2>
            <p className="text-sm text-gray-500">
              Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} matching your criteria
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-3">Name</TableHead>
                  <TableHead className="px-6 py-3">Role</TableHead>
                  <TableHead className="px-6 py-3">Department</TableHead>
                  <TableHead className="px-6 py-3">Location</TableHead>
                  <TableHead className="px-6 py-3">Join Date</TableHead>
                  <TableHead className="px-6 py-3 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.role}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDepartmentBadgeClass(employee.department)}`}>
                          {employee.department}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.city}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(employee.joinDate)}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/employees/${employee.id}`}>
                          <span className="text-primary hover:text-blue-800 cursor-pointer">View</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No employees found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredEmployees.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEmployees.length}</span> of <span className="font-medium">{filteredEmployees.length}</span> results
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
