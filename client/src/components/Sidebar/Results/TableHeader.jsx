export default function TableHeader() {
  return (
    <div className="grid grid-cols-15 gap-2 py-3 px-3 bg-gray-750 border-b border-gray-700 text-xs font-medium text-gray-300">
      <div className="col-span-2 flex items-center justify-center">Page #</div>
      <div className="col-span-6 flex items-center">Field name</div>
      <div className="col-span-4 flex items-center">Value</div>
      <div className="col-span-3 flex items-center justify-center">
        Confidence
      </div>
    </div>
  );
}
