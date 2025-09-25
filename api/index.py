from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import re
import time
from urllib.parse import urljoin, urlparse, parse_qs
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import io
from datetime import datetime
import tempfile

app = Flask(__name__)
CORS(app)

# Configuration
SESSION_COOKIES = {"PHPSESSID": "3716823befe2fdb680e128fc013e9fc59b9d9958b9c1eadc73136eb9b9aea835"}
BASE_LIST_URL = "https://career.hkust.edu.hk/web/job.php"
BASE = "https://career.hkust.edu.hk/web/"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36"
    ),
    "Accept-Language": "en,zh;q=0.9",
}
REQUEST_TIMEOUT = 25
SLEEP_BETWEEN_REQUESTS = 1.0

def clean_text(text):
    """Clean and normalize text content"""
    if not text:
        return ""
    
    # Replace multiple whitespace with single space
    text = re.sub(r'\s+', ' ', text)
    
    # Clean up common HTML entities and characters
    text = text.replace('&nbsp;', ' ')
    text = text.replace('\xa0', ' ')  # Non-breaking space
    text = text.replace('\u00a0', ' ')  # Unicode non-breaking space
    
    return text.strip()

def parse_page_input(page_input):
    """Parse page input and return list of page numbers"""
    pages = []
    
    if not page_input or not page_input.strip():
        return []
    
    try:
        # Split by comma and process each part
        parts = page_input.split(',')
        
        for part in parts:
            part = part.strip()
            if not part:
                continue
                
            if '-' in part:
                # Handle range like "1-5"
                start, end = part.split('-', 1)
                start_page = int(start.strip())
                end_page = int(end.strip())
                
                if start_page <= end_page:
                    pages.extend(range(start_page, end_page + 1))
            else:
                # Handle single page
                pages.append(int(part))
        
        # Remove duplicates and sort
        pages = sorted(list(set(pages)))
        
        # Filter out invalid pages (less than 1)
        pages = [p for p in pages if p >= 1]
        
    except ValueError as e:
        raise ValueError(f"Invalid page input format. Use numbers, ranges (1-5), or comma-separated values.")
    
    return pages

def scrape_job_listings(session_cookies, pages=None):
    """Scrape job listings from HKUST career portal"""
    if pages is None:
        pages = [1, 2, 3, 4, 5]
    
    all_jobs = []
    
    session = requests.Session()
    session.headers.update(HEADERS)
    
    try:
        for page_num in pages:
            print(f"Scraping page {page_num}...")
            
            # Request the job listing page
            list_url = f"{BASE_LIST_URL}?type=student&job_type=&location=&page={page_num}"
            
            try:
                response = session.get(
                    list_url, 
                    cookies=session_cookies, 
                    timeout=REQUEST_TIMEOUT
                )
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find job rows
                job_rows = soup.find_all('tr', class_=lambda x: x and ('odd' in x or 'even' in x))
                
                page_jobs = 0
                
                for row in job_rows:
                    try:
                        # Extract job data from the row
                        cells = row.find_all('td')
                        
                        if len(cells) >= 6:  # Ensure we have enough cells
                            # Extract job title and link
                            title_cell = cells[1]  # Second column typically contains title
                            title_link = title_cell.find('a')
                            
                            if title_link:
                                job_title = clean_text(title_link.get_text())
                                job_link = title_link.get('href', '')
                                
                                # Make absolute URL
                                if job_link and not job_link.startswith('http'):
                                    job_link = urljoin(BASE, job_link)
                                
                                # Extract other fields
                                company = clean_text(cells[2].get_text()) if len(cells) > 2 else ""
                                location = clean_text(cells[3].get_text()) if len(cells) > 3 else ""
                                job_type = clean_text(cells[4].get_text()) if len(cells) > 4 else ""
                                deadline = clean_text(cells[5].get_text()) if len(cells) > 5 else ""
                                
                                # Create job dictionary
                                job_data = {
                                    "job_title": job_title,
                                    "company": company,
                                    "location": location,
                                    "job_type": job_type,
                                    "deadline": deadline,
                                    "link": job_link,
                                    "applied": False,
                                    "letter": False,
                                    "scraped_date": datetime.now().isoformat(),
                                    "page": page_num
                                }
                                
                                all_jobs.append(job_data)
                                page_jobs += 1
                    
                    except Exception as e:
                        print(f"Error processing job row: {str(e)}")
                        continue
                
                print(f"Found {page_jobs} jobs on page {page_num}")
                
                # Add delay between requests
                if page_num < max(pages):
                    time.sleep(SLEEP_BETWEEN_REQUESTS)
                
            except requests.RequestException as e:
                print(f"Error fetching page {page_num}: {str(e)}")
                continue
    
    except Exception as e:
        print(f"Error during scraping: {str(e)}")
        raise
    
    finally:
        session.close()
    
    print(f"Total jobs scraped: {len(all_jobs)}")
    return all_jobs

