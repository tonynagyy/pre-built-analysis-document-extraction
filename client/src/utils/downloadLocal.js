export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadCSV(filename, data) {
  // Handle array of objects or single object
  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return;

  // Get all unique keys from all objects to handle any missing fields
  const allKeys = [...new Set(rows.flatMap((row) => Object.keys(row)))];

  // Create header row
  const headerRow = allKeys.join(",");

  // Create data rows
  const dataRows = rows.map((row) =>
    allKeys
      .map((key) => {
        const value = row[key];
        // Handle different data types and escape quotes
        if (value === null || value === undefined) return '""';
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(",")
  );

  // Combine header and data
  const csvContent = [headerRow, ...dataRows].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Utility function to flatten nested objects for CSV export
export function flattenObject(obj, prefix = "") {
  const flattened = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        obj[key] !== null &&
        typeof obj[key] === "object" &&
        !Array.isArray(obj[key])
      ) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        // Handle arrays by joining them or creating separate columns
        flattened[newKey] = obj[key].join("; ");
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}
