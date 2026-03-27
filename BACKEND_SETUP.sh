#!/bin/bash
# Backend Setup Script for Green Field Hub
# This script helps set up the backend environment

echo "🚀 Setting up Green Field Hub Backend..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to backend directory
echo "📁 Navigating to backend directory..."
cd backend || exit

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/tractorDB
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/tractorDB
MONGO_URI=mongodb://localhost:27017/tractorDB

# Server Port
PORT=5000

# Environment
NODE_ENV=development

# Email Configuration (for future use with Nodemailer)
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
EOF
    echo "✅ .env file created. Please update with your MongoDB URI"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the MONGO_URI in .env with your MongoDB connection string"
echo "2. Start the backend with: npm start"
echo "3. The server will run on http://localhost:5000"
echo ""
echo "📚 For more information, see BACKEND_INTEGRATION_GUIDE.md"
