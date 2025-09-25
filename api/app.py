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

def clean_text(s: str) -> str:
    if not s:
        return ""
    return re.sub(r"\s+", " ", s).replace("\xa0", " ").strip()

def build_url(page_num):
    """Build the URL for the specified page"""
    if page_num == 1:
        return BASE_LIST_URL
    else:
        return f"{BASE_LIST_URL}?page={page_num}&"

def safe_get(session: requests.Session, url: str):
    for attempt in range(3):
        try:
            r = session.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
            if r.status_code == 200:
                return r
            else:
                print(f"Warning: Got status code {r.status_code} for {url}")
        except requests.RequestException as e:
            print(f"Request failed (attempt {attempt + 1}): {e}")
            time.sleep(1.5)
    
    print(f"ERROR: Failed to fetch {url} after 3 attempts")
    return None

def parse_list_page(html: str):
    soup = BeautifulSoup(html, "lxml")
    rows = soup.select("tr.job-item")
    out = []

    for row in rows:
        large_view_tds = row.select("td.detail-text.large-view")
        if not large_view_tds:
            continue
            
        first_large_view = large_view_tds[0]
        job_post_link = first_large_view.select_one("a.job-post")
        if not job_post_link:
            continue
            
        detail_url = urljoin(BASE, job_post_link.get("href")) if job_post_link.has_attr("href") else ""

        company = ""
        company_font2 = first_large_view.select("table tr td font.font2")
        if company_font2:
            company = clean_text(company_font2[0].get_text(" ", strip=True))
        
        title = ""
        job_nature = ""
        
        if len(large_view_tds) >= 2:
            job_title_td = large_view_tds[1]
            job_title_link = job_title_td.select_one("a.job-post")
            if job_title_link:
                font2_elements = job_title_link.select("font.font2")
                if len(font2_elements) >= 1:
                    title = clean_text(font2_elements[0].get_text(" ", strip=True))
                if len(font2_elements) >= 2:
                    job_nature = clean_text(font2_elements[1].get_text(" ", strip=True))
        
        posting_date = ""
        deadline = ""
        if len(large_view_tds) >= 4:
            posting_date = clean_text(large_view_tds[2].get_text(" ", strip=True))
            deadline = clean_text(large_view_tds[3].get_text(" ", strip=True))

        jp = ""
        if detail_url:
            q = parse_qs(urlparse(detail_url).query)
            jp = (q.get("jp") or [""])[0]

        out.append({
            "company": company,
            "job_title": title,
            "job_nature": job_nature,
            "posting_date": posting_date,
            "application_deadline": deadline,
            "detail_url": detail_url,
            "job_id": jp,
        })
    return out

def parse_detail_page(html: str):
    soup = BeautifulSoup(html, "lxml")
    scope = soup.select_one(".content-container .career-content") or soup
    
    job_description = ""
    description_selectors = [
        ".career-content .detail-text",
        "table.second-detail tbody tr td",
        ".content-container p",
        ".job-description",
    ]
    
    all_text_parts = []
    for selector in description_selectors:
        elements = scope.select(selector)
        for elem in elements:
            text = clean_text(elem.get_text(" ", strip=True))
            if text: 
                all_text_parts.append(text)
    
    if all_text_parts:
        combined_text = " ".join(all_text_parts)
    else:
        combined_text = clean_text(scope.get_text(" ", strip=True))
    
    job_description = combined_text

    email = ""
    website = ""
    red_links = soup.select('a.red_link')
    
    for link in red_links:
        if not link.has_attr("href"):
            continue
            
        href = link["href"]
        
        if href.startswith("mailto:"):
            if not email:  
                email = href.split(":", 1)[-1].split("?", 1)[0].strip()
        elif href.startswith("https://"):
            if not website:  
                website = href.strip()

    return {
        "detail_text_all": job_description,
        "apply_email": email,
        "website": website,
    }

