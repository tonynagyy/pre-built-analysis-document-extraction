export default function ResultItem({
  field,
  value,
  confidence,
  pageNumber = 1,
  text,
}) {
  const getConfidenceColor = (conf) => {
    if (conf >= 0.9) return "bg-green-500";
    if (conf >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatConfidence = (conf) => {
    return `${Math.round(conf * 100)}%`;
  };

  return (
    <div className="hover:bg-gray-700">
      <div className="grid grid-cols-15 gap-2 p-3 text-xs">
        <div className="col-span-2 text-gray-400">{pageNumber}</div>
        <div className="col-span-6 text-white font-mono text-xs break-all">
          {field}
        </div>
        <div className="col-span-4 text-gray-300 break-all">
          {value || "N/A"}
        </div>
        {confidence > 0 && (
          <div className="col-span-3 flex items-center space-x-2">
            <div className="flex-1 bg-gray-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getConfidenceColor(confidence)}`}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="text-white font-medium">
              {formatConfidence(confidence)}
            </span>
          </div>
        )}
      </div>

      {text && (
        <div className="px-3 pb-3 text-sm text-gray-300 break-words bg-gray-750">
          <div className="text-xs text-gray-500 mb-1">Extracted Text:</div>
          <div className="font-mono text-[10px]">{text}</div>
        </div>
      )}
    </div>
  );
}
