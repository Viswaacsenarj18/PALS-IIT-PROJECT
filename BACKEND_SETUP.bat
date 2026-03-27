@echo off
REM Backend Setup Script for Green Field Hub (Windows)
REM This script helps set up the backend environment

echo.
echo ========================================
echo 🚜 Green Field Hub - Backend Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%

echo.
echo 📁 Navigating to backend directory...
cd backend

echo.
echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # MongoDB Connection String
        echo # For local MongoDB: mongodb://localhost:27017/tractorDB
        echo # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/tractorDB
        echo MONGO_URI=mongodb://localhost:27017/tractorDB
        echo.
        echo # Server Port
        echo PORT=5000
        echo.
        echo # Environment
        echo NODE_ENV=development
        echo.
        echo # Email Configuration (for future use with Nodemailer^)
        echo # EMAIL_USER=your-email@gmail.com
        echo # EMAIL_PASSWORD=your-app-password
        echo # SMTP_HOST=smtp.gmail.com
        echo # SMTP_PORT=587
    ) > .env
    echo ✅ .env file created. Please update with your MongoDB URI
) else (
    echo ℹ️  .env file already exists
)

echo.
echo ========================================
echo 🎉 Backend setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update the MONGO_URI in .env with your MongoDB connection string
echo 2. Start the backend with: npm start
echo 3. The server will run on http://localhost:5000
echo.
echo 📚 For more information, see BACKEND_INTEGRATION_GUIDE.md
echo.

pause
