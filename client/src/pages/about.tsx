import { Card, CardContent } from "@/components/ui/card";
import { FileSearch, Users, Edit, Layout, Mail, Phone, HelpCircle } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About Employee Management System</h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            The Employee Management System (EMS) provides a comprehensive solution for organizations to effectively manage their workforce. Our platform streamlines employee data management, helps track performance, and facilitates better communication across departments.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 text-primary rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800">Employee Directory</h3>
                <p className="text-gray-600">Centralized database of all employees with detailed profiles</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-green-100 text-green-600 rounded-lg">
                <FileSearch className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800">Advanced Search</h3>
                <p className="text-gray-600">Find employees by name, department, skills and more</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-100 text-purple-600 rounded-lg">
                <Edit className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800">Easy Management</h3>
                <p className="text-gray-600">Add, edit, and manage employee information seamlessly</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-lg">
                <Layout className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800">Intuitive Interface</h3>
                <p className="text-gray-600">User-friendly design for efficient workforce management</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg flex-1">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold text-lg mb-3">1</div>
              <h3 className="font-medium text-gray-800 mb-2">Add Employees</h3>
              <p className="text-gray-600 text-sm">Enter employee details through our simple form interface</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex-1">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold text-lg mb-3">2</div>
              <h3 className="font-medium text-gray-800 mb-2">Manage Records</h3>
              <p className="text-gray-600 text-sm">Update information, track changes, and maintain accuracy</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex-1">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold text-lg mb-3">3</div>
              <h3 className="font-medium text-gray-800 mb-2">Search & View</h3>
              <p className="text-gray-600 text-sm">Quickly find and access employee information when needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            Have questions about the Employee Management System? We're here to help!
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center text-gray-700">
              <Mail className="text-primary mr-2 h-5 w-5" />
              <span>support@ems-system.com</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="text-primary mr-2 h-5 w-5" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center text-gray-700">
              <HelpCircle className="text-primary mr-2 h-5 w-5" />
              <span>Help Center</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
