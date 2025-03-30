#!/bin/bash

echo "开始配置环境..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "未检测到 npm，请先安装 npm"
    exit 1
fi

# 检查 MySQL 是否安装
if ! command -v mysql &> /dev/null; then
    echo "未检测到 MySQL，请先安装 MySQL"
    exit 1
fi

echo "安装前端依赖..."
npm install

echo "安装后端依赖..."
cd server
npm install

echo "创建 .env 文件..."
if [ ! -f ../.env ]; then
    cat > ../.env << EOL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
PORT=3001
EOL
    echo "已创建 .env 文件，请修改其中的配置"
fi

echo "初始化数据库..."
echo "请输入 MySQL root 密码："
read -s MYSQL_PWD

mysql -u root -p$MYSQL_PWD < src/database/schema.sql

echo "环境配置完成！"
echo "请按照 README.md 中的说明启动项目" 