import { ChevronDown, ChevronUp } from "lucide-react";
import DownloadDropdown from "./DownloadDropdown";

export default function ResultsHeader({
  onDownloadJSON,
  onDownloadCSV,
  resultCount,
  isExpanded,
  setIsExpanded,
}) {
  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-750">
      <div className="flex items-center space-x-4 mx-2">
        <span className="text-sm font-medium text-white">
          Prediction results
        </span>
        <span className="text-xs text-gray-400">({resultCount} fields)</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 p-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
      <DownloadDropdown
        onDownloadJSON={onDownloadJSON}
        onDownloadCSV={onDownloadCSV}
      />
    </div>
  );
}
