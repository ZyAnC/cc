"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeService = void 0;
const db_1 = __importDefault(require("../config/db"));
class EmployeeService {
    getAllEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [employees] = yield db_1.default.query(`
        SELECT * FROM Employee
      `);
                const employeesWithDetails = yield Promise.all(employees.map((employee) => __awaiter(this, void 0, void 0, function* () {
                    const [roles] = yield db_1.default.query(`SELECT * FROM Employee_Role WHERE employee_id = ?`, [employee.id]);
                    return {
                        id: employee.id,
                        employee_id: employee.employee_id,
                        name: employee.name,
                        primary_phone: employee.primary_phone,
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
                })));
                return employeesWithDetails;
            }
            catch (error) {
                console.error('Error fetching employees:', error);
                throw error;
            }
        });
    }
    getEmployeeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [employees] = yield db_1.default.query(`SELECT * FROM Employee WHERE id = ?`, [id]);
                if (employees.length === 0) {
                    return null;
                }
                const employee = employees[0];
                const [roles] = yield db_1.default.query(`SELECT * FROM Employee_Role WHERE employee_id = ?`, [id]);
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
            }
            catch (error) {
                console.error('Error fetching employee:', error);
                throw error;
            }
        });
    }
    createEmployee(employeeData, roleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                const [result] = yield connection.query('INSERT INTO Employee SET ?', employeeData);
                const employeeId = result.insertId;
                if (roleData && employeeId) {
                    yield connection.query('INSERT INTO Employee_Role SET ?', Object.assign(Object.assign({}, roleData), { employee_id: employeeId }));
                }
                yield connection.commit();
                return employeeId;
            }
            catch (error) {
                yield connection.rollback();
                console.error('Error creating employee:', error);
                throw error;
            }
            finally {
                connection.release();
            }
        });
    }
    updateEmployee(id, employeeData, roleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                yield connection.query('UPDATE Employee SET ? WHERE id = ?', [employeeData, id]);
                if (roleData) {
                    yield connection.query('UPDATE Employee_Role SET ? WHERE employee_id = ?', [roleData, id]);
                }
                yield connection.commit();
            }
            catch (error) {
                yield connection.rollback();
                console.error('Error updating employee:', error);
                throw error;
            }
            finally {
                connection.release();
            }
        });
    }
    deleteEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                yield connection.query('DELETE FROM Employee_Role WHERE employee_id = ?', [id]);
                yield connection.query('DELETE FROM Employee WHERE id = ?', [id]);
                yield connection.commit();
            }
            catch (error) {
                yield connection.rollback();
                console.error('Error deleting employee:', error);
                throw error;
            }
            finally {
                connection.release();
            }
        });
    }
    updateEmployeeRoleAuthorization(roleId, authorized) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                yield connection.query('UPDATE Employee_Role SET authorized = ? WHERE id = ?', [authorized, roleId]);
                yield connection.commit();
            }
            catch (error) {
                yield connection.rollback();
                console.error('Error updating role authorization:', error);
                throw error;
            }
            finally {
                connection.release();
            }
        });
    }
}
exports.employeeService = new EmployeeService();
