# 检查是否以管理员权限运行
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "请以管理员权限运行此脚本" -ForegroundColor Red
    exit
}

# 设置错误操作
$ErrorActionPreference = "Stop"

# 函数：检查命令是否存在
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# 函数：安装 Node.js
function Install-NodeJS {
    if (-not (Test-CommandExists node)) {
        Write-Host "正在安装 Node.js..." -ForegroundColor Yellow
        # 使用 winget 安装 Node.js
        winget install OpenJS.NodeJS
        # 刷新环境变量
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }
    else {
        $nodeVersion = node -v
        Write-Host "Node.js 已安装，版本: $nodeVersion" -ForegroundColor Green
    }
}

# 函数：安装全局依赖
function Install-GlobalDependencies {
    Write-Host "正在安装全局依赖..." -ForegroundColor Yellow
    
    # 安装 typescript
    if (-not (Test-CommandExists tsc)) {
        npm install -g typescript
    }
    else {
        Write-Host "TypeScript 已安装" -ForegroundColor Green
    }

    # 安装 vite
    if (-not (Test-CommandExists vite)) {
        npm install -g vite
    }
    else {
        Write-Host "Vite 已安装" -ForegroundColor Green
    }
}

# 函数：安装项目依赖
function Install-ProjectDependencies {
    Write-Host "正在安装项目依赖..." -ForegroundColor Yellow
    
    # 安装前端依赖
    Write-Host "安装前端依赖..." -ForegroundColor Yellow
    npm install

    # 安装后端依赖
    Write-Host "安装后端依赖..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

# 函数：检查并创建环境文件
function Setup-EnvironmentFiles {
    Write-Host "检查环境文件..." -ForegroundColor Yellow
    
    # 检查前端环境文件
    if (-not (Test-Path ".env")) {
        Write-Host "创建前端环境文件 .env" -ForegroundColor Yellow
        @"
VITE_API_URL=http://localhost:3000
"@ | Out-File -FilePath ".env" -Encoding UTF8
    }

    # 检查后端环境文件
    if (-not (Test-Path "server/.env")) {
        Write-Host "创建后端环境文件 server/.env" -ForegroundColor Yellow
        @"
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
"@ | Out-File -FilePath "server/.env" -Encoding UTF8
    }
}

# 主函数
function Main {
    Write-Host "开始配置环境..." -ForegroundColor Cyan

    # 检查并安装 Node.js
    Install-NodeJS

    # 安装全局依赖
    Install-GlobalDependencies

    # 安装项目依赖
    Install-ProjectDependencies

    # 设置环境文件
    Setup-EnvironmentFiles

    Write-Host "`n环境配置完成！" -ForegroundColor Green
    Write-Host "`n您可以通过以下命令启动项目：" -ForegroundColor Cyan
    Write-Host "前端开发服务器: npm run dev" -ForegroundColor Yellow
    Write-Host "后端服务器: cd server && npm run dev" -ForegroundColor Yellow
    
    Write-Host "`n注意：请确保修改 server/.env 中的数据库配置！" -ForegroundColor Red
}

# 运行主函数
try {
    Main
}
catch {
    Write-Host "`n错误：$($_.Exception.Message)" -ForegroundColor Red
    Write-Host "配置过程中出现错误，请检查以上错误信息。" -ForegroundColor Red
    exit 1
} 