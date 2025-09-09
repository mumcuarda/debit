from __future__ import annotations
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pathlib import Path
import io, os

from .main import parse_slip, build_contexts, render_docs, zip_outputs

app = FastAPI(title="Document Automation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMPLATE_A = Path(os.getenv("TEMPLATE_A_PATH", "templates/template_a.docx"))
TEMPLATE_B = Path(os.getenv("TEMPLATE_B_PATH", "templates/template_b.docx"))

@app.post("/process")
async def process(
    slip: UploadFile = File(...),
    reference_a_suffix: str = Form(...),   # user-entered
    reference_b_suffix: str = Form(...),   # user-entered
):
    if not slip.filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="Please upload a .docx slip note.")

    tmp = Path(f"./_tmp_{slip.filename}")
    tmp.write_bytes(await slip.read())

    try:
        parsed = parse_slip(tmp)
        ctx_a, ctx_b = build_contexts(parsed, reference_a_suffix, reference_b_suffix)

        a_bytes, b_bytes = render_docs(TEMPLATE_A, TEMPLATE_B, ctx_a, ctx_b)
        zip_bytes = zip_outputs(
            a_bytes, b_bytes,
            ctx_a["reference_a"],  # file names will include references
            ctx_b["reference_b"]
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    finally:
        try: tmp.unlink()
        except: pass

    return StreamingResponse(
        io.BytesIO(zip_bytes),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="debit_notes_{parsed["slip_no"]}.zip"'}
    )

# Run locally:
# uvicorn server:app --reload --port 8000
