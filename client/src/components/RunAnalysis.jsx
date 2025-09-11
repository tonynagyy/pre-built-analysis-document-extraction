import { RefreshCw, Play } from "lucide-react";

export default function RunAnalysisButton({
  onAnalyze,
  isAnalyzing,
  disabled,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-600"></div>
        <span className="px-4 text-sm font-medium text-gray-300">
          3. Run Analysis
        </span>
        <div className="flex-1 border-t border-gray-600"></div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={disabled || isAnalyzing}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors font-medium"
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Run Analysis</span>
          </>
        )}
      </button>
    </div>
  );
}
