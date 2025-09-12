import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";

export default function DownloadDropdown({ onDownloadJSON, onDownloadCSV }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownloadOption = (type) => {
    if (type === "json") {
      onDownloadJSON();
    } else if (type === "csv") {
      onDownloadCSV();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
      >
        <Download className="w-3 h-3" />
        <span>Download</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-fit bg-gray-700 border border-gray-600 rounded-xl shadow-lg z-10">
          <button
            onClick={() => handleDownloadOption("json")}
            className="w-full px-3 py-2 text-left text-xs text-white hover:bg-gray-600 rounded-t  justify-center flex"
          >
            JSON
          </button>
          <button
            onClick={() => handleDownloadOption("csv")}
            className="w-full px-3 py-2 text-left text-xs text-white hover:bg-gray-600 rounded-b justify-center  flex"
          >
            CSV
          </button>
        </div>
      )}
    </div>
  );
}
