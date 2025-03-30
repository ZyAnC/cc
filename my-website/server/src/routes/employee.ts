import express from 'express';
import { employeeService } from '../services/employeeService';

const router = express.Router();

// 获取所有员工
router.get('/', async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error in GET /employees:', error);
    res.status(500).json({ message: '获取员工列表失败' });
  }
});

// 获取单个员工
router.get('/:id', async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(Number(req.params.id));
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: '未找到该员工' });
    }
  } catch (error) {
    console.error('Error in GET /employees/:id:', error);
    res.status(500).json({ message: '获取员工信息失败' });
  }
});

// 创建员工
router.post('/', async (req, res) => {
  try {
    const { employeeData, roleData } = req.body;
    const id = await employeeService.createEmployee(employeeData, roleData);
    res.status(201).json({ id, message: '员工创建成功' });
  } catch (error) {
    console.error('Error in POST /employees:', error);
    res.status(500).json({ message: '创建员工失败' });
  }
});

// 更新员工
router.put('/:id', async (req, res) => {
  try {
    const { employeeData, roleData } = req.body;
    await employeeService.updateEmployee(Number(req.params.id), employeeData, roleData);
    res.json({ message: '员工信息更新成功' });
  } catch (error) {
    console.error('Error in PUT /employees/:id:', error);
    res.status(500).json({ message: '更新员工信息失败' });
  }
});

// 删除员工
router.delete('/:id', async (req, res) => {
  try {
    await employeeService.deleteEmployee(Number(req.params.id));
    res.json({ message: '员工删除成功' });
  } catch (error) {
    console.error('Error in DELETE /employees/:id:', error);
    res.status(500).json({ message: '删除员工失败' });
  }
});

// 更新角色权限
router.put('/role/:id/authorization', async (req, res) => {
  try {
    const roleId = Number(req.params.id);
    const { authorized } = req.body;
    await employeeService.updateEmployeeRoleAuthorization(roleId, authorized);
    res.json({ message: '角色权限更新成功' });
  } catch (error) {
    console.error('Error in PUT /employees/role/:id/authorization:', error);
    res.status(500).json({ message: '更新角色权限失败' });
  }
});

export const employeeRoutes = router; 