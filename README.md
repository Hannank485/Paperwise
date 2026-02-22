# PaperWise 🔬

### AI-Powered STEM Research Paper Assistant

> Upload a research paper, ask questions, get answers grounded in the actual content.

---

## Status: In Progress

---

## What's Built

### Authentication

- JWT auth with HTTP-only cookies
- User registration and login
- Protected routes via middleware

### PDF Processing

- PDF upload and parsing via `pdf-parse`
- Text cleaning and normalization
- **Credibility scoring system** — filters non-academic documents before wasting API tokens
  - Abstract presence check (field-agnostic, works across all STEM disciplines)
  - Informal language penalty (capped at -1 to avoid over-penalizing valid papers)
  - Minimum length check (2000+ words)
  - Papers scoring below 3 are processed without embeddings, user is warned

### Chunking

- Text split into 500-word chunks
- Only credible papers get chunked and embedded (cost optimization)

### Embeddings

- OpenAI `text-embedding-3-small` (1536 dimensions)
- Each chunk embedded and stored with its text
- Non-credible papers stored as raw text only

### Database Schema

- User → Sessions → Documents → Chunks
- Single document per session (v1 scope)
- pgvector integration for vector similarity search

---

## What's Left

- [x] pgvector setup and migration
- [ ] Chunk + embedding storage queries (Prisma + raw SQL)
- [ ] Similarity search — embed user question, fetch top 3 relevant chunks via cosine distance
- [ ] Chat route — send chunks as context to OpenAI, stream response
- [ ] Session management routes
- [ ] Frontend (React + TypeScript)
- [ ] Tests (Vitest + Supertest)
- [ ] Deployment (Supabase for DB, pgvector pre-installed)

---

## Tech Stack

**Frontend** React, Typescript
**Backend:** Node.js, Express, TypeScript  
**Database:** PostgreSQL, Prisma ORM, pgvector  
**AI:** OpenAI API  
**Auth:** JWT, HTTP-only cookies  
**Testing:** Vitest

---

## Why This Exists

Most AI paper tools treat all PDFs equally.PaperWise reduces hallucinations and API costs by automatically filtering low-quality research papers and prioritizing structured scientific sources before embedding.

---

## Architecture Notes

- Sessions created only on file upload (not on page load) — avoids unnecessary DB writes
- Ownership verified before any embedding occurs — prevents token waste and DDOS surface
- Credibility check gates the expensive operations (chunking + embedding)
