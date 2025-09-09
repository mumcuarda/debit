// app/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import rehubLogo from "../public/rehub-logo.jpeg";

const ENGINE_URL =
  process.env.NEXT_PUBLIC_ENGINE_URL || "https://your-railway-app.up.railway.app";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [refA, setRefA] = useState("");
  const [refB, setRefB] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const canGenerate = !!file && refA.trim().length > 0 && refB.trim().length > 0 && !loading;

  const handleGenerate = async () => {
    if (!canGenerate || !file) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const fd = new FormData();
      fd.append("slip", file);
      fd.append("ref_suffix_a", refA.trim());
      fd.append("ref_suffix_b", refB.trim());

      const res = await fetch(`${ENGINE_URL}/process`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to generate documents");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "debit_notes.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-[#6B1E63]">Debit Note Automation Tool</h1>
          <p className="text-gray-600">Created by Arda Mumcu for ReHub</p>
        </div>
        <div className="w-20 h-20 relative">
          <Image
            src={rehubLogo}
            alt="ReHub Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-2xl mt-12 px-6">
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
            {/* File upload */}
            <div className="flex items-center gap-4">
              <label className="inline-block">
                <input type="file" accept=".docx" className="hidden" onChange={onPickFile} />
                <span className="cursor-pointer px-6 py-3 rounded-xl bg-[#6B1E63] text-white font-medium hover:bg-[#57194F]">
                  Upload File
                </span>
              </label>
              <div className="text-sm text-gray-600 truncate">
                {file ? file.name : "No file selected"}
              </div>
            </div>

            {/* Reference inputs */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Reference Suffix A
                </label>
                <input
                  type="text"
                  value={refA}
                  onChange={(e) => setRefA(e.target.value)}
                  placeholder="e.g. 2025-001"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B1E63]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Will render as <span className="font-mono">DN-RHB-{refA || "..."}</span>
                </p>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Reference Suffix B
                </label>
                <input
                  type="text"
                  value={refB}
                  onChange={(e) => setRefB(e.target.value)}
                  placeholder="e.g. 2025-002"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B1E63]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Will render as <span className="font-mono">DN-RHB-{refB || "..."}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`px-6 py-3 rounded-xl text-white font-medium transition ${
                  canGenerate
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Generating..." : "Generate"}
              </button>

              {errorMsg && (
                <span className="text-sm text-red-600">{errorMsg}</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
