@echo off
echo launching...

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo need Node.js
    exit /b 1
)

REM 检查 npm 是否安装
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo need npm
    exit /b 1
)

REM 检查 MySQL 是否安装
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo need mysql
    exit /b 1
)

echo fontned...
call npm install

echo backend...
cd server
call npm install

