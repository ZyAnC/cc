import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { employeeRoutes } from './routes/employee';
import { uploadRoutes } from './routes/upload';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// 添加日志
console.log('Server starting...');
console.log('Current directory:', __dirname);

app.use(cors());
app.use(express.json());

// 静态文件服务
const uploadsPath = path.resolve(__dirname, '../public/uploads');
console.log('Uploads directory:', uploadsPath);

// 确保上传目录存在
if (!fs.existsSync(uploadsPath)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// 添加调试中间件
app.use('/uploads', (req, res, next) => {
  const fullPath = path.join(uploadsPath, req.path);
  console.log('Requesting file:', req.path);
  console.log('Full path:', fullPath);
  console.log('File exists:', fs.existsSync(fullPath));
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log('File size:', stats.size);
  }
  next();
});

app.use('/uploads', express.static(uploadsPath));

// 路由
app.use('/api/employees', employeeRoutes);
app.use('/api/upload', uploadRoutes);

// 添加错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Static files served from: ${uploadsPath}`);
  
  // 列出上传目录中的文件
  if (fs.existsSync(uploadsPath)) {
    console.log('Files in uploads directory:');
    const files = fs.readdirSync(uploadsPath);
    files.forEach(file => {
      const stats = fs.statSync(path.join(uploadsPath, file));
      console.log(`- ${file} (${stats.size} bytes)`);
    });
  }
}); 