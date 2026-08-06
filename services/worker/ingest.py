import os
import requests
import psycopg2
from psycopg2.extras import execute_batch
from bs4 import BeautifulSoup

def fetch_hn_feed(limit=10):
    hn_url = "https://hacker-news.firebaseio.com/v0/topstories.json"
    ids = requests.get(hn_url).json()[:limit]

    stories = []
    for story_id in ids:
        item_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
        item = requests.get(item_url).json()
        if item and "url" in item:
            url = item.get("url")
            image_url = fetch_og_image(url)
            stories.append({
                "title": item.get("title"),
                "url": url,
                "source": "Hacker News",
                "score": item.get("score", 0),
                "image_url": image_url
            })
    return stories

def fetch_og_image(url):
    try:
        response = requests.get(url, timeout=3, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            return og_image["content"]
    except Exception as e:
        print(f"Image fetch error for {url}: {e}")
    return None

def save_to_db(stories):
    db_url = os.environ.get(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/knowledge_db"
    )
    try: 
        con = psycopg2.connect(db_url)
        cur = con.cursor()
        
        insert_querry = """
            INSERT INTO articles (title, url, source, score, content, image_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (url) DO UPDATE SET image_url = EXCLUDED.image_url, score = EXCLUDED.score;
        """
        data = [
            (story['title'], story['url'], story['source'], story['score'], None, story.get('image_url'))
            for story in stories
        ]
        
        execute_batch(cur, insert_querry, data)
        con.commit()
        print(f"Successfully processed {len(data)} stories into db")
    except Exception as e:
        print(f"DB error: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'con' in locals():
            con.close()

def fetch_cohere_embeddings(texts):
    api_key = os.environ.get("COHERE_API_KEY")
    if not api_key:
        raise ValueError("COHERE_API_KEY environment variable is missing")

    url = "https://api.cohere.com/v1/embed"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "texts": texts,
        "model": "embed-english-light-v3.0",
        "input_type": "search_document"
    }

    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()["embeddings"]
    else:
        raise Exception(f"Cohere API Error: {response.status_code} - {response.text}")

def generate_embeddings():
    db_url = os.environ.get(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/knowledge_db"
    )
    try:
        con = psycopg2.connect(db_url)
        cur = con.cursor()

        cur.execute("SELECT id, title FROM articles WHERE embedding IS NULL")
        rows = cur.fetchall()

        if not rows:
            print("No articles to embed")
            return
            
        print(f"Embedding {len(rows)} articles via Cohere")
        
        article_ids = [row[0] for row in rows]
        titles = [row[1] for row in rows]
        
        embeddings = fetch_cohere_embeddings(titles)

        update_query = """
            UPDATE articles 
            SET embedding = %s::vector
            WHERE id = %s;
        """
        update_data = [
            (embedding, article_id)
            for embedding, article_id in zip(embeddings, article_ids)
        ]

        execute_batch(cur, update_query, update_data)
        con.commit()
        print(f"Committed {len(rows)} embedded articles")
        
    except Exception as e:
        print(f"Embedding error: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'con' in locals():
            con.close()

if __name__ == "__main__":
    print("starting Worker", flush=True)
    results = fetch_hn_feed()
    print(f"fetched {len(results)} stories:")
    for story in results:
        print(f"-{story['title']}: {story['url']}")
    save_to_db(results)
    generate_embeddings()