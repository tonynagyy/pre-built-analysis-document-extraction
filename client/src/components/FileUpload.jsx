import React, { useRef, useState } from "react";
import {
  Upload,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  FileText,
  Settings,
  Play,
  X,
  Image,
  File,
} from "lucide-react";

// File Upload Section Component
export default function FileUpload({
  selectedFile,
  onFileSelect,
  //pageRange,
  setPageRange,
}) {
  const [fileType, setFileType] = useState("Local file");
  const fileInputRef = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  // Handle click on the input field to open file browser
  const handleInputClick = () => {
    if (fileType === "Local file") {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-600"></div>
        <span className="px-4 text-sm font-medium text-gray-300">
          1. Choose file for analysis
        </span>
        <div className="flex-1 border-t border-gray-600"></div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-300 min-w-fit">Source:</label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option>Local file</option>
            <option>URL</option>
          </select>
        </div>

        {fileType === "Local file" && (
          <input
            type="text"
            placeholder="Browse for a file..."
            value={selectedFile?.name || ""}
            readOnly
            onClick={handleInputClick}
            className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 placeholder-gray-400 cursor-pointer hover:bg-gray-600 transition-colors"
          />
        )}

        {fileType === "URL" && (
          <input
            type="text"
            placeholder="Enter file URL..."
            className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 placeholder-gray-400"
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept="image/*,.pdf"
          className="hidden"
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="pageRange"
            className="w-4 h-4 rounded border border-gray-600"
            onChange={(e) => setPageRange(e.target.checked ? "1" : "")}
          />
          <label htmlFor="pageRange" className="text-sm text-gray-300">
            Page range
          </label>
        </div>
      </div>
    </div>
  );
}
