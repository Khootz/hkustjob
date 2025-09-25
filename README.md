# HKUST Job Scraper

A full-stack web application for scraping and managing job listings from the HKUST career portal.

## Features

- 🔍 **Job Scraping**: Scrape job listings from HKUST career portal with customizable page ranges
- 📊 **Dashboard**: View and filter scraped jobs with an intuitive interface
- 📧 **Email Management**: Track application status and manage email queues
- 📋 **Excel Export**: Download scraped data as Excel files
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- ⚡ **Fast Backend**: Flask API for efficient web scraping

## Project info

**URL**: https://lovable.dev/projects/83352e4d-6be0-43c8-9e5e-988f01531d71

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons

### Backend
- **Flask** web framework
- **Beautiful Soup** for web scraping
- **Pandas** for data processing
- **Requests** for HTTP requests

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **Python** 3.8+
- **pip** (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up Python backend**
   ```bash
   cd api
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   cd ..
   ```

### Development

#### Option 1: Run both servers with one command (Windows)
```powershell
.\dev-start.ps1
```

#### Option 2: Run servers separately

**Terminal 1 - Backend (Flask)**
```bash
cd api
# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

python app.py
```

**Terminal 2 - Frontend (Vite)**
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Usage

1. **Get PHP Session ID**
   - Log into the HKUST career portal
   - Open browser developer tools (F12)
   - Go to Application/Storage → Cookies
   - Copy the `PHPSESSID` value

2. **Start Scraping**
   - Click "Start Scraping" button
   - Enter page numbers (e.g., `1` or `1-5`)
   - Paste your PHP Session ID
   - Click "Start Scraping"

3. **View Results**
   - Jobs will appear in the dashboard
   - Filter by status (New, Applied, etc.)
   - Download Excel file with scraped data

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/83352e4d-6be0-43c8-9e5e-988f01531d71) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
