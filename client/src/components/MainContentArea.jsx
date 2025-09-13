import React, { useState } from "react";
import { Upload, FileText, Image } from "lucide-react";
import ImageWithBoundingBoxes from "./ImageWithBoundingBoxes";

export default function MainContentArea({
  filePreview,
  onFileSelect,
  results,
  error,
  isAnalyzing,
  selectedFile,
  databaseError,
}) {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const isImageFile = (file) => {
    if (!file) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    let filename = typeof file === "string" ? file : file.name;
    if (!filename) return false;
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (file) => {
    if (!file) return false;
    let filename = typeof file === "string" ? file : file.name;
    if (!filename) return false;
    return filename.toLowerCase().endsWith(".pdf");
  };

  if (!filePreview) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div
          className="w-96 h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg transition-colors cursor-pointer"
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            Drop your document here
          </h3>
          <p className="text-gray-400 mb-4">or</p>
          <label className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
              onChange={handleFileInput}
            />
          </label>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Supports PDF, JPEG, PNG, GIF, BMP, and WebP files
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-white">
            Document Preview
          </span>
        </div>

        {results && isImageFile(selectedFile) && (
          <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showBoundingBoxes}
              onChange={(e) => setShowBoundingBoxes(e.target.checked)}
              className="rounded"
            />
            <span>Show bounding boxes</span>
          </label>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <div className="text-white text-sm">Analyzing document...</div>
            </div>
          </div>
        )}

        {showBoundingBoxes && results && isImageFile(selectedFile) ? (
          <ImageWithBoundingBoxes imageUrl={filePreview} results={results} />
        ) : isPdfFile(selectedFile) ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FileText className="w-16 h-16 mb-4" />
            <p className="text-lg mb-2">PDF Document</p>
            <p className="text-sm text-center">
              PDF preview not available in this view
            </p>
          </div>
        ) : isImageFile(selectedFile) ? (
          <div className="w-full h-full flex items-center justify-center p-4  rounded">
            <img
              src={filePreview}
              alt="Document preview"
              className="max-w-[900px] max-h-[700px] object-contain rounded-lg shadow-2xl border border-gray-700 bg-white"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Image className="w-16 h-16 mb-4" />
            <p className="text-lg mb-2">Document Preview</p>
            <p className="text-sm">Preview not available for this file type</p>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-900 border-t border-red-700 text-red-200 text-sm flex-shrink-0">
          Error: {error}
        </div>
      )}

      {databaseError && (
        <div className="px-4 py-2 bg-red-900 border-t border-red-700 text-red-200 text-sm flex-shrink-0">
          Error: {databaseError}
        </div>
      )}

      {results && !error && !isAnalyzing && (
        <div className="px-4 py-2 bg-green-900 border-t border-green-700 text-green-200 text-sm flex-shrink-0">
          ✓ Analysis completed successfully
        </div>
      )}
    </div>
  );
}
