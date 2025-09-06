// app/page.tsx
import Image from "next/image";
import rehubLogo from "../public/rehub-logo.jpeg"; // <-- added: static import from /public

export default function Home() {
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
        <div className="space-x-6 mt-12">
          <label className="inline-block">
            <input type="file" className="hidden" />
            <span className="cursor-pointer px-6 py-3 rounded-xl bg-[#6B1E63] text-white font-medium hover:bg-[#57194F]">
              Upload File
            </span>
          </label>

          <button
            className="px-6 py-3 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-700"
          >
            Generate
          </button>
        </div>
      </main>
    </div>
  );
}
