# 📝 Intelligent Document Management System - RAG

## 📌 Overview
Intelligent Document Management System (IDMS) is a **Retrieval-Augmented Generation (RAG)**-based solution that enables **AI-powered document querying**. Users can upload **PDFs** and retrieve answers from them using **semantic search**.

## 🚀 Features
- 📂 **PDF Upload & Storage** – Secure document management.
- 🔍 **AI-Powered Q&A** – Uses **OpenAI embeddings** for intelligent query responses.
- 🔑 **JWT Authentication** – Role-based access control for security.
- 📊 **Scalable & Cloud-Based** – Utilizes **AWS S3 & Milvus** for storage & vector search.
- 🏗 **Tech Stack:** `Node.js`, `Hono.js`, `MongoDB`, `Cloudflare Workers`.

## ⚙️ Installation
```sh
git clone https://github.com/aman3255/Intelligent-Document-Management-System.git
cd Intelligent-Document-Management-System
npm install
```
Create a `.env` file:
```env
DATABASE_URL=your_mongodb_url
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
AWS_S3_BUCKET=your_s3_bucket_name
MILVUS_URL=your_milvus_url
```
Run the server:
```sh
npm run dev
```

## 📌 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/signup` | User registration |
| POST   | `/signin` | User authentication |
| POST   | `/upload` | Upload a PDF file |
| GET    | `/list` | Retrieve uploaded documents |
| POST   | `/ask` | Query the uploaded PDF |

## 🏗 Future Enhancements
- ✨ Multi-user document collaboration.
- 📌 OCR integration for scanned PDFs.
- 🚀 Improved AI response accuracy.

## 💡 Contributing
Contributions are welcome! Fork the repo and submit a PR.

## 📜 License
Licensed under **MIT**.

🚀 **Built with ❤️ by [Aman Prajapati](https://github.com/aman3255)**

