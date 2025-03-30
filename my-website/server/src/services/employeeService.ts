import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

interface BaseEmployee {
  id: number;
  employee_id: string;
  name: string;
  title: string;
  hire_date: Date;
  work_title: string;
  active_status: boolean;
  created_at: Date;
  updated_at: Date;
}

interface BaseEmployeeRole {
  id: number;
  employee_id: number;
  job_title: string;
  department: string;
  division: string;
  location: string;
  zone_access: string;
  reporting_officer: string;
  authorized: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Employee extends BaseEmployee, RowDataPacket {}
export interface EmployeeRole extends BaseEmployeeRole, RowDataPacket {}

export interface EmployeeWithDetails extends BaseEmployee {
  role?: BaseEmployeeRole;
  roles?: BaseEmployeeRole[];
  access_authorizations?: BaseEmployeeRole[];
}

class EmployeeService {
  async getAllEmployees(): Promise<EmployeeWithDetails[]> {
    try {
      const [employees] = await pool.query<Employee[]>(`
        SELECT * FROM Employee
      `);

      const employeesWithDetails = await Promise.all(employees.map(async employee => {
        const [roles] = await pool.query<EmployeeRole[]>(
          `SELECT * FROM Employee_Role WHERE employee_id = ?`,
          [employee.id]
        );

        return {
          id: employee.id,
          employee_id: employee.employee_id,
          name: employee.name,
          title: employee.title,
          hire_date: employee.hire_date,
          work_title: employee.work_title,
          active_status: employee.active_status,
          created_at: employee.created_at,
          updated_at: employee.updated_at,
          role: roles[0],
          roles: roles,
          access_authorizations: roles
        };
      }));

      return employeesWithDetails;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(id: number): Promise<EmployeeWithDetails | null> {
    try {
      const [employees] = await pool.query<Employee[]>(
        `SELECT * FROM Employee WHERE id = ?`,
        [id]
      );

      if (employees.length === 0) {
        return null;
      }

      const employee = employees[0];

      const [roles] = await pool.query<EmployeeRole[]>(
        `SELECT * FROM Employee_Role WHERE employee_id = ?`,
        [id]
      );

      return {
        id: employee.id,
        employee_id: employee.employee_id,
        name: employee.name,
        title: employee.title,
        hire_date: employee.hire_date,
        work_title: employee.work_title,
        active_status: employee.active_status,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
        role: roles[0],
        roles: roles,
        access_authorizations: roles
      };
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async createEmployee(employeeData: Partial<Employee>, roleData?: Partial<EmployeeRole>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'INSERT INTO Employee SET ?',
        employeeData
      );

      const employeeId = (result as any).insertId;

      if (roleData && employeeId) {
        await connection.query(
          'INSERT INTO Employee_Role SET ?',
          { ...roleData, employee_id: employeeId }
        );
      }

      await connection.commit();
      return employeeId;
    } catch (error) {
      await connection.rollback();
      console.error('Error creating employee:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateEmployee(
    id: number, 
    employeeData: Partial<Employee>, 
    roleData?: Partial<EmployeeRole>
  ): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        'UPDATE Employee SET ? WHERE id = ?',
        [employeeData, id]
      );

      if (roleData) {
        await connection.query(
          'UPDATE Employee_Role SET ? WHERE employee_id = ?',
          [roleData, id]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('Error updating employee:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        'DELETE FROM Employee_Role WHERE employee_id = ?',
        [id]
      );

      await connection.query(
        'DELETE FROM Employee WHERE id = ?',
        [id]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('Error deleting employee:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateEmployeeRoleAuthorization(roleId: number, authorized: boolean): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        'UPDATE Employee_Role SET authorized = ? WHERE id = ?',
        [authorized, roleId]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('Error updating role authorization:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export const employeeService = new EmployeeService(); 