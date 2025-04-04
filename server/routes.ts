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
      const employeeData = insertEmployeeSchema.parse(req.body);
      const newEmployee = await storage.createEmployee(employeeData);
      res.status(201).json(newEmployee);
    } catch (error) {
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
      
      // Validate the update data (partial validation)
      const updateData = insertEmployeeSchema.partial().parse(req.body);
      
      const updatedEmployee = await storage.updateEmployee(id, updateData);
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json(updatedEmployee);
    } catch (error) {
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
        return res.status(400).json({ message: "Invalid employee ID" });
      }
      
      const success = await storage.deleteEmployee(id);
      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });
  
  // SEARCH employees
  apiRouter.get("/employees/search", async (req, res) => {
    try {
      const results = await storage.searchEmployees(req.query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search employees" });
    }
  });
  
  // Register the API routes
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  
  return httpServer;
}
