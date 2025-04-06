import { employees, type Employee, type InsertEmployee } from "@shared/schema";

// Interface for CRUD operations
export interface IStorage {
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  searchEmployees(query: Record<string, any>): Promise<Employee[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private employees: Map<number, Employee>;
  private currentId: number;

  constructor() {
    this.employees = new Map();
    this.currentId = 1;
    
    // Add initial sample data (this would not be in a production app)
    const now = new Date();
    this.addInitialData(now);
  }

  private addInitialData(now: Date) {
    // This is just for development convenience
    const sampleEmployees: InsertEmployee[] = [
      {
        name: "Sarah Johnson",
        role: "Senior Developer",
        department: "Engineering",
        city: "San Francisco",
        email: "sarah.johnson@example.com",
        phone: "(555) 123-4567",
        joinDate: new Date(now.getFullYear() - 2, 0, 15), // Jan 15, 2 years ago
        about: "Sarah is an experienced developer specializing in frontend technologies with over 8 years of industry experience. She has led multiple projects from concept to completion, focusing on React and modern JavaScript frameworks. Sarah is passionate about creating responsive and accessible web applications, and mentors junior developers on the team."
      },
      {
        name: "Michael Chen",
        role: "Product Manager",
        department: "Product",
        city: "New York",
        email: "michael.chen@example.com",
        phone: "(555) 234-5678",
        joinDate: new Date(now.getFullYear() - 1, 2, 22), // Mar 22, last year
        about: "Product strategist with expertise in market analysis, agile methodologies, and cross-functional team leadership. Michael has successfully launched multiple products that increased company revenue by 30%."
      },
      {
        name: "Jessica Williams",
        role: "UX Designer",
        department: "Design",
        city: "Austin",
        email: "jessica.williams@example.com",
        phone: "(555) 345-6789",
        joinDate: new Date(now.getFullYear() - 1, 7, 10), // Aug 10, last year
        about: "Creative designer focused on user-centered experiences, with skills in prototyping, user research and visual design. Jessica has led the redesign of the company's flagship product, resulting in a 45% increase in user engagement."
      },
      {
        name: "David Rodriguez",
        role: "Marketing Specialist",
        department: "Marketing",
        city: "Chicago",
        email: "david.rodriguez@example.com",
        phone: "(555) 456-7890",
        joinDate: new Date(now.getFullYear() - 1, 9, 5), // Oct 5, last year
        about: "Strategic marketer with experience in digital campaigns, content creation, and brand development across multiple channels. David has executed campaigns that generated a 25% increase in qualified leads."
      }
    ];

    sampleEmployees.forEach(emp => this.createEmployee(emp));
  }

  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.currentId++;
    
    // Make sure the data matches the Employee type with proper null handling
    const employee: Employee = {
      id,
      name: insertEmployee.name,
      role: insertEmployee.role,
      department: insertEmployee.department,
      city: insertEmployee.city,
      email: insertEmployee.email,
      phone: insertEmployee.phone ?? null, // Use null coalescing for proper null handling
      joinDate: insertEmployee.joinDate,
      about: insertEmployee.about ?? null // Use null coalescing for proper null handling
    };
    
    this.employees.set(id, employee);
    console.log(`Created employee with ID ${id}:`, employee);
    return employee;
  }

  async updateEmployee(id: number, updatedEmployee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const existingEmployee = this.employees.get(id);
    
    if (!existingEmployee) {
      return undefined;
    }
    
    // Create a properly typed updated employee object
    const updated: Employee = {
      ...existingEmployee,
      // Only update fields that are provided
      name: updatedEmployee.name ?? existingEmployee.name,
      role: updatedEmployee.role ?? existingEmployee.role,
      department: updatedEmployee.department ?? existingEmployee.department,
      city: updatedEmployee.city ?? existingEmployee.city,
      email: updatedEmployee.email ?? existingEmployee.email,
      phone: updatedEmployee.phone !== undefined ? updatedEmployee.phone : existingEmployee.phone,
      joinDate: updatedEmployee.joinDate ?? existingEmployee.joinDate,
      about: updatedEmployee.about !== undefined ? updatedEmployee.about : existingEmployee.about,
    };
    
    this.employees.set(id, updated);
    return updated;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    console.log(`Attempting to delete employee with ID ${id}`);
    console.log(`Current employees in storage: ${Array.from(this.employees.keys()).join(', ')}`);
    
    // Check if the employee exists before trying to delete
    const exists = this.employees.has(id);
    console.log(`Employee with ID ${id} exists: ${exists}`);
    
    if (exists) {
      try {
        // Get the employee before deleting (for logging)
        const employee = this.employees.get(id);
        console.log(`Found employee to delete:`, employee);
        
        // Try to delete the employee
        const result = this.employees.delete(id);
        console.log(`Map.delete result for ID ${id}: ${result}`);
        console.log(`Remaining employees: ${Array.from(this.employees.keys()).join(', ')}`);
        
        return result;
      } catch (error) {
        console.error(`Error deleting employee with ID ${id}:`, error);
        return false;
      }
    } else {
      console.log(`Cannot delete: employee with ID ${id} not found`);
      return false;
    }
  }

  async searchEmployees(query: Record<string, any>): Promise<Employee[]> {
    let results = Array.from(this.employees.values());
    
    // Filter by name
    if (query.name) {
      const nameSearch = query.name.toLowerCase();
      results = results.filter(employee => 
        employee.name.toLowerCase().includes(nameSearch)
      );
    }
    
    // Filter by role
    if (query.role) {
      const roleSearch = query.role.toLowerCase();
      results = results.filter(employee => 
        employee.role.toLowerCase().includes(roleSearch)
      );
    }
    
    // Filter by department
    if (query.department && query.department !== "") {
      results = results.filter(employee => 
        employee.department === query.department
      );
    }
    
    // Filter by city/location
    if (query.city) {
      const citySearch = query.city.toLowerCase();
      results = results.filter(employee => 
        employee.city.toLowerCase().includes(citySearch)
      );
    }
    
    // Filter by join date (after a specified date)
    if (query.joinedAfter) {
      const joinedAfter = new Date(query.joinedAfter);
      results = results.filter(employee => 
        new Date(employee.joinDate) >= joinedAfter
      );
    }
    
    return results;
  }
}

export const storage = new MemStorage();
