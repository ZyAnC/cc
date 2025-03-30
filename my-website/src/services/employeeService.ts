import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

// 基础接口，不继承 RowDataPacket
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

// 数据库查询结果接口
export interface Employee {
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

export interface EmployeeRole {
  id: number;
  job_title: string;
  department: string;
  division: string;
  location: string;
  zone_access: string;
  reporting_officer: string;
  authorized?: boolean;
}

// 业务逻辑接口
export interface EmployeeWithDetails {
  id: number;
  employee_id: string;
  name: string;
  title: string;
  hire_date: string;
  active_status: boolean;
  role?: EmployeeRole;
  roles?: EmployeeRole[];
  access_authorizations?: EmployeeRole[];
}

const API_BASE_URL = 'http://localhost:3001/api';

class EmployeeService {
  async getAllEmployees(): Promise<EmployeeWithDetails[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error('获取员工列表失败');
      }
      const data = await response.json();
      return data.map((employee: any) => ({
        ...employee,
        roles: employee.roles || [],
        access_authorizations: employee.access_authorizations || []
      }));
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(id: number): Promise<EmployeeWithDetails | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error('获取员工信息失败');
      }
      const data = await response.json();
      return {
        ...data,
        roles: data.roles || [],
        access_authorizations: data.access_authorizations || []
      };
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async createEmployee(employeeData: Partial<Employee>, roleData?: Partial<EmployeeRole>): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeData, roleData }),
      });
      if (!response.ok) {
        throw new Error('创建员工失败');
      }
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(
    id: number,
    employeeData: Partial<Employee>,
    roleData?: Partial<EmployeeRole>
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeData, roleData }),
      });
      if (!response.ok) {
        throw new Error('更新员工信息失败');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('删除员工失败');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  async updateEmployeeRoleAuthorization(roleId: number, authorized: boolean): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/role/${roleId}/authorization`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorized }),
      });
      if (!response.ok) {
        throw new Error('更新角色权限失败');
      }
    } catch (error) {
      console.error('Error updating role authorization:', error);
      throw error;
    }
  }
}

export const employeeService = new EmployeeService(); 