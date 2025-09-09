# Debit Note Automation Tool

This tool generates two debit note documents from a single slip note file. It is designed for reinsurance brokers who need to produce both client and reinsurer debit notes quickly and consistently.

## Features
- Upload a slip note in DOCX format  
- Parse contract details such as insured, reinsured, premium, brokerage, payment terms, and addresses  
- Generate two outputs:
  - Template A: debit note for the client  
  - Template B: debit note for the reinsurer  
- Download both debit notes together as a ZIP file  

## Tech Stack
**Backend**
- FastAPI with Uvicorn  
- `docxtpl`, `python-docx`, `python-dateutil`  
- Deployed on Railway  

**Frontend**
- Next.js 14 with Tailwind CSS  
- Upload form and generate button  
- Deployed on Vercel  

## Project Structure
/app → Next.js frontend
/api → FastAPI backend
├── server.py → FastAPI entrypoint
├── main.py → parsing and rendering engine
├── templates → DOCX templates for variant A and B
└── requirements.txt
railway.toml → Railway build and start config

bash
Copy code

## Running Locally
Backend:
```bash
cd api
pip install -r requirements.txt
uvicorn api.server:app --reload
Frontend:

bash
Copy code
cd app
npm install
npm run dev
Usage
Start the backend and frontend

Open the frontend in your browser

Upload a slip note file

Enter reference suffixes for the two variants

Download the ZIP containing both debit notes