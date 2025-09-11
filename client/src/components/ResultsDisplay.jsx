import React, { useState } from "react";
import ResultsHeader from "./ResultsHeader";
import TableHeader from "./TableHeader";
import ResultItem from "./ResultItem";
import {
  downloadJSON,
  downloadCSV,
  flattenObject,
} from "../utils/downloadLocal";
import { FileText } from "lucide-react";

export default function ResultsDisplay({
  results,
  isAnalyzing,
  error,
  onFieldClick,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const processResults = (analyzeResults) => {
    if (
      !analyzeResults ||
      !analyzeResults.documentResults ||
      analyzeResults.documentResults.length === 0
    ) {
      return [];
    }

    const document = analyzeResults.documentResults[0];
    const processedResults = [];

    if (document.fields) {
      Object.entries(document.fields.MachineReadableZone.valueObject).forEach(
        ([fieldName, fieldData]) => {
          processedResults.push({
            field: fieldName,
            value:
              fieldData.valueString ||
              fieldData.valueDate ||
              fieldData.valueCountryRegion ||
              fieldData.valuePhoneNumber ||
              fieldData.valueTime ||
              fieldData.valueInteger ||
              fieldData.valueNumber ||
              fieldData.content ||
              String(fieldData.value || ""),
            confidence: document.fields.MachineReadableZone.confidence || 0,
            type: fieldData.type || "text",
            boundingBox: fieldData.boundingBox || null,
            page: fieldData.page || 1,
          });
        }
      );
    }

    return processedResults.sort((a, b) => b.confidence - a.confidence);
  };

  const handleDownloadJSON = () => {
    const processedResults = processResults(results);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    downloadJSON(`analysis-results-${timestamp}.json`, {
      metadata: {
        analysisDate: new Date().toISOString(),
        totalFields: processedResults.length,
        documentType: results?.documentResults?.[0]?.docType || "unknown",
      },
      results: processedResults,
      rawResults: results,
    });
  };

  const handleDownloadCSV = () => {
    const processedResults = processResults(results);

    // Flatten any nested objects in the results for better CSV format
    const flattenedResults = processedResults.map((result) => {
      const flattened = flattenObject(result);
      return {
        ...flattened,
        // Ensure confidence is formatted as percentage for readability
        confidence_percentage: `${Math.round(result.confidence * 100)}%`,
      };
    });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    downloadCSV(`analysis-results-${timestamp}.csv`, flattenedResults);
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-4 text-sm font-medium text-gray-300">
            4. Results
          </span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-white text-sm">Analyzing document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-4 text-sm font-medium text-gray-300">
            4. Results
          </span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h3 className="text-red-100 font-medium mb-2">Analysis Error</h3>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const processedResults = processResults(results);

  if (processedResults.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-4 text-sm font-medium text-gray-300">
            4. Results
          </span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-300 text-sm">No results yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Run analysis to see results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <ResultsHeader
        onDownloadJSON={handleDownloadJSON}
        onDownloadCSV={handleDownloadCSV}
        resultCount={processedResults.length}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {isExpanded && (
        <>
          <TableHeader />
          <div className="max-h-96 overflow-y-auto">
            {processedResults.map((result, index) => (
              <div
                key={index}
                className="border-b border-gray-700 last:border-b-0 cursor-pointer"
                onClick={() => onFieldClick && onFieldClick(result)}
              >
                <ResultItem
                  field={result.field}
                  value={result.value}
                  confidence={result.confidence}
                  pageNumber={result.page}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
