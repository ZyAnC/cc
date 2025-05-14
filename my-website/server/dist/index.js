"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const employee_1 = require("./routes/employee");
const upload_1 = require("./routes/upload");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 静态文件服务
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// 路由
app.use('/api/employees', employee_1.employeeRoutes);
app.use('/api/upload', upload_1.uploadRoutes);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
