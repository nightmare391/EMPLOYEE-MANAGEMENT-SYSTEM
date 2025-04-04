import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the employees table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  city: text("city").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  joinDate: timestamp("join_date").notNull(),
  about: text("about"),
});

// Create the insert schema for validation
export const insertEmployeeSchema = createInsertSchema(employees).pick({
  name: true,
  role: true,
  department: true,
  city: true,
  email: true,
  phone: true,
  joinDate: true,
  about: true,
}).extend({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  about: z.string().optional(),
});

// Define types for the employee
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Define departments for consistent reference
export const departments = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
] as const;

export const departmentSchema = z.enum([
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
]);

export type Department = z.infer<typeof departmentSchema>;
