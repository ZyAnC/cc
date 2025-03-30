import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { employeeRoutes } from './routes/employee';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 路由
app.use('/api/employees', employeeRoutes);

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
}); 