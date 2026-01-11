#!/usr/bin/env python3
"""
LK21 Movie Scraper
Scrapes movie information from lk21official.cc
"""

import requests
from bs4 import BeautifulSoup
import json
import csv
import time
import sys
import re
import os
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
from dotenv import load_dotenv
from supabase import create_client, Client
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock


class LK21Scraper:
    """Scraper for LK21 website"""
    
    def __init__(self, base_url: str = "https://tv6.lk21official.cc", delay: float = 1.0):
        """
        Initialize the scraper
        
        Args:
            base_url: Base URL of the LK21 website
            delay: Delay between requests in seconds (to be respectful to the server)
        """
        self.base_url = base_url
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        self.supabase: Optional[Client] = None
        self._session_lock = Lock()
        self._last_request_time = {}
        self._request_lock = Lock()
    
    def fetch_page(self, url: str, retries: int = 3, retry_delay: float = 2.0) -> Optional[BeautifulSoup]:
        """
        Fetch and parse a page (thread-safe with rate limiting and retry logic)
        
        Args:
            url: URL to fetch
            retries: Number of retry attempts (default: 3)
            retry_delay: Delay between retries in seconds (default: 2.0)
            
        Returns:
            BeautifulSoup object or None if request fails
        """
        last_exception = None
        
        for attempt in range(retries):
            # Thread-safe rate limiting
            with self._request_lock:
                # Check if we need to wait before making the request
                domain = urlparse(url).netloc
                if domain in self._last_request_time:
                    elapsed = time.time() - self._last_request_time[domain]
                    if elapsed < self.delay:
                        time.sleep(self.delay - elapsed)
                self._last_request_time[domain] = time.time()
            
            try:
                # Create a new session for each thread to avoid conflicts
                # The main session is shared, but requests.Session is thread-safe for reading
                with self._session_lock:
                    session = self.session
                response = session.get(url, timeout=30)
                response.raise_for_status()
                return BeautifulSoup(response.text, 'lxml')
            except requests.RequestException as e:
                last_exception = e
                if attempt < retries - 1:
                    wait_time = retry_delay * (attempt + 1)  # Exponential backoff
                    print(f"Error fetching {url} (attempt {attempt + 1}/{retries}): {e}. Retrying in {wait_time:.1f}s...")
                    time.sleep(wait_time)
                else:
                    print(f"Error fetching {url} after {retries} attempts: {e}")
        
        return None
    
    def parse_title_string(self, title_string: str) -> Dict:
        """
        Parse a concatenated title string into components
        Format: {rating}{year}{quality}{duration}{genres}{title}
        Example: "6.92025HD02:07RomanceAarpar" or "7.62024HD00:14Animation, ShortSimply Divine (Quelque chose de divin)"
        
        Args:
            title_string: The concatenated title string
            
        Returns:
            Dictionary with parsed components
        """
        result = {
            'rating': None,
            'year': None,
            'quality': None,
            'duration': None,
            'genre': None,
            'title': None
        }
        
        if not title_string:
            return result
        
        # Step 1: Extract rating (can be integer or decimal at the start)
        rating_match = re.match(r'^(\d+(?:\.\d+)?)', title_string)
        if not rating_match:
            # If no rating, use whole string as title
            result['title'] = title_string
            return result
        
        result['rating'] = rating_match.group(1)
        remaining = title_string[len(rating_match.group(1)):]
        
        # Step 2: Extract year (4 digits)
        year_match = re.match(r'^(\d{4})', remaining)
        if year_match:
            result['year'] = year_match.group(1)
            remaining = remaining[4:]
        else:
            # No year found, use rest as title
            result['title'] = remaining
            return result
        
        # Step 3: Extract quality (HD, CAM, SD, 4K, 1080p, 720p)
        quality_match = re.match(r'^(HD|CAM|SD|4K|1080p|720p)', remaining)
        if quality_match:
            result['quality'] = quality_match.group(1)
            remaining = remaining[len(quality_match.group(1)):]
        else:
            result['quality'] = 'HD'  # Default
        
        # Step 4: Extract duration (HH:MM format)
        duration_match = re.match(r'^(\d{2}:\d{2})', remaining)
        if duration_match:
            result['duration'] = duration_match.group(1)
            remaining = remaining[5:]  # "HH:MM" is 5 characters
        else:
            # No duration found, use rest as title
            result['title'] = remaining
            return result
        
        # Step 5: Separate genres from title
        # Genres are usually capitalized words, possibly comma-separated
        # Common genres list (sorted by length descending to match longer genres first)
        common_genres = [
            'Science Fiction', 'Animation', 'Documentary', 'Biography', 'Adventure',
            'Action', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'History',
            'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
            'War', 'Western', 'Short'
        ]
        
        # Try to match known genres at the start of remaining string
        # Genres can be: "Genre", "Genre, Genre", "Genre, Genre, Genre"
        # Title starts after genres (may have no space, e.g., "RomanceAarpar" or "Animation, ShortSimply Divine")
        
        best_match = None
        best_match_length = 0
        
        # Try matching genres from longest to shortest
        for genre in sorted(common_genres, key=len, reverse=True):
            # Try single genre
            if remaining.startswith(genre):
                # Check if there's more (could be comma-separated genres or title)
                after_genre = remaining[len(genre):]
                
                # If next is comma, there might be more genres
                if after_genre.startswith(','):
                    # Try to match more genres after comma
                    after_comma = after_genre[1:].lstrip()
                    for genre2 in common_genres:
                        if after_comma.startswith(genre2):
                            # Found two genres
                            combined_genre = genre + ', ' + genre2
                            title_part = after_comma[len(genre2):]
                            if len(combined_genre) > best_match_length:
                                best_match = (combined_genre, title_part)
                                best_match_length = len(combined_genre)
                            break
                    else:
                        # No second genre, first genre ends here
                        title_part = after_comma
                        if len(genre) > best_match_length:
                            best_match = (genre, title_part)
                            best_match_length = len(genre)
                else:
                    # No comma, genre ends and title starts
                    title_part = after_genre
                    if len(genre) > best_match_length:
                        best_match = (genre, title_part)
                        best_match_length = len(genre)
        
        if best_match:
            result['genre'] = best_match[0]
            result['title'] = best_match[1].strip()
        else:
            # Fallback: try to find where title likely starts
            # Look for pattern where we transition from all-caps/single-word to multi-word with spaces
            # Title often has spaces, so look for first space
            if ' ' in remaining:
                # Find first space - likely where title starts
                first_space = remaining.index(' ')
                potential_genre = remaining[:first_space]
                potential_title = remaining[first_space:].strip()
                
                # Check if potential_genre contains known genres
                if any(g in potential_genre for g in common_genres):
                    result['genre'] = potential_genre
                    result['title'] = potential_title
                else:
                    # No known genre found, use everything as title
                    result['title'] = remaining.strip()
            else:
                # No space found - try to split at capital letter boundary
                # Look for pattern like "GenreTitle" where Title starts with capital
                for i in range(1, len(remaining)):
                    if remaining[i].isupper() and remaining[i-1].islower():
                        # Found transition point
                        potential_genre = remaining[:i]
                        potential_title = remaining[i:]
                        if any(g in potential_genre for g in common_genres):
                            result['genre'] = potential_genre
                            result['title'] = potential_title
                            break
                else:
                    # No clear split found, use everything as title
                    result['title'] = remaining.strip()
        
        return result
    
    def extract_movie_info(self, movie_element) -> Optional[Dict]:
        """
        Extract movie information from a movie element
        
        Args:
            movie_element: BeautifulSoup element containing movie info
            
        Returns:
            Dictionary with movie information or None
        """
        try:
            movie_data = {}
            
            # Try to find title and link
            title_link = movie_element.find('a', href=True)
            if title_link:
                raw_title = title_link.get_text(strip=True)
                href = title_link.get('href', '')
                movie_data['url'] = urljoin(self.base_url, href)
            else:
                # Try alternative selectors
                title_elem = movie_element.find(['h2', 'h3', 'h4', 'span', 'div'], class_=lambda x: x and ('title' in x.lower() or 'name' in x.lower()))
                if title_elem:
                    raw_title = title_elem.get_text(strip=True)
                else:
                    # Get all text content for additional info
                    text = movie_element.get_text(strip=True)
                    if text:
                        raw_title = text.split('\n')[0] if '\n' in text else text
                    else:
                        return None
            
            # Parse the title string to extract components
            parsed = self.parse_title_string(raw_title)
            
            # Use parsed data, but prefer separately extracted data if available
            movie_data['title'] = parsed['title'] or raw_title
            movie_data['rating'] = parsed['rating']
            movie_data['year'] = parsed['year']
            movie_data['quality'] = parsed['quality']
            movie_data['duration'] = parsed['duration']
            movie_data['genre'] = parsed['genre']
            
            # Try to find year separately (might be more accurate)
            year_elem = movie_element.find(string=lambda x: x and x.strip().isdigit() and len(x.strip()) == 4)
            if year_elem:
                movie_data['year'] = year_elem.strip()
            
            # Try to find rating separately
            rating_elem = movie_element.find(['span', 'div'], class_=lambda x: x and 'rating' in x.lower() if x else False)
            if rating_elem:
                movie_data['rating'] = rating_elem.get_text(strip=True)
            
            # Try to find genre separately
            genre_elem = movie_element.find(['span', 'div'], class_=lambda x: x and 'genre' in x.lower() if x else False)
            if genre_elem:
                movie_data['genre'] = genre_elem.get_text(strip=True)
            
            # Try to find image
            img_elem = movie_element.find('img')
            if img_elem and img_elem.get('src'):
                movie_data['image_url'] = urljoin(self.base_url, img_elem.get('src'))
            
            return movie_data if movie_data.get('title') else None
            
        except Exception as e:
            print(f"Error extracting movie info: {e}")
            return None
    
    def scrape_latest_movies(self, url: str = None) -> List[Dict]:
        """
        Scrape latest movies from the latest page
        
        Args:
            url: URL to scrape (defaults to /latest)
            
        Returns:
            List of movie dictionaries
        """
        if url is None:
            url = f"{self.base_url}/latest"
        
        soup = self.fetch_page(url)
        if not soup:
            return []
        
        movies = []
        
        # Common selectors for movie listings
        # Try multiple common patterns
        movie_selectors = [
            'article',
            'div.movie-item',
            'div.item',
            'div.post',
            'div.entry',
            'div[class*="movie"]',
            'div[class*="item"]',
            'div[class*="post"]',
            'li[class*="movie"]',
            'li[class*="item"]',
        ]
        
        movie_elements = []
        for selector in movie_selectors:
            elements = soup.select(selector)
            if elements:
                movie_elements = elements
                print(f"Found {len(elements)} movie elements using selector: {selector}")
                break
        
        # If no specific selector works, try to find all links that might be movies
        if not movie_elements:
            # Look for links that might be movie links
            all_links = soup.find_all('a', href=True)
            # Filter links that might be movie pages
            movie_links = [link.parent for link in all_links 
                          if any(keyword in link.get('href', '').lower() for keyword in ['movie', 'film', 'watch', 'detail'])]
            if movie_links:
                movie_elements = movie_links[:50]  # Limit to avoid too many false positives
                print(f"Found {len(movie_elements)} potential movie elements from links")
        
        # Extract movie information
        for element in movie_elements:
            movie_info = self.extract_movie_info(element)
            if movie_info:
                movies.append(movie_info)
        
        print(f"Extracted {len(movies)} movies")
        return movies
    
    def discover_page_urls(self, max_pages: int = None) -> List[str]:
        """
        Discover all page URLs to scrape
        
        Args:
            max_pages: Maximum number of pages to discover (None for all)
            
        Returns:
            List of page URLs
        """
        page_urls = []
        current_url = f"{self.base_url}/latest"
        page = 1
        
        print(f"\n=== Discovering page URLs ===")
        
        while True:
            if max_pages and page > max_pages:
                break
            
            page_urls.append(current_url)
            print(f"Found page {page}: {current_url}")
            
            # Try to find next page link
            soup = self.fetch_page(current_url)
            if not soup:
                print("Failed to fetch page. Stopping.")
                break
            
            next_url = None
            
            # Method 1: Look for "next" link (text or class)
            next_link = soup.find('a', string=lambda x: x and 'next' in x.lower() if x else False)
            if not next_link:
                next_link = soup.find('a', class_=lambda x: x and 'next' in x.lower() if x else False)
            if not next_link:
                # Try aria-label or title attributes
                next_link = soup.find('a', attrs={'aria-label': lambda x: x and 'next' in x.lower() if x else False})
            if not next_link:
                next_link = soup.find('a', attrs={'title': lambda x: x and 'next' in x.lower() if x else False})
            
            if next_link and next_link.get('href'):
                next_url = urljoin(self.base_url, next_link.get('href'))
            else:
                # Method 2: Look for pagination container and find next numbered page
                pagination_selectors = [
                    '.pagination',
                    '.page-numbers',
                    '.paging',
                    'nav[class*="page"]',
                    'div[class*="pagination"]',
                    'ul[class*="page"]',
                ]
                
                pagination = None
                for selector in pagination_selectors:
                    pagination = soup.select_one(selector)
                    if pagination:
                        break
                
                if pagination:
                    # Find all page links
                    page_links = pagination.find_all('a', href=True)
                    current_page_num = page
                    
                    # Also try to detect current page from URL or active page indicator
                    # Look for active/current page indicator
                    active_page = pagination.find(class_=lambda x: x and any(c in str(x).lower() for c in ['active', 'current', 'selected']) if x else False)
                    if active_page:
                        active_text = active_page.get_text(strip=True)
                        if active_text.isdigit():
                            current_page_num = int(active_text)
                    
                    # Try to find current page from URL
                    url_page_match = re.search(r'[/?]page[=/]?(\d+)', current_url, re.IGNORECASE)
                    if url_page_match:
                        current_page_num = int(url_page_match.group(1))
                    
                    print(f"  Debug: Current page number detected: {current_page_num}")
                    print(f"  Debug: Found {len(page_links)} pagination links")
                    
                    # Try to find the next numbered page
                    for link in page_links:
                        href = link.get('href', '')
                        link_text = link.get_text(strip=True)
                        
                        # Check if it's a number and equals current page + 1
                        if link_text.isdigit():
                            link_page_num = int(link_text)
                            if link_page_num == current_page_num + 1:
                                next_url = urljoin(self.base_url, href)
                                print(f"  Debug: Found next page link by number: {link_text} -> {next_url}")
                                break
                    
                    # If not found, try to find page number in URL pattern
                    if not next_url:
                        # Common patterns: /page/2, /page2, ?page=2, /latest/page/2
                        for link in page_links:
                            href = link.get('href', '')
                            # Look for page number in URL
                            page_match = re.search(r'[/?]page[=/]?(\d+)', href, re.IGNORECASE)
                            if page_match:
                                link_page_num = int(page_match.group(1))
                                if link_page_num == current_page_num + 1:
                                    next_url = urljoin(self.base_url, href)
                                    print(f"  Debug: Found next page link by URL pattern: {href} -> {next_url}")
                                    break
                
                # Method 3: Try to construct next page URL based on pattern
                if not next_url:
                    # Try common pagination patterns
                    patterns = [
                        (r'/latest$', '/latest/page/2'),
                        (r'/latest/page/(\d+)$', lambda m: f'/latest/page/{int(m.group(1)) + 1}'),
                        (r'/page/(\d+)$', lambda m: f'/page/{int(m.group(1)) + 1}'),
                        (r'\?page=(\d+)', lambda m: f'?page={int(m.group(1)) + 1}'),
                    ]
                    
                    for pattern, replacement in patterns:
                        match = re.search(pattern, current_url)
                        if match:
                            if callable(replacement):
                                next_path = replacement(match)
                            else:
                                next_path = replacement
                            
                            # Construct full URL
                            parsed = urlparse(current_url)
                            if next_path.startswith('?'):
                                # Query parameter
                                next_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}{next_path}"
                            else:
                                # Path
                                next_url = urljoin(self.base_url, next_path)
                            break
            
            if next_url:
                # Avoid duplicates and infinite loops
                if next_url in page_urls:
                    print(f"Reached duplicate page: {next_url}. Stopping.")
                    break
                print(f"  → Next page URL: {next_url}")
                current_url = next_url
                page += 1
            else:
                print("No next page found. Stopping.")
                # Debug: show what we tried
                print(f"  Debug: Current URL: {current_url}")
                print(f"  Debug: Tried to find next link but couldn't locate it.")
                break
        
        print(f"Discovered {len(page_urls)} pages to scrape")
        return page_urls
    
    def discover_movie_urls_from_pages(self, start_page: int = 1, num_pages: int = 5) -> List[str]:
        """
        Discover movie URLs from listing pages (no detail scraping, no upload)
        
        Args:
            start_page: Starting page number (1-based)
            num_pages: Number of pages to discover
            
        Returns:
            List of movie URLs
        """
        movie_urls = []
        current_url = f"{self.base_url}/latest"
        page = 1
        
        # Navigate to start_page if needed
        if start_page > 1:
            # Try to construct URL for start_page
            if start_page == 2:
                current_url = f"{self.base_url}/latest/page/2"
            else:
                current_url = f"{self.base_url}/latest/page/{start_page}"
            page = start_page
        
        print(f"\n=== Discovering movie URLs from pages {start_page} to {start_page + num_pages - 1} ===")
        
        pages_discovered = 0
        while pages_discovered < num_pages:
            print(f"Scraping listing page {page}...")
            soup = self.fetch_page(current_url)
            if not soup:
                print(f"Failed to fetch page {page}. Stopping.")
                break
            
            # Extract movie URLs from this page
            page_movies = self.scrape_latest_movies(current_url)
            for movie in page_movies:
                if movie.get('url'):
                    movie_urls.append(movie['url'])
            
            print(f"  Found {len(page_movies)} movies on page {page} (total URLs: {len(movie_urls)})")
            
            pages_discovered += 1
            if pages_discovered >= num_pages:
                break
            
            # Find next page
            next_url = None
            # Try to find next page link
            next_link = soup.find('a', string=lambda x: x and 'next' in x.lower() if x else False)
            if not next_link:
                next_link = soup.find('a', class_=lambda x: x and 'next' in x.lower() if x else False)
            
            if next_link and next_link.get('href'):
                next_url = urljoin(self.base_url, next_link.get('href'))
            else:
                # Try to construct next page URL
                if current_url.endswith('/latest'):
                    next_url = f"{self.base_url}/latest/page/2"
                else:
                    # Extract page number and increment
                    page_match = re.search(r'/page/(\d+)', current_url)
                    if page_match:
                        next_page_num = int(page_match.group(1)) + 1
                        next_url = f"{self.base_url}/latest/page/{next_page_num}"
                    else:
                        # Try pattern matching
                        patterns = [
                            (r'/latest$', '/latest/page/2'),
                            (r'/latest/page/(\d+)$', lambda m: f'/latest/page/{int(m.group(1)) + 1}'),
                        ]
                        for pattern, replacement in patterns:
                            match = re.search(pattern, current_url)
                            if match:
                                if callable(replacement):
                                    next_path = replacement(match)
                                else:
                                    next_path = replacement
                                next_url = urljoin(self.base_url, next_path)
                                break
            
            if next_url and next_url != current_url:
                current_url = next_url
                page += 1
            else:
                print("No next page found. Stopping.")
                break
        
        print(f"✓ Discovered {len(movie_urls)} movie URLs from {pages_discovered} pages")
        return movie_urls
    
    def scrape_with_batch_processing(self, max_pages: int = None, max_workers: int = 5,
                                     table_name: str = "movies", batch_size: int = 24,
                                     pages_per_batch: int = 5) -> List[Dict]:
        """
        Scrape movies using Option A: Fixed 5-page batches
        - Discover 5 pages → get URLs (no upload)
        - Process movies in batches of 24
        - Upload after each batch of 24
        - If max_pages > 5, discover next 5 pages and repeat
        
        Args:
            max_pages: Maximum number of pages to scrape (None for all)
            max_workers: Maximum number of concurrent workers for detail scraping
            table_name: Supabase table name
            batch_size: Number of movies to process before uploading (default: 24)
            pages_per_batch: Number of listing pages to discover at once (default: 5)
            
        Returns:
            List of all movie dictionaries
        """
        # Initialize Supabase
        if not self.supabase:
            if not self.init_supabase():
                print("⚠ Error: Supabase not initialized. Cannot upload movies.")
                return []
            self.create_table_if_not_exists(table_name)
        
        all_movies = []
        current_page = 1
        pages_processed = 0
        
        print(f"\n{'='*60}")
        print(f"Starting batch processing (pages_per_batch={pages_per_batch}, batch_size={batch_size})")
        print(f"{'='*60}\n")
        
        while True:
            # Check if we've reached max_pages
            if max_pages and pages_processed >= max_pages:
                print(f"\n✓ Reached max_pages limit ({max_pages})")
                break
            
            # Discover next batch of pages (5 pages at a time)
            pages_to_discover = pages_per_batch
            if max_pages:
                remaining_pages = max_pages - pages_processed
                pages_to_discover = min(pages_per_batch, remaining_pages)
            
            print(f"\n{'='*60}")
            print(f"Phase 1: Discovering pages {current_page} to {current_page + pages_to_discover - 1}")
            print(f"{'='*60}")
            
            movie_urls = self.discover_movie_urls_from_pages(
                start_page=current_page,
                num_pages=pages_to_discover
            )
            
            if not movie_urls:
                print("No more movie URLs found. Stopping.")
                break
            
            pages_processed += pages_to_discover
            current_page += pages_to_discover
            
            print(f"\n{'='*60}")
            print(f"Phase 2: Processing {len(movie_urls)} movies in batches of {batch_size}")
            print(f"{'='*60}\n")
            
            # Process movies in batches of 24
            for batch_start in range(0, len(movie_urls), batch_size):
                batch_urls = movie_urls[batch_start:batch_start + batch_size]
                batch_num = (batch_start // batch_size) + 1
                total_batches = (len(movie_urls) + batch_size - 1) // batch_size
                
                print(f"\n--- Processing batch {batch_num}/{total_batches} ({len(batch_urls)} movies) ---")
                
                # Create movie data structures from URLs
                batch_movies = [{'url': url} for url in batch_urls]
                
                # Scrape details for this batch concurrently
                batch_movies = self.scrape_movies_with_video_sources(
                    batch_movies,
                    max_workers=max_workers,
                    table_name=table_name,
                    upload_batch_size=0  # We'll upload manually after each batch
                )
                
                # Upload this batch to Supabase
                if batch_movies:
                    print(f"\n  Uploading batch {batch_num} ({len(batch_movies)} movies) to database...")
                    upload_success = self.upload_to_supabase(
                        batch_movies,
                        table_name=table_name,
                        batch_size=50
                    )
                    if upload_success:
                        print(f"  ✓ Successfully uploaded batch {batch_num}")
                    else:
                        print(f"  ⚠ Warning: Failed to upload batch {batch_num}")
                
                all_movies.extend(batch_movies)
                print(f"  Total movies processed so far: {len(all_movies)}")
            
            # Check if we should continue
            if max_pages and pages_processed >= max_pages:
                print(f"\n✓ Reached max_pages limit ({max_pages})")
                break
            
            # Check if there are more pages (if no max_pages limit)
            if max_pages is None:
                # Try to discover if there are more pages
                # This is a simple check - in practice, you might want to verify
                print(f"\nChecking if there are more pages...")
                # Continue to next iteration to discover more pages
        
        print(f"\n{'='*60}")
        print(f"✓ Batch processing complete!")
        print(f"  Total pages processed: {pages_processed}")
        print(f"  Total movies scraped: {len(all_movies)}")
        print(f"{'='*60}\n")
        
        return all_movies
    
    def scrape_all_pages(self, max_pages: int = None, max_workers: int = 5, 
                        table_name: str = "movies", upload_after_each_page: bool = True) -> List[Dict]:
        """
        Scrape all pages of movies using concurrent requests
        
        Args:
            max_pages: Maximum number of pages to scrape (None for all)
            max_workers: Maximum number of concurrent workers (default: 5)
            table_name: Supabase table name for incremental uploads
            upload_after_each_page: Whether to upload to database after each page (default: True)
            
        Returns:
            List of all movie dictionaries
        """
        # Initialize Supabase if uploading incrementally
        if upload_after_each_page:
            if not self.supabase:
                if not self.init_supabase():
                    print("⚠ Warning: Supabase not initialized. Incremental uploads disabled.")
                    upload_after_each_page = False
                else:
                    self.create_table_if_not_exists(table_name)
        
        # First discover all page URLs
        page_urls = self.discover_page_urls(max_pages)
        
        if not page_urls:
            return []
        
        # Scrape all pages concurrently
        print(f"\n=== Scraping {len(page_urls)} pages concurrently (using {max_workers} workers) ===")
        if upload_after_each_page:
            print("✓ Will upload to database after each page")
        
        all_movies = []
        page_results = {}
        
        def scrape_page(page_index: int, page_url: str) -> tuple:
            """Scrape a single page and return (index, movies)"""
            try:
                movies = self.scrape_latest_movies(page_url)
                return (page_index, movies, None)
            except Exception as e:
                print(f"  Error scraping page {page_index + 1} ({page_url}): {e}")
                return (page_index, [], str(e))
        
        # Use ThreadPoolExecutor for concurrent page scraping
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_index = {
                executor.submit(scrape_page, idx, url): idx 
                for idx, url in enumerate(page_urls)
            }
            
            # Process completed tasks
            completed = 0
            for future in as_completed(future_to_index):
                completed += 1
                try:
                    page_index, movies, error = future.result()
                    page_results[page_index] = movies
                    if error:
                        print(f"[{completed}/{len(page_urls)}] Error: {error}")
                    else:
                        print(f"[{completed}/{len(page_urls)}] Page {page_index + 1}: Found {len(movies)} movies")
                        
                        # Upload to database after each page
                        if upload_after_each_page and movies:
                            print(f"  Uploading {len(movies)} movies from page {page_index + 1} to database...")
                            upload_success = self.upload_to_supabase(movies, table_name=table_name, batch_size=50)
                            if upload_success:
                                print(f"  ✓ Successfully uploaded page {page_index + 1}")
                            else:
                                print(f"  ⚠ Warning: Failed to upload page {page_index + 1}")
                        
                except Exception as e:
                    page_index = future_to_index[future]
                    page_results[page_index] = []
                    print(f"[{completed}/{len(page_urls)}] Exception for page {page_index + 1}: {e}")
        
        # Combine results in order
        for idx in sorted(page_results.keys()):
            all_movies.extend(page_results[idx])
        
        print(f"\n✓ Total movies collected: {len(all_movies)}")
        return all_movies
    
    def save_to_json(self, movies: List[Dict], filename: str = "movies.json"):
        """Save movies to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(movies, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(movies)} movies to {filename}")
    
    def extract_movie_details_from_page(self, movie_url: str, retries: int = 3) -> Dict:
        """
        Extract detailed movie information from a movie detail page with retry logic
        
        Args:
            movie_url: URL of the movie detail page
            retries: Number of retry attempts (default: 3)
            
        Returns:
            Dictionary with movie details including title, genres, rating, etc.
        """
        soup = None
        for attempt in range(retries):
            soup = self.fetch_page(movie_url, retries=1)
            if soup:
                break
            if attempt < retries - 1:
                wait_time = 2.0 * (attempt + 1)
                print(f"  Retrying extraction for {movie_url} in {wait_time:.1f}s... (attempt {attempt + 2}/{retries})")
                time.sleep(wait_time)
        
        if not soup:
            print(f"  Failed to fetch page after {retries} attempts: {movie_url}")
            return {}
        
        return self.extract_movie_details_from_page_soup(soup, movie_url)
    
    def extract_movie_details_from_page_soup(self, soup: BeautifulSoup, movie_url: str = "") -> Dict:
        """
        Extract detailed movie information from a BeautifulSoup object
        
        Args:
            soup: BeautifulSoup object of the movie detail page
            movie_url: URL of the page (for logging/debugging)
            
        Returns:
            Dictionary with movie details including title, genres, rating, etc.
        """
        details = {}
        
        # Extract title from h1 in .movie-info
        # Format: "Nonton Love+War (2025) Sub Indo di LK21"
        # Actual title: "Love+War (2025)"
        movie_info = soup.select_one('.movie-info')
        if movie_info:
            h1 = movie_info.find('h1')
            if h1:
                full_title_text = h1.get_text(strip=True)
                # Extract title from format: "Nonton {title} Sub Indo di LK21"
                # Pattern: "Nonton " + title + " Sub Indo di LK21"
                # Try multiple patterns to handle variations
                title_match = re.match(r'^Nonton\s+(.+?)\s+Sub\s+Indo\s+di\s+LK21\s*$', full_title_text, re.IGNORECASE)
                if title_match:
                    details['title'] = title_match.group(1).strip()
                else:
                    # Fallback: remove "Nonton" at the start and "Sub Indo di LK21" at the end
                    title = full_title_text
                    # Remove "Nonton" from the beginning (case-insensitive)
                    title = re.sub(r'^Nonton\s+', '', title, flags=re.IGNORECASE)
                    # Remove "Sub Indo di LK21" from the end (case-insensitive)
                    title = re.sub(r'\s+Sub\s+Indo\s+di\s+LK21\s*$', '', title, flags=re.IGNORECASE)
                    details['title'] = title.strip()
        
        # Extract genres from .tag-list .tag elements
        tag_list = soup.select('.tag-list .tag')
        if tag_list:
            genres = []
            for tag in tag_list:
                genre_text = tag.get_text(strip=True)
                if genre_text:
                    genres.append(genre_text)
            if genres:
                details['genre'] = ', '.join(genres)
        
        # Extract info from .info-tag spans
        # Format: <div class="info-tag">
        #   <span>rating (always first)</span>
        #   <span>...</span> (4 or 5 spans total)
        #   Quality: 720p, 1080p, or 4K
        #   Duration: xh xm or xm format
        #   Maturity: 13+, R, Family, 17+, etc.
        # </div>
        # Try multiple selectors for info-tag
        info_tag = None
        info_tag_selectors = ['.info-tag', 'div.info-tag', '[class*="info-tag"]', 'div[class*="info"]']
        
        for selector in info_tag_selectors:
            info_tag = soup.select_one(selector)
            if info_tag:
                break
        
        if not info_tag:
            # Debug: log when info-tag is not found
            print(f"    Warning: Could not find .info-tag element on page")
        
        if info_tag:
            spans = info_tag.find_all('span')
            
            # First span is always rating
            if len(spans) >= 1:
                rating_span = spans[0]
                rating_text = rating_span.get_text(strip=True)
                # Extract numeric rating (e.g., "7.4" from "7.4" or from text with icon)
                rating_match = re.search(r'(\d+(?:\.\d+)?)', rating_text)
                if rating_match:
                    details['rating'] = rating_match.group(1)
            
            # Look through all spans (2nd to last) for quality, maturity, and duration
            quality_pattern = re.compile(r'^(720p|1080p|4k)$', re.IGNORECASE)
            maturity_pattern = re.compile(r'^(\d+\+|R|Family|PG|PG-13|NC-17|G)$', re.IGNORECASE)
            duration_pattern_xh_xm = re.compile(r'^(\d+)h\s*(\d+)m$', re.IGNORECASE)
            duration_pattern_xh = re.compile(r'^(\d+)h$', re.IGNORECASE)
            duration_pattern_xm = re.compile(r'^(\d+)m$', re.IGNORECASE)
            
            for i in range(1, len(spans)):
                span_text = spans[i].get_text(strip=True)
                
                # Check for quality (720p, 1080p, 4K)
                if not details.get('quality'):
                    if quality_pattern.match(span_text):
                        details['quality'] = span_text.upper().replace('4K', '4K')
                
                # Check for maturity (13+, R, Family, 17+, etc.)
                if not details.get('maturity'):
                    if maturity_pattern.match(span_text):
                        details['maturity'] = span_text
                
                # Check for duration (xh xm, xh, or xm format)
                if not details.get('duration'):
                    # Try "xh xm" format (e.g., "2h 13m")
                    xh_xm_match = duration_pattern_xh_xm.match(span_text)
                    if xh_xm_match:
                        hours = int(xh_xm_match.group(1))
                        minutes = int(xh_xm_match.group(2))
                        details['duration'] = f"{hours:02d}:{minutes:02d}"
                    else:
                        # Try "xh" format (e.g., "2h")
                        xh_match = duration_pattern_xh.match(span_text)
                        if xh_match:
                            hours = int(xh_match.group(1))
                            details['duration'] = f"{hours:02d}:00"
                        else:
                            # Try "xm" format (e.g., "14m")
                            xm_match = duration_pattern_xm.match(span_text)
                            if xm_match:
                                minutes = int(xm_match.group(1))
                                hours = minutes // 60
                                mins = minutes % 60
                                details['duration'] = f"{hours:02d}:{mins:02d}"
            
            # Fallback: Search page text for duration if not found in spans
            if not details.get('duration'):
                page_text = soup.get_text()
                # Try "xh xm" format first (e.g., "2h 13m")
                xh_xm_match = re.search(r'\b(\d+)h\s*(\d+)m\b', page_text, re.IGNORECASE)
                if xh_xm_match:
                    hours = int(xh_xm_match.group(1))
                    minutes = int(xh_xm_match.group(2))
                    details['duration'] = f"{hours:02d}:{minutes:02d}"
                else:
                    # Try "xh" format (e.g., "2h")
                    xh_match = re.search(r'\b(\d+)h\b', page_text, re.IGNORECASE)
                    if xh_match:
                        hours = int(xh_match.group(1))
                        details['duration'] = f"{hours:02d}:00"
                    else:
                        # Try "xm" format (e.g., "14m")
                        xm_match = re.search(r'\b(\d+)m\b', page_text, re.IGNORECASE)
                        if xm_match:
                            minutes = int(xm_match.group(1))
                            hours = minutes // 60
                            mins = minutes % 60
                            details['duration'] = f"{hours:02d}:{mins:02d}"
        
        return details
    
    def extract_video_sources(self, movie_url: str) -> Dict[str, Optional[str]]:
        """
        Extract specific video sources from a movie detail page
        Only extracts playeriframe.sbs and cloud.hownetwork.xyz links
        
        Args:
            movie_url: URL of the movie detail page
            
        Returns:
            Dictionary with 'link_1' (playeriframe.sbs) and 'link_2' (cloud.hownetwork.xyz)
        """
        soup = self.fetch_page(movie_url)
        if not soup:
            return {'link_1': None, 'link_2': None}
        
        link_1 = None  # playeriframe.sbs
        link_2 = None  # cloud.hownetwork.xyz
        
        video_sources = []
        
        # Method 1: Look for iframe sources (embedded players)
        iframes = soup.find_all('iframe')
        for iframe in iframes:
            src = iframe.get('src', '')
            if src:
                video_sources.append(src)
        
        # Method 2: Look for video tags
        video_tags = soup.find_all('video')
        for video in video_tags:
            src = video.get('src', '')
            if src:
                video_sources.append(src)
            # Also check source tags inside video
            sources = video.find_all('source')
            for source in sources:
                src = source.get('src', '')
                if src:
                    video_sources.append(src)
        
        # Method 3: Look for JavaScript variables that might contain video URLs
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string:
                # Look for common video URL patterns in JavaScript
                # MP4, M3U8, HLS, etc.
                patterns = [
                    r'["\'](https?://[^"\']*\.(?:mp4|m3u8|mkv|avi|mov|wmv|flv|webm)[^"\']*)["\']',
                    r'["\'](https?://[^"\']*video[^"\']*)["\']',
                    r'["\'](https?://[^"\']*stream[^"\']*)["\']',
                    r'["\'](https?://[^"\']*play[^"\']*)["\']',
                    r'source["\']?\s*[:=]\s*["\'](https?://[^"\']+)["\']',
                    r'url["\']?\s*[:=]\s*["\'](https?://[^"\']+)["\']',
                    r'file["\']?\s*[:=]\s*["\'](https?://[^"\']+)["\']',
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, script.string, re.IGNORECASE)
                    video_sources.extend(matches)
        
        # Method 4: Look for data attributes that might contain video URLs
        all_elements = soup.find_all()
        for elem in all_elements:
            if hasattr(elem, 'attrs') and isinstance(elem.attrs, dict):
                for attr, value in elem.attrs.items():
                    if attr.startswith('data-') and isinstance(value, str):
                        if any(ext in value.lower() for ext in ['.mp4', '.m3u8', '.mkv', 'video', 'stream']):
                            if value.startswith('http'):
                                video_sources.append(value)
        
        # Method 5: Look for links with video-related classes or text
        video_links = soup.find_all('a', href=True)
        for link in video_links:
            href = link.get('href', '')
            text = link.get_text(strip=True).lower()
            if any(keyword in text for keyword in ['watch', 'play', 'download', 'stream', 'video']):
                if href.startswith('http'):
                    video_sources.append(href)
        
        # Method 6: Look for embed or player containers with specific classes
        embed_selectors = [
            'div[class*="player"]',
            'div[class*="video"]',
            'div[class*="embed"]',
            'div[class*="stream"]',
            'div[id*="player"]',
            'div[id*="video"]',
        ]
        
        for selector in embed_selectors:
            containers = soup.select(selector)
            for container in containers:
                # Look for iframes, videos, or links inside
                iframes = container.find_all('iframe')
                videos = container.find_all('video')
                links = container.find_all('a', href=True)
                
                for iframe in iframes:
                    src = iframe.get('src', '')
                    if src:
                        video_sources.append(src)
                
                for video in videos:
                    src = video.get('src', '')
                    if src:
                        video_sources.append(src)
                
                for link in links:
                    href = link.get('href', '')
                    if href.startswith('http') and any(ext in href.lower() for ext in ['.mp4', '.m3u8', '.mkv']):
                        video_sources.append(href)
        
        # Filter for specific sources only
        for source in video_sources:
            # Clean up the URL
            source = source.strip().strip('"').strip("'")
            if source and source.startswith('http'):
                source_lower = source.lower()
                
                # Check for playeriframe.sbs (link_1)
                if 'playeriframe.sbs' in source_lower and link_1 is None:
                    link_1 = source
                
                # Check for cloud.hownetwork.xyz (link_2)
                if 'cloud.hownetwork.xyz' in source_lower and link_2 is None:
                    link_2 = source
                
                # Stop if we found both
                if link_1 and link_2:
                    break
        
        return {'link_1': link_1, 'link_2': link_2}
    
    def scrape_movie_with_video_source(self, movie_data: Dict) -> Dict:
        """
        Scrape video source and detailed info for a single movie
        
        Args:
            movie_data: Dictionary containing movie information with 'url' key
            
        Returns:
            Updated movie dictionary with 'link_1', 'link_2', and detailed info
        """
        if 'url' not in movie_data:
            return movie_data
        
        print(f"  Extracting details for: {movie_data.get('title', 'Unknown')}")
        
        # Extract detailed movie information from the page
        # First fetch the page once
        detail_soup = self.fetch_page(movie_data['url'], retries=3)
        if not detail_soup:
            print(f"    Failed to fetch detail page: {movie_data['url']}")
            return movie_data
        
        # Extract page details using the fetched soup
        page_details = self.extract_movie_details_from_page_soup(detail_soup, movie_data['url'])
        
        # Update movie data with page details (prefer page details over parsed title)
        if page_details.get('title'):
            movie_data['title'] = page_details['title']
            # Extract year from title if present (e.g., "Love+War (2025)" -> year: "2025")
            year_match = re.search(r'\((\d{4})\)', page_details['title'])
            if year_match:
                movie_data['year'] = year_match.group(1)
        
        if page_details.get('genre'):
            movie_data['genre'] = page_details['genre']
        
        # Update rating, quality, duration from info-tag
        if page_details.get('rating'):
            movie_data['rating'] = page_details['rating']
        
        if page_details.get('maturity'):
            movie_data['maturity'] = page_details['maturity']
        
        if page_details.get('quality'):
            movie_data['quality'] = page_details['quality']
        
        if page_details.get('duration'):
            movie_data['duration'] = page_details['duration']
        
        # Extract image URL from detail page if not already set
        if not movie_data.get('image_url'):
            # Try multiple selectors for movie poster/image
            img_selectors = [
                'img[class*="poster"]',
                'img[class*="cover"]',
                '.movie-info img',
                '.poster img',
                'img[src*="poster"]',
                'img[src*="cover"]',
                'img[src*="movie"]',
            ]
            for selector in img_selectors:
                img_elem = detail_soup.select_one(selector)
                if img_elem and img_elem.get('src'):
                    movie_data['image_url'] = urljoin(self.base_url, img_elem.get('src'))
                    break
            
            # If still not found, try to find any img in movie-info or main content
            if not movie_data.get('image_url'):
                movie_info = detail_soup.select_one('.movie-info')
                if movie_info:
                    img_elem = movie_info.find('img')
                    if img_elem and img_elem.get('src'):
                        movie_data['image_url'] = urljoin(self.base_url, img_elem.get('src'))
                else:
                    # Try to find any img on the page
                    img_elem = detail_soup.find('img', src=True)
                    if img_elem and img_elem.get('src'):
                        src = img_elem.get('src')
                        if src.startswith('http') or src.startswith('//'):
                            movie_data['image_url'] = src if src.startswith('http') else f"https:{src}"
                        else:
                            movie_data['image_url'] = urljoin(self.base_url, src)
        
        # Extract video sources
        video_links = self.extract_video_sources(movie_data['url'])
        
        # Add link_1 and link_2 to movie data
        movie_data['link_1'] = video_links.get('link_1')
        movie_data['link_2'] = video_links.get('link_2')
        
        found_count = sum(1 for v in video_links.values() if v is not None)
        if found_count > 0:
            print(f"    Found {found_count} video source(s):")
            if video_links.get('link_1'):
                print(f"      link_1 (playeriframe.sbs): {video_links['link_1']}")
            if video_links.get('link_2'):
                print(f"      link_2 (cloud.hownetwork.xyz): {video_links['link_2']}")
        else:
            print(f"    No video sources found")
        
        return movie_data
    
    def scrape_movies_with_video_sources(self, movies: List[Dict], max_workers: int = 5,
                                        table_name: str = "movies", upload_batch_size: int = 10) -> List[Dict]:
        """
        Scrape video sources for all movies using concurrent requests
        
        Args:
            movies: List of movie dictionaries
            max_workers: Maximum number of concurrent threads (default: 5)
            table_name: Supabase table name for incremental uploads
            upload_batch_size: Upload to database after every N movies (default: 10, 0 to disable)
            
        Returns:
            List of movies with video sources added
        """
        # Initialize Supabase if uploading incrementally
        if upload_batch_size > 0:
            if not self.supabase:
                if not self.init_supabase():
                    print("⚠ Warning: Supabase not initialized. Incremental uploads disabled.")
                    upload_batch_size = 0
                else:
                    self.create_table_if_not_exists(table_name)
        
        print(f"\n=== Scraping video sources for {len(movies)} movies (using {max_workers} workers) ===")
        if upload_batch_size > 0:
            print(f"✓ Will upload to database after every {upload_batch_size} movies")
        
        # Create a dictionary to maintain order
        movie_results = {}
        pending_upload = []
        
        def process_movie(movie_index: int, movie_data: Dict) -> tuple:
            """Process a single movie and return (index, result)"""
            try:
                updated_movie = self.scrape_movie_with_video_source(movie_data)
                return (movie_index, updated_movie, None)
            except Exception as e:
                print(f"  Error processing {movie_data.get('title', 'Unknown')}: {e}")
                return (movie_index, movie_data, str(e))
        
        # Use ThreadPoolExecutor for concurrent scraping
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks with their indices
            future_to_index = {
                executor.submit(process_movie, idx, movie): idx 
                for idx, movie in enumerate(movies)
            }
            
            # Process completed tasks
            completed = 0
            for future in as_completed(future_to_index):
                completed += 1
                try:
                    movie_index, updated_movie, error = future.result()
                    movie_results[movie_index] = updated_movie
                    if error:
                        print(f"[{completed}/{len(movies)}] Error: {error}")
                    else:
                        title = updated_movie.get('title', 'Unknown')
                        print(f"[{completed}/{len(movies)}] Completed: {title}")
                    
                    # Add to pending upload batch
                    if upload_batch_size > 0:
                        pending_upload.append(updated_movie)
                        
                        # Upload when batch size is reached
                        if len(pending_upload) >= upload_batch_size:
                            print(f"  Uploading batch of {len(pending_upload)} movies to database...")
                            upload_success = self.upload_to_supabase(pending_upload, table_name=table_name, batch_size=50)
                            if upload_success:
                                print(f"  ✓ Successfully uploaded batch")
                            else:
                                print(f"  ⚠ Warning: Failed to upload batch")
                            pending_upload = []
                            
                except Exception as e:
                    movie_index = future_to_index[future]
                    movie_results[movie_index] = movies[movie_index]
                    print(f"[{completed}/{len(movies)}] Exception for {movies[movie_index].get('title', 'Unknown')}: {e}")
        
        # Upload any remaining movies
        if upload_batch_size > 0 and pending_upload:
            print(f"  Uploading final batch of {len(pending_upload)} movies to database...")
            upload_success = self.upload_to_supabase(pending_upload, table_name=table_name, batch_size=50)
            if upload_success:
                print(f"  ✓ Successfully uploaded final batch")
            else:
                print(f"  ⚠ Warning: Failed to upload final batch")
        
        # Return movies in original order
        updated_movies = [movie_results[i] for i in sorted(movie_results.keys())]
        return updated_movies
    
    def save_to_csv(self, movies: List[Dict], filename: str = "movies.csv"):
        """Save movies to CSV file"""
        if not movies:
            print("No movies to save")
            return
        
        fieldnames = set()
        for movie in movies:
            fieldnames.update(movie.keys())
        
        # Remove old video_sources and video_source_count if they exist
        if 'video_sources' in fieldnames:
            fieldnames.remove('video_sources')
        if 'video_source_count' in fieldnames:
            fieldnames.remove('video_source_count')
        
        # Ensure link_1 and link_2 are included
        fieldnames.add('link_1')
        fieldnames.add('link_2')
        
        fieldnames = sorted(list(fieldnames))
        
        # Move link_1 and link_2 to the end
        if 'link_1' in fieldnames:
            fieldnames.remove('link_1')
        if 'link_2' in fieldnames:
            fieldnames.remove('link_2')
        fieldnames.extend(['link_1', 'link_2'])
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for movie in movies:
                row = movie.copy()
                # Remove old video_sources if it exists
                if 'video_sources' in row:
                    del row['video_sources']
                if 'video_source_count' in row:
                    del row['video_source_count']
                # Ensure link_1 and link_2 exist (set to None if missing)
                if 'link_1' not in row:
                    row['link_1'] = None
                if 'link_2' not in row:
                    row['link_2'] = None
                writer.writerow(row)
        print(f"Saved {len(movies)} movies to {filename}")
    
    def init_supabase(self) -> bool:
        """
        Initialize Supabase client using environment variables
        
        SECURITY NOTE:
        - This uses SERVICE_ROLE_KEY which has full database access
        - This key should NEVER be exposed in frontend code
        - Only use this key in backend/server-side scripts like this scraper
        - The frontend uses ANON_KEY which should only have read permissions
        
        Returns:
            True if successful, False otherwise
        """
        load_dotenv()
        
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables")
            print("Create a .env file with:")
            print("  SUPABASE_URL=your_supabase_url")
            print("  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key")
            return False
        
        try:
            self.supabase = create_client(supabase_url, supabase_key)
            print("✓ Connected to Supabase")
            return True
        except Exception as e:
            print(f"Error connecting to Supabase: {e}")
            return False
    
    def create_table_if_not_exists(self, table_name: str = "movies") -> bool:
        """
        Create movies table in Supabase if it doesn't exist
        Note: This requires SQL execution, which may need to be done manually in Supabase dashboard
        or via a migration. This function will attempt to create it via RPC if available.
        
        Args:
            table_name: Name of the table to create
            
        Returns:
            True if table exists or was created, False otherwise
        """
        if not self.supabase:
            return False
        
        # Try to check if table exists by attempting a query
        try:
            result = self.supabase.table(table_name).select("id").limit(1).execute()
            print(f"✓ Table '{table_name}' exists")
            return True
        except Exception as e:
            error_msg = str(e).lower()
            if 'does not exist' in error_msg or 'relation' in error_msg:
                print(f"✗ Table '{table_name}' does not exist. Please create it using the SQL above.")
                return False
            else:
                # Table might exist but be empty, which is fine
                print(f"✓ Table '{table_name}' accessible")
                return True
    
    def upload_to_supabase(self, movies: List[Dict], table_name: str = "movies", batch_size: int = 100) -> bool:
        """
        Upload movies to Supabase
        
        Args:
            movies: List of movie dictionaries
            table_name: Name of the Supabase table
            batch_size: Number of records to upload per batch
            
        Returns:
            True if successful, False otherwise
        """
        if not self.supabase:
            if not self.init_supabase():
                return False
        
        if not self.create_table_if_not_exists(table_name):
            return False
        
        if not movies:
            print("No movies to upload")
            return False
        
        # Prepare data for upload
        upload_data = []
        for movie in movies:
            # Prepare the row, handling None values
            row = {
                'title': movie.get('title'),
                'url': movie.get('url'),
                'year': movie.get('year'),
                'genre': movie.get('genre'),
                'rating': movie.get('rating'),
                'maturity': movie.get('maturity'),
                'quality': movie.get('quality'),
                'duration': movie.get('duration'),
                'image_url': movie.get('image_url'),
                'link_1': movie.get('link_1'),
                'link_2': movie.get('link_2'),
            }
            upload_data.append(row)
        
        # Upload in batches
        total = len(upload_data)
        uploaded = 0
        errors = 0
        
        print(f"\n=== Uploading {total} movies to Supabase ===")
        
        for i in range(0, total, batch_size):
            batch = upload_data[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (total + batch_size - 1) // batch_size
            
            try:
                # Use upsert to handle duplicates (based on title)
                # This will update existing records with the same title instead of creating duplicates
                result = self.supabase.table(table_name).upsert(
                    batch,
                    on_conflict='title'
                ).execute()
                
                batch_uploaded = len(batch)
                uploaded += batch_uploaded
                print(f"[{batch_num}/{total_batches}] Uploaded/Updated {batch_uploaded} movies ({uploaded}/{total})")
                
            except Exception as e:
                errors += len(batch)
                print(f"[{batch_num}/{total_batches}] Error uploading batch: {e}")
                # Try uploading one by one to identify problematic records
                for item in batch:
                    try:
                        # First check if movie with same title exists
                        existing = self.supabase.table(table_name).select("id, title").eq("title", item.get('title')).execute()
                        
                        if existing.data:
                            # Update existing record
                            self.supabase.table(table_name).update(item).eq("title", item.get('title')).execute()
                            print(f"  Updated: {item.get('title', 'Unknown')}")
                        else:
                            # Insert new record
                            self.supabase.table(table_name).insert(item).execute()
                            print(f"  Inserted: {item.get('title', 'Unknown')}")
                        
                        uploaded += 1
                        errors -= 1
                    except Exception as e2:
                        print(f"  Error uploading {item.get('title', 'Unknown')}: {e2}")
        
        print(f"\n✓ Upload complete: {uploaded} successful, {errors} errors")
        return errors == 0


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape movies from LK21 website')
    parser.add_argument('--url', type=str, default='https://tv6.lk21official.cc/latest',
                       help='URL to scrape (default: latest page)')
    parser.add_argument('--all-pages', action='store_true',
                       help='Scrape all pages')
    parser.add_argument('--max-pages', type=int, default=None,
                       help='Maximum number of pages to scrape')
    parser.add_argument('--output-json', type=str, default=None,
                       help='Output JSON filename (optional)')
    parser.add_argument('--output-csv', type=str, default=None,
                       help='Output CSV filename (optional)')
    parser.add_argument('--delay', type=float, default=1.0,
                       help='Delay between requests in seconds (default: 1.0)')
    parser.add_argument('--video-sources', action='store_true', default=True,
                       help='Also scrape video sources from each movie page (slower)')
    parser.add_argument('--supabase-table', type=str, default='movies',
                       help='Supabase table name (default: movies)')
    parser.add_argument('--no-supabase', action='store_true',
                       help='Skip Supabase upload (save to files instead)')
    parser.add_argument('--max-workers', type=int, default=5,
                       help='Maximum number of concurrent workers for page and video source scraping (default: 5)')
    
    args = parser.parse_args()
    
    scraper = LK21Scraper(delay=args.delay)
    
    if args.all_pages:
        # Use new batch processing method (Option A)
        # - Discover 5 pages → get URLs (no upload)
        # - Process movies in batches of 24
        # - Upload after each batch of 24
        # - If max_pages > 5, discover next 5 pages and repeat
        if args.no_supabase:
            print("⚠ Warning: --no-supabase is set, but batch processing requires Supabase for uploads.")
            print("  Batch processing will be disabled. Use regular --all-pages instead.")
            movies = scraper.scrape_all_pages(
                max_pages=args.max_pages,
                max_workers=args.max_workers,
                table_name=args.supabase_table,
                upload_after_each_page=False
            )
        else:
            movies = scraper.scrape_with_batch_processing(
                max_pages=args.max_pages,
                max_workers=args.max_workers,
                table_name=args.supabase_table,
                batch_size=24,  # Upload after every 24 movies
                pages_per_batch=5  # Discover 5 pages at a time
            )
    else:
        movies = scraper.scrape_latest_movies(args.url)
    
    if movies:
        # Scrape video sources if requested (only for single page scraping)
        if args.video_sources and not args.all_pages:
            # scrape_movies_with_video_sources now uploads incrementally by default
            movies = scraper.scrape_movies_with_video_sources(
                movies, 
                max_workers=args.max_workers,
                table_name=args.supabase_table,
                upload_batch_size=10 if not args.no_supabase else 0
            )
        
        # Final upload to Supabase (only if not already uploaded incrementally)
        # Only upload if we didn't use --all-pages (which already uploaded) and didn't use --video-sources (which already uploaded)
        if not args.no_supabase and not args.all_pages and not args.video_sources:
            success = scraper.upload_to_supabase(movies, table_name=args.supabase_table)
            if not success:
                print("\n⚠ Warning: Supabase upload had errors.")
                if not args.output_json and not args.output_csv:
                    print("Consider using --output-json or --output-csv to save data as backup.")
        
        # Save to files only if explicitly requested
        if args.output_json:
            scraper.save_to_json(movies, args.output_json)
        if args.output_csv:
            scraper.save_to_csv(movies, args.output_csv)
        
        print(f"\n✓ Successfully scraped {len(movies)} movies")
        if args.video_sources:
            total_link_1 = sum(1 for movie in movies if movie.get('link_1'))
            total_link_2 = sum(1 for movie in movies if movie.get('link_2'))
            print(f"✓ Found {total_link_1} link_1 (playeriframe.sbs) sources")
            print(f"✓ Found {total_link_2} link_2 (cloud.hownetwork.xyz) sources")
    else:
        print("\n✗ No movies found. The website structure might have changed.")
        print("You may need to inspect the HTML and update the selectors in scraper.py")


if __name__ == "__main__":
    main()

