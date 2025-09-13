import { FileText } from "lucide-react";
import FileUpload from "./FileUpload";
import Configuration from "./Configuration";
import RunAnalysis from "./RunAnalysis";
import ResultsDisplay from "./ResultsDisplay";

export default function RightSidebar({
  selectedFile,
  onFileSelect,
  pageRange,
  setPageRange,
  endpoint,
  setEndpoint,
  apiKey,
  setApiKey,
  showApiKey,
  setShowApiKey,
  formType,
  setFormType,
  onAnalyze,
  isAnalyzing,
  results,
  error,
  databaseError,
  setCtxThickness,
}) {
  const canAnalyze = selectedFile && apiKey && endpoint;

  return (
    <div className="w-100 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-white">
            Analyze {formType.charAt(0).toUpperCase() + formType.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-6">
          <FileUpload
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            pageRange={pageRange}
            setPageRange={setPageRange}
          />

          <Configuration
            endpoint={endpoint}
            setEndpoint={setEndpoint}
            apiKey={apiKey}
            setApiKey={setApiKey}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            formType={formType}
            setFormType={setFormType}
          />

          <RunAnalysis
            onAnalyze={onAnalyze}
            isAnalyzing={isAnalyzing}
            disabled={!canAnalyze}
          />

          <ResultsDisplay
            results={results}
            isAnalyzing={isAnalyzing}
            error={error}
            databaseError={databaseError}
            setCtxThickness={setCtxThickness}
          />
        </div>
      </div>
    </div>
  );
}
