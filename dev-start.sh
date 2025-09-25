#!/bin/bash

# Script to run both frontend and backend in development

echo "Starting HKUST Job Scraper Development Environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo "Shutting down..."
    jobs -p | xargs -r kill
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Install Python dependencies
echo "Installing Python dependencies..."
cd api
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment (platform specific)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

pip install -r requirements.txt

# Start Flask backend
echo "Starting Flask backend on port 5000..."
python app.py &
FLASK_PID=$!

cd ..

# Install Node.js dependencies and start Vite frontend
echo "Installing Node.js dependencies..."
npm install

echo "Starting Vite frontend on port 5173..."
npm run dev &
VITE_PID=$!

# Wait for background processes
echo "Development servers started!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:5000"
echo "Press Ctrl+C to stop both servers"

wait $FLASK_PID $VITE_PID