@app.route('/api/scrape', methods=['POST'])
def scrape_jobs():
    try:
        data = request.get_json()
        pages_to_scrape = data.get('pages', [1])
        php_session_id = data.get('phpSessionId', SESSION_COOKIES["PHPSESSID"])
        
        # Update session cookies with provided session ID
        session_cookies = {"PHPSESSID": php_session_id}
        
        session = requests.Session()
        session.cookies.update(session_cookies)
        
        all_jobs = []
        total_duplicates_skipped = 0
        
        # Progress tracking
        progress_data = {
            "total_pages": len(pages_to_scrape),
            "completed_pages": 0,
            "total_jobs_found": 0,
            "new_jobs": 0,
            "status": "in_progress"
        }
        
        for page_index, page_num in enumerate(pages_to_scrape, 1):
            try:
                list_url = build_url(page_num)
                print(f"Scraping page {page_num}: {list_url}")
                
                r = safe_get(session, list_url)
                if not r:
                    continue

                list_items = parse_list_page(r.text)
                print(f"Found {len(list_items)} items on page {page_num}")
                
                if len(list_items) == 0:
                    continue

                seen = set()
                page_jobs = []
                
                for i, item in enumerate(list_items, 1):
                    url = item.get("detail_url")
                    if not url or url in seen:
                        continue
                    seen.add(url)

                    time.sleep(SLEEP_BETWEEN_REQUESTS)
                    print(f"Fetching detail {i}/{len(list_items)}: {url}")
                    
                    dr = safe_get(session, url)
                    if not dr:
                        continue

                    detail = parse_detail_page(dr.text)
                    
                    job_data = {**item, **detail}
                    page_jobs.append(job_data)
                
                all_jobs.extend(page_jobs)
                progress_data["completed_pages"] = page_index
                progress_data["total_jobs_found"] = len(all_jobs)
                
                print(f"Page {page_num} complete: {len(page_jobs)} jobs processed")
                
            except Exception as e:
                print(f"Error processing page {page_num}: {str(e)}")
                continue
        
        # Convert to DataFrame and prepare for Excel
        if all_jobs:
            df = pd.DataFrame(all_jobs)
            
            # Rename columns to match frontend expectations
            df_renamed = df.rename(columns={
                'apply_email': 'email',
                'detail_text_all': 'details',
                'application_deadline': 'deadline'
            })
            
            # Add default values
            df_renamed['applied'] = False
            df_renamed['letter'] = False
            
            # Set "NO EMAIL" for rows with no email address
            no_email_mask = (df_renamed['email'].isna() | 
                            (df_renamed['email'] == '') | 
                            (df_renamed['email'].astype(str).str.strip() == ''))
            df_renamed.loc[no_email_mask, 'applied'] = 'NO EMAIL'
            
            final_df = df_renamed[['company', 'job_title', 'job_nature', 'email', 'website',
                                  'details', 'deadline', 'posting_date', 
                                  'applied', 'letter']].copy()
            
            # Create Excel file in memory
            excel_buffer = io.BytesIO()
            final_df.to_excel(excel_buffer, index=False, engine='openpyxl')
            excel_buffer.seek(0)
            
            # Save to temporary file for download
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
            temp_file.write(excel_buffer.getvalue())
            temp_file.close()
            
            # Convert DataFrame to JSON for API response
            jobs_json = final_df.to_dict('records')
            
            return jsonify({
                "success": True,
                "message": f"Successfully scraped {len(all_jobs)} jobs from {len(pages_to_scrape)} pages",
                "data": {
                    "jobs": jobs_json,
                    "summary": {
                        "total_pages_scraped": len(pages_to_scrape),
                        "pages": pages_to_scrape,
                        "total_jobs": len(all_jobs),
                        "duplicates_skipped": total_duplicates_skipped,
                        "excel_filename": f"hkust_jobs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                    },
                    "excel_file_path": temp_file.name
                }
            })
        else:
            return jsonify({
                "success": False,
                "message": "No jobs found",
                "data": {
                    "jobs": [],
                    "summary": {
                        "total_pages_scraped": len(pages_to_scrape),
                        "pages": pages_to_scrape,
                        "total_jobs": 0,
                        "duplicates_skipped": 0
                    }
                }
            })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error during scraping: {str(e)}",
            "data": None
        }), 500

@app.route('/api/download/<path:filename>')
def download_file(filename):
    """Download the generated Excel file"""
    try:
        return send_file(filename, as_attachment=True, download_name=os.path.basename(filename))
    except Exception as e:
        return jsonify({"error": f"File not found: {str(e)}"}), 404

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)