export default function TableHeader() {
  return (
    <div className="grid grid-cols-14 gap-3 py-3 bg-gray-750 border-b border-gray-700 text-xs font-medium text-gray-300">
      <div className="col-span-2">Page #</div>
      <div className="col-span-4">Field name</div>
      <div className="col-span-4">Value</div>
      <div className="col-span-4">Confidence</div>
    </div>
  );
}
