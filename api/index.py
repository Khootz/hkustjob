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
            
            # Build URL same as working Job.py
            if page_num == 1:
                list_url = BASE_LIST_URL
            else:
                list_url = f"{BASE_LIST_URL}?page={page_num}&"
            
            try:
                response = session.get(
                    list_url, 
                    cookies=session_cookies, 
                    timeout=REQUEST_TIMEOUT
                )
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Use the same selector as working Job.py
                job_rows = soup.select("tr.job-item")
                
                page_jobs = 0
                
                for row in job_rows:
                    try:
                        # Use same extraction logic as Job.py
                        large_view_tds = row.select("td.detail-text.large-view")
                        if not large_view_tds:
                            continue
                            
                        first_large_view = large_view_tds[0]
                        job_post_link = first_large_view.select_one("a.job-post")
                        if not job_post_link:
                            continue
                            
                        detail_url = urljoin(BASE, job_post_link.get("href")) if job_post_link.has_attr("href") else ""

                        # Extract company
                        company = ""
                        company_font2 = first_large_view.select("table tr td font.font2")
                        if company_font2:
                            company = clean_text(company_font2[0].get_text(" ", strip=True))
                        
                        # Extract job title and nature
                        job_title = ""
                        job_nature = ""
                        
                        if len(large_view_tds) >= 2:
                            job_title_td = large_view_tds[1]
                            job_title_link = job_title_td.select_one("a.job-post")
                            if job_title_link:
                                font2_elements = job_title_link.select("font.font2")
                                if len(font2_elements) >= 1:
                                    job_title = clean_text(font2_elements[0].get_text(" ", strip=True))
                                if len(font2_elements) >= 2:
                                    job_nature = clean_text(font2_elements[1].get_text(" ", strip=True))
                        
                        # Extract dates
                        posting_date = ""
                        deadline = ""
                        if len(large_view_tds) >= 4:
                            posting_date = clean_text(large_view_tds[2].get_text(" ", strip=True))
                            deadline = clean_text(large_view_tds[3].get_text(" ", strip=True))

                        # Create job dictionary with same structure as Job.py
                        job_data = {
                            "job_title": job_title,
                            "company": company,
                            "job_nature": job_nature,
                            "posting_date": posting_date,
                            "deadline": deadline,
                            "link": detail_url,
                            "applied": False,
                            "letter": False,
                            "scraped_date": datetime.now().isoformat(),
                            "page": page_num
                        }
                        
                        if job_title and company:  # Only add if we have essential data
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

@app.route('/api/debug', methods=['POST'])
def debug_scraping():
    """Debug endpoint to test scraping without full processing"""
    try:
        data = request.get_json()
        php_session_id = data.get('phpSessionId', '')
        page = data.get('page', 1)
        
        if not php_session_id:
            return jsonify({
                "success": False,
                "message": "PHP Session ID is required"
            }), 400
        
        session_cookies = {"PHPSESSID": php_session_id}
        
        # Build URL same as working Job.py
        if page == 1:
            list_url = BASE_LIST_URL
        else:
            list_url = f"{BASE_LIST_URL}?page={page}&"
        
        session = requests.Session()
        session.headers.update(HEADERS)
        
        response = session.get(list_url, cookies=session_cookies, timeout=REQUEST_TIMEOUT)
        
        # Return debug info using same selectors as Job.py
        soup = BeautifulSoup(response.text, 'lxml')
        job_rows = soup.select("tr.job-item")  # Use same selector as Job.py
        
        # Try to extract first job details for debugging
        sample_job = None
        if job_rows:
            try:
                row = job_rows[0]
                large_view_tds = row.select("td.detail-text.large-view")
                if large_view_tds and len(large_view_tds) >= 2:
                    # Extract sample data
                    first_large_view = large_view_tds[0]
                    company_font2 = first_large_view.select("table tr td font.font2")
                    company = clean_text(company_font2[0].get_text(" ", strip=True)) if company_font2 else "N/A"
                    
                    job_title_td = large_view_tds[1]
                    job_title_link = job_title_td.select_one("a.job-post")
                    job_title = "N/A"
                    if job_title_link:
                        font2_elements = job_title_link.select("font.font2")
                        if font2_elements:
                            job_title = clean_text(font2_elements[0].get_text(" ", strip=True))
                    
                    sample_job = {
                        "company": company,
                        "job_title": job_title,
                        "has_large_view_tds": len(large_view_tds)
                    }
            except Exception as e:
                sample_job = {"error": str(e)}
        
        return jsonify({
            "success": True,
            "debug_info": {
                "url": list_url,
                "response_status": response.status_code,
                "response_length": len(response.text),
                "job_rows_found": len(job_rows),
                "sample_job": sample_job,
                "html_sample": response.text[:1000] + "..." if len(response.text) > 1000 else response.text,
                "session_id_used": php_session_id[:8] + "..." if len(php_session_id) > 8 else php_session_id
            }
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Debug failed: {str(e)}"
        }), 500

# For local development
if __name__ == '__main__':
    app.run(debug=True, port=5000)