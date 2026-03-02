#  PaperWise – AI Research Paper Assistant

PaperWise is a full-stack AI research assistant that helps users analyze research papers using a Retrieval-Augmented Generation (RAG) pipeline.

Users can upload academic PDFs and ask questions about the content. PaperWise retrieves relevant sections using vector similarity search and generates context-aware responses using AI.

---

##  Live Demo

Demo: https://paperwise-five.vercel.app/

---

##  Features

- Upload and analyze research papers in PDF format
- Context-aware AI responses using vector similarity search
- Retrieval-Augmented Generation (RAG) pipeline
- Credibility filtering to reduce non-academic sources
- Secure JWT authentication
- User-specific document ownership
- Automated backend tests with CI
- Production-ready deployment

---

##  Architecture

PaperWise uses a Retrieval-Augmented Generation (RAG) pipeline:

1. User uploads a research paper (PDF)
2. Text is extracted and split into chunks
3. Chunks are converted into OpenAI embeddings
4. Embeddings stored in PostgreSQL using pgvector
5. Relevant chunks retrieved via similarity search
6. OpenAI generates context-aware responses

This approach ensures responses are based on the uploaded document rather than general AI knowledge.

---

##  Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-20232A?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-20232A?style=flat&logo=tailwindcss)
![Shadcn](https://img.shields.io/badge/shadcn/ui-20232A?style=flat&logo=vercel)

---

### Backend

![Node.js](https://img.shields.io/badge/Node.js-20232A?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Express-20232A?style=flat&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-20232A?style=flat&logo=prisma)

---

### Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-20232A?style=flat&logo=postgresql)
![pgvector](https://img.shields.io/badge/pgvector-Vector_Search-20232A?style=flat&logo=postgresql)

---

### AI

![OpenAI](https://img.shields.io/badge/OpenAI-20232A?style=flat&logo=openai)
![Embeddings](https://img.shields.io/badge/Embeddings-Vector_Search-20232A?style=flat)
![RAG](https://img.shields.io/badge/RAG-Pipeline-20232A?style=flat)

---

### Testing

![Vitest](https://img.shields.io/badge/Vitest-20232A?style=flat&logo=vitest)
![Supertest](https://img.shields.io/badge/Supertest-API_Testing-20232A?style=flat)

---

### Deployment

![Vercel](https://img.shields.io/badge/Vercel-20232A?style=flat&logo=vercel)
![Railway](https://img.shields.io/badge/Railway-20232A?style=flat&logo=railway)
![Supabase](https://img.shields.io/badge/Supabase-20232A?style=flat&logo=supabase)

---

### Tools

![Git](https://img.shields.io/badge/Git-20232A?style=flat&logo=git)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-20232A?style=flat&logo=githubactions)

---

##  Screenshots

### Upload Research Paper

<img width="1900" height="916" alt="image" src="https://github.com/user-attachments/assets/62c43a3e-1c88-49ff-952d-ad237d1324c8" />

---

### Ask Questions

<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/6dc3b0fc-27a0-47f0-aa32-b71d1fc354da" />


---

### AI Responses

<img width="1919" height="917" alt="image" src="https://github.com/user-attachments/assets/deca859a-a3f5-4c8f-9a60-ff98cbd209d8" />


---

##  Local Setup

Clone the repository:

```bash
git clone https://github.com/yourusername/paperwise
cd paperwise
Install dependencies:
npm install

Create .env file:
DATABASE_URL=             
OPENAI_API_KEY=             
ACCESS_TOKEN=                  

Run the development server:
npm run dev
```
##  Testing

Run tests:
```
npm test
```

Includes automated API tests for:
Authentication
File upload
Ownership validation
Credibility filtering
Tests run automatically using GitHub Actions.

##  Environment Variables

Required variables:

DATABASE_URL=

OPENAI_API_KEY=

ACCESS_TOKEN=

##  Motivation

Research papers are often difficult to navigate and understand.
PaperWise helps students and researchers extract meaningful insights using AI-powered search and explanation.

---
