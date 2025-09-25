# PowerShell script to run both frontend and backend in development

Write-Host "Starting HKUST Job Scraper Development Environment..." -ForegroundColor Green

# Check if Python is installed
try {
    python --version | Out-Null
} catch {
    Write-Host "Python is required but not installed. Please install Python 3." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    node --version | Out-Null
} catch {
    Write-Host "Node.js is required but not installed. Please install Node.js." -ForegroundColor Red
    exit 1
}

# Function to cleanup background processes
function Cleanup {
    Write-Host "Shutting down..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    exit 0
}

# Set trap to cleanup on script exit
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Blue
Set-Location api

if (!(Test-Path "venv")) {
    python -m venv venv
}

# Activate virtual environment
& "venv\Scripts\Activate.ps1"
pip install -r requirements.txt

# Start Flask backend
Write-Host "Starting Flask backend on port 5000..." -ForegroundColor Blue
$flaskJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\api
    & "venv\Scripts\Activate.ps1"
    python app.py
}

Set-Location ..

# Install Node.js dependencies and start Vite frontend
Write-Host "Installing Node.js dependencies..." -ForegroundColor Blue
npm install

Write-Host "Starting Vite frontend on port 5173..." -ForegroundColor Blue
$viteJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}

# Display status
Write-Host "Development servers started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow

# Wait for jobs and show output
try {
    while ($true) {
        Receive-Job $flaskJob -Keep
        Receive-Job $viteJob -Keep
        Start-Sleep 1
    }
} finally {
    Cleanup
}