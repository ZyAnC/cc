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
exports.employeeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const employeeService_1 = require("../services/employeeService");
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// 获取所有员工
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeService_1.employeeService.getAllEmployees();
        res.json(employees);
    }
    catch (error) {
        console.error('Error in GET /employees:', error);
        res.status(500).json({ message: '获取员工列表失败' });
    }
}));
// 获取单个员工
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield employeeService_1.employeeService.getEmployeeById(Number(req.params.id));
        if (employee) {
            res.json(employee);
        }
        else {
            res.status(404).json({ message: '未找到该员工' });
        }
    }
    catch (error) {
        console.error('Error in GET /employees/:id:', error);
        res.status(500).json({ message: '获取员工信息失败' });
    }
}));
// 创建员工
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeData, roleData } = req.body;
        const id = yield employeeService_1.employeeService.createEmployee(employeeData, roleData);
        res.status(201).json({ id, message: '员工创建成功' });
    }
    catch (error) {
        console.error('Error in POST /employees:', error);
        res.status(500).json({ message: '创建员工失败' });
    }
}));
// 更新员工
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeData, roleData } = req.body;
        yield employeeService_1.employeeService.updateEmployee(Number(req.params.id), employeeData, roleData);
        res.json({ message: '员工信息更新成功' });
    }
    catch (error) {
        console.error('Error in PUT /employees/:id:', error);
        res.status(500).json({ message: '更新员工信息失败' });
    }
}));
// 删除员工
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield employeeService_1.employeeService.deleteEmployee(Number(req.params.id));
        res.json({ message: '员工删除成功' });
    }
    catch (error) {
        console.error('Error in DELETE /employees/:id:', error);
        res.status(500).json({ message: '删除员工失败' });
    }
}));
// 更新角色权限
router.put('/role/:id/authorization', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleId = Number(req.params.id);
        const { authorized } = req.body;
        yield employeeService_1.employeeService.updateEmployeeRoleAuthorization(roleId, authorized);
        res.json({ message: '角色权限更新成功' });
    }
    catch (error) {
        console.error('Error in PUT /employees/role/:id/authorization:', error);
        res.status(500).json({ message: '更新角色权限失败' });
    }
}));
// 获取员工培训认证
router.get('/:id/training', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 首先更新过期状态
        yield db_1.default.query(`UPDATE training_certification 
       SET status = CASE 
         WHEN expiry_date < CURDATE() THEN 'expired' 
         ELSE 'current' 
       END 
       WHERE employee_id = ?`, [req.params.id]);
        // 然后获取更新后的数据
        const [certifications] = yield db_1.default.query(`SELECT * FROM training_certification 
       WHERE employee_id = ? 
       ORDER BY expiry_date DESC`, [req.params.id]);
        res.json(certifications);
    }
    catch (error) {
        console.error('Error in GET /employees/:id/training:', error);
        res.status(500).json({ message: '获取培训认证信息失败' });
    }
}));
// 添加培训认证
router.post('/:id/training', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { certification, description, expiry_date } = req.body;
        const status = new Date(expiry_date) > new Date() ? 'current' : 'expired';
        const [result] = yield db_1.default.query(`INSERT INTO training_certification (employee_id, certification, description, status, expiry_date) 
       VALUES (?, ?, ?, ?, ?)`, [req.params.id, certification, description, status, expiry_date]);
        res.status(201).json({
            id: result.insertId,
            message: '培训认证添加成功'
        });
    }
    catch (error) {
        console.error('Error in POST /employees/:id/training:', error);
        res.status(500).json({ message: '添加培训认证失败' });
    }
}));
// 更新培训认证状态
router.put('/:employeeId/training/:certId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        yield db_1.default.query(`UPDATE training_certification SET status = ? WHERE id = ? AND employee_id = ?`, [status, req.params.certId, req.params.employeeId]);
        res.json({ message: '培训认证状态更新成功' });
    }
    catch (error) {
        console.error('Error in PUT /employees/:employeeId/training/:certId:', error);
        res.status(500).json({ message: '更新培训认证状态失败' });
    }
}));
exports.employeeRoutes = router;
