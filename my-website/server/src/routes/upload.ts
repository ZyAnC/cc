import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const uploadRoutes = express.Router();

// 确保上传目录存在
const uploadDir = path.resolve(__dirname, '../../public/uploads');
console.log('Upload directory:', uploadDir); // 添加日志以检查路径

if (!fs.existsSync(uploadDir)) {
  console.log('Creating upload directory...'); // 添加日志
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to:', uploadDir); // 添加日志
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename); // 添加日志
    cb(null, filename);
  }
});

// 文件过滤器
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('Received file:', file.originalname, 'type:', file.mimetype); // 添加日志
  // 只接受图片文件
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 限制 2MB
  }
});

// 处理单个文件上传
uploadRoutes.post('/', upload.single('file'), (req, res) => {
  try {
    console.log('Received upload request'); // 添加日志
    if (!req.file) {
      console.log('No file in request'); // 添加日志
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file); // 添加日志
    // 返回文件路径
    const filePath = `/uploads/${req.file.filename}`;
    console.log('Returning file path:', filePath); // 添加日志
    res.json({ path: filePath });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
}); 