def create_excel_file(jobs_data):
    """Create Excel file from jobs data"""
    if not jobs_data:
        return None
    
    # Convert to DataFrame
    df = pd.DataFrame(jobs_data)
    
    # Reorder columns for better readability
    column_order = ['job_title', 'company', 'location', 'job_type', 'deadline', 'link', 'applied', 'letter', 'scraped_date', 'page']
    existing_columns = [col for col in column_order if col in df.columns]
    df = df[existing_columns]
    
    # Create Excel file in memory
    output = io.BytesIO()
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Jobs', index=False)
        
        # Auto-adjust column widths
        worksheet = writer.sheets['Jobs']
        for column in worksheet.columns:
            max_length = 0
            column = [cell for cell in column]
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)  # Cap at 50 characters
            worksheet.column_dimensions[column[0].column_letter].width = adjusted_width
    
    output.seek(0)
    return output

@app.route('/api/scrape', methods=['POST'])
def scrape_jobs():
    """API endpoint to scrape jobs"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "Request data is required"
            }), 400
        
        pages_input = data.get('pages', [])
        php_session_id = data.get('phpSessionId', '')
        
        if not php_session_id:
            return jsonify({
                "success": False,
                "message": "PHP Session ID is required"
            }), 400
        
        # Parse pages input
        if isinstance(pages_input, str):
            try:
                pages = parse_page_input(pages_input)
            except ValueError as e:
                return jsonify({
                    "success": False,
                    "message": str(e)
                }), 400
        elif isinstance(pages_input, list):
            pages = pages_input
        else:
            pages = [1, 2, 3, 4, 5]  # Default pages
        
        if not pages:
            return jsonify({
                "success": False,
                "message": "At least one page must be specified"
            }), 400
        
        # Update session cookies
        session_cookies = {"PHPSESSID": php_session_id}
        
        # Scrape jobs
        jobs = scrape_job_listings(session_cookies, pages)
        
        if not jobs:
            return jsonify({
                "success": False,
                "message": "No jobs found. Please check your session ID and try again."
            }), 404
        
        # Create Excel file
        excel_file = create_excel_file(jobs)
        excel_file_path = None
        
        if excel_file:
            # In a serverless environment, we'll return the file directly
            # Save to temp directory for potential download
            temp_dir = tempfile.gettempdir()
            excel_file_path = os.path.join(temp_dir, f"hkust_jobs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx")
            
            with open(excel_file_path, 'wb') as f:
                f.write(excel_file.getvalue())
        
        return jsonify({
            "success": True,
            "message": f"Successfully scraped {len(jobs)} jobs from {len(pages)} pages",
            "data": {
                "jobs": jobs,
                "total_jobs": len(jobs),
                "pages_scraped": pages,
                "excel_file_path": excel_file_path
            }
        })
    
    except Exception as e:
        print(f"Error in scrape_jobs: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }), 500

@app.route('/api/download/<path:filename>', methods=['GET'])
def download_excel(filename):
    """Download Excel file"""
    try:
        file_path = os.path.join(tempfile.gettempdir(), filename)
        
        if not os.path.exists(file_path):
            return jsonify({
                "success": False,
                "message": "File not found"
            }), 404
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Download failed: {str(e)}"
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# Export app for Vercel
app

# For local development
if __name__ == '__main__':
    app.run(debug=True, port=5000)