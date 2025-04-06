import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API routes with /api prefix
  const apiRouter = express.Router();
  
  // GET all employees
  apiRouter.get("/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });
  
  // SEARCH employees - IMPORTANT: This must come BEFORE the /:id route
  apiRouter.get("/employees/search", async (req, res) => {
    try {
      const results = await storage.searchEmployees(req.query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search employees" });
    }
  });
  
  // GET single employee by ID
  apiRouter.get("/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }
      
      const employee = await storage.getEmployee(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });
  
  // POST create a new employee
  apiRouter.post("/employees", async (req, res) => {
    try {
      console.log("Received POST data:", req.body);
      const employeeData = insertEmployeeSchema.parse(req.body);
      console.log("Parsed employee data:", employeeData);
      const newEmployee = await storage.createEmployee(employeeData);
      res.status(201).json(newEmployee);
    } catch (error) {
      console.error("Error creating employee:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: "Failed to create employee" });
    }
  });
  
  // PUT update an existing employee
  apiRouter.put("/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }
      
      console.log("Received PUT data for ID:", id, req.body);
      
      // Validate the update data (partial validation)
      const updateData = insertEmployeeSchema.partial().parse(req.body);
      console.log("Parsed update data:", updateData);
      
      const updatedEmployee = await storage.updateEmployee(id, updateData);
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: "Failed to update employee" });
    }
  });
  
  // DELETE an employee
  apiRouter.delete("/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        console.error(`Delete failed: Invalid employee ID - ${req.params.id}`);
        return res.status(400).json({ message: "Invalid employee ID" });
      }
      
      // Get current employees to check if the employee exists
      const beforeEmployees = await storage.getEmployees();
      console.log(`Current employees count before delete: ${beforeEmployees.length}`);
      console.log(`Employee IDs before delete: ${beforeEmployees.map(e => e.id).join(', ')}`);
      
      console.log(`Attempting to delete employee with ID: ${id}`);
      const success = await storage.deleteEmployee(id);
      console.log(`Delete result: ${success}`);
      
      // Get updated employees after delete attempt
      const afterEmployees = await storage.getEmployees();
      console.log(`Current employees count after delete: ${afterEmployees.length}`);
      console.log(`Employee IDs after delete: ${afterEmployees.map(e => e.id).join(', ')}`);
      
      if (!success) {
        console.error(`Delete failed: Employee with ID ${id} not found`);
        return res.status(404).json({ message: "Employee not found" });
      }
      
      console.log(`Successfully deleted employee with ID: ${id}`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });
  
  // Register the API routes
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  
  return httpServer;
}
