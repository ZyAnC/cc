import express from 'express';
import { employeeService } from '../services/employeeService';
import pool from '../config/db';

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
    res.status(201).json(id);
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

// 获取员工培训认证
router.get('/:id/training', async (req, res) => {
  try {
    // 首先更新过期状态
    await pool.query(
      `UPDATE training_certification 
       SET status = CASE 
         WHEN expiry_date < CURDATE() THEN 'expired' 
         ELSE 'current' 
       END 
       WHERE employee_id = ?`,
      [req.params.id]
    );

    // 然后获取更新后的数据
    const [certifications] = await pool.query(
      `SELECT * FROM training_certification 
       WHERE employee_id = ? 
       ORDER BY expiry_date DESC`,
      [req.params.id]
    );
    res.json(certifications);
  } catch (error) {
    console.error('Error in GET /employees/:id/training:', error);
    res.status(500).json({ message: '获取培训认证信息失败' });
  }
});

// 添加培训认证
router.post('/:id/training', async (req, res) => {
  try {
    const { certification, description, expiry_date } = req.body;
    const status = new Date(expiry_date) > new Date() ? 'current' : 'expired';
    
    const [result] = await pool.query(
      `INSERT INTO training_certification (employee_id, certification, description, status, expiry_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, certification, description, status, expiry_date]
    );
    
    res.status(201).json({ 
      id: (result as any).insertId,
      message: '培训认证添加成功' 
    });
  } catch (error) {
    console.error('Error in POST /employees/:id/training:', error);
    res.status(500).json({ message: '添加培训认证失败' });
  }
});

// 更新培训认证状态
router.put('/:employeeId/training/:certId', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query(
      `UPDATE training_certification SET status = ? WHERE id = ? AND employee_id = ?`,
      [status, req.params.certId, req.params.employeeId]
    );
    res.json({ message: '培训认证状态更新成功' });
  } catch (error) {
    console.error('Error in PUT /employees/:employeeId/training/:certId:', error);
    res.status(500).json({ message: '更新培训认证状态失败' });
  }
});

export const employeeRoutes = router; 