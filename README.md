# AI-Powered Knowledge Feed & Semantic Search

A full-stack, containerized platform that autonomously ingests web content, generates machine learning embeddings, and serves personalized recommendations using raw vector mathematics. 

Designed with strict microservice boundaries to ensure data pipeline resilience, enterprise-grade security, and a highly polished editorial user interface.

## 🏗 System Architecture

The application is orchestrated via Docker Compose and split into three isolated domains:

1. **The Ingestion Pipeline (Python / Cohere API):** An autonomous background worker that fetches real-time data from Hacker News, scrapes Open Graph meta-images via BeautifulSoup, and generates 384-dimensional semantic embeddings using the Cohere API.
2. **The Vector Database (PostgreSQL / pgvector):** Stores article metadata and vector embeddings natively. Bypasses traditional ORMs to execute highly optimized raw SQL using pgvector's `<=>` (Cosine Distance) operators for nearest-neighbor semantic search.
3. **The API & Frontend (NestJS / React / Vite):** A strictly-typed TypeScript backend serving a responsive, editorial-style React frontend. 

## ✨ Key Technical Achievements

* **Raw SQL Vector Math:** Eliminated ORM overhead by writing bare-metal `pg` connection pools in NestJS, utilizing pgvector to rank similarity mathematically rather than relying on basic keyword matching.
* **Secure Authentication:** Built a custom, stateless authentication module utilizing `bcrypt` password hashing and strict HTTP-only cookies, fully protecting session data from cross-site scripting (XSS) attacks.
* **Strict Type Boundaries:** Enforced end-to-end type safety using TypeScript, `class-validator`, and custom DTOs at the network boundary.
* **Idempotent Data Ingestion:** Designed the Python worker to handle network timeouts gracefully and utilize `ON CONFLICT DO NOTHING` SQL constraints, ensuring flawless background cron executions without database duplication.
* **Editorial UI Design:** Implemented a custom vanilla CSS design system inspired by premium publications, featuring graceful fallbacks for missing Open Graph images and seamless cross-container CORS handling.

## 🚀 Local Deployment

The entire microservice ecosystem is containerized for instant local deployment.

### Prerequisites
* Docker and Docker Compose
* A free [Cohere API](https://cohere.com/) key for text embeddings

### Setup Steps
1. Clone the repository and navigate to the project root.
2. Create a `.env` file in the root directory:
   ```env
   COHERE_API_KEY=your_api_key_here
   DATABASE_URL=postgresql://user:password@feed_postgres:5432/knowledge_db
   ```
3. Run `docker compose up --build` to start the application.
4. Access the beautiful editorial frontend at `http://localhost:5173`.
