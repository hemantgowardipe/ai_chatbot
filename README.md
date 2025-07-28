# Gemini AI Chatbot with Document Summarization

A full-stack AI chatbot web application using React (Vite) for the frontend and Flask for the backend. Users can chat or upload a document (PDF, DOCX, or image), and the app will summarize or answer questions based on the content.

## 🚀 Features

- Chat-based interface using Gemini API
- Attach documents (PDF, DOCX, image)
- Summarize uploaded files instantly (no storage)
- Responsive and modern UI
- Backend: Flask + Tesseract + Gemini API
- Frontend: React + Vite + Lucide Icons

## 📂 Project Structure






## 📦 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

### 2. Setup the Flask server
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env file and add your Gemini API Key
python app.py

### 3. Setup the React frontend
cd client
npm install
npm run dev
