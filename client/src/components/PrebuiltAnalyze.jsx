import React, { useState } from "react";
import RightSidebar from "./Sidebar/RightSidebar";
import MainContentArea from "./MainContentArea";
import Header from "./Header";

const FORM_TYPES = {
  invoice: "invoice",
  receipt: "receipt",
  businessCard: "businessCard",
  id: "idDocument",
};

export default function PrebuiltAnalyze() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [pageRange, setPageRange] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [formType, setFormType] = useState("invoice");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [databaseError, setDatabaseError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    setError(null);
    setResults(null);
    setPageRange("");
  };

  const handleAnalysis = async () => {
    if (!selectedFile || !apiKey || !endpoint) {
      setError("Please select a file and provide API key and endpoint");
      return;
    }

    setIsAnalyzing(true);
    setDatabaseError(null);
    setError(null);
    setResults(null);

    try {
      // Clean up endpoint URL
      const cleanEndpoint = endpoint.replace(/\/$/, "");

      const apiUrl = `${cleanEndpoint}/formrecognizer/v2.1/prebuilt/${FORM_TYPES[formType]}/analyze?includeTextDetails=true`;

      // Convert file to base64 for JSON payload (alternative approach)
      const formData = new FormData();
      formData.append("file", selectedFile);

      const analyzeResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/octet-stream",
        },
        body: selectedFile,
      });

      if (!analyzeResponse.ok) {
        throw new Error(
          `Analysis failed: ${analyzeResponse.status} ${analyzeResponse.statusText}`
        );
      }

      const operationLocation =
        analyzeResponse.headers.get("Operation-Location");

      if (!operationLocation) {
        throw new Error("No operation location returned from the API");
      }

      // Poll for results
      let analysisComplete = false;
      let pollCount = 0;
      const maxPolls = 30; // Maximum 30 polls (30 seconds with 1-second intervals)

      while (!analysisComplete && pollCount < maxPolls) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

        const resultResponse = await fetch(operationLocation, {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
          },
        });

        if (!resultResponse.ok) {
          throw new Error(
            `Failed to get results: ${resultResponse.status} ${resultResponse.statusText}`
          );
        }

        const resultData = await resultResponse.json();

        if (resultData.status === "succeeded") {
          analysisComplete = true;
          setResults(resultData.analyzeResult);

          // saving the passport data to the backend
          if (formType === "id" && resultData.analyzeResult.documentResults) {
            const doc = resultData.analyzeResult.documentResults[0];
            if (doc.docType === "prebuilt:idDocument:passport") {
              const passportData = {
                machine_readable_zone:
                  doc.fields.MachineReadableZone?.text || null,
                country_region:
                  doc.fields.MachineReadableZone.valueObject.CountryRegion
                    ?.valueCountryRegion || null,
                date_of_birth:
                  doc.fields.MachineReadableZone.valueObject.DateOfBirth
                    ?.valueDate || null,
                date_of_expiration:
                  doc.fields.MachineReadableZone.valueObject.DateOfExpiration
                    ?.valueDate || null,
                document_number:
                  doc.fields.MachineReadableZone.valueObject.DocumentNumber
                    ?.valueString || null,
                first_name:
                  doc.fields.MachineReadableZone.valueObject.FirstName
                    ?.valueString || null,
                last_name:
                  doc.fields.MachineReadableZone.valueObject.LastName
                    ?.valueString || null
                    ? doc.fields.MachineReadableZone.valueObject.LastName
                        ?.valueString
                    : doc.fields.MachineReadableZone.valueObject.Surname
                        ?.valueString || null,
                nationality:
                  doc.fields.MachineReadableZone.valueObject.Nationality
                    ?.valueCountryRegion || null,
                sex:
                  doc.fields.MachineReadableZone.valueObject.Sex.valueString ||
                  null,
              };

              try {
                const saveResponse = await fetch(
                  "http://localhost:5000/api/documents/passport",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(passportData),
                  }
                );
                if (!saveResponse.ok) {
                  throw new Error(
                    `Failed to save passport: ${saveResponse.status} ${saveResponse.statusText}`
                  );
                }
              } catch (saveError) {
                console.error("Error saving passport:", saveError);
                setDatabaseError(
                  "Failed to save passport data to the database."
                );
              }
            }
          }
        } else if (resultData.status === "failed") {
          throw new Error(
            `Analysis failed: ${resultData.error?.message || "Unknown error"}`
          );
        }

        pollCount++;
      }

      if (!analysisComplete) {
        throw new Error("Analysis timed out. Please try again.");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <MainContentArea
          filePreview={filePreview}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          results={results}
          error={error}
          isAnalyzing={isAnalyzing}
          databaseError={databaseError}
        />

        <RightSidebar
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          pageRange={pageRange}
          setPageRange={setPageRange}
          endpoint={endpoint}
          setEndpoint={setEndpoint}
          apiKey={apiKey}
          setApiKey={setApiKey}
          showApiKey={showApiKey}
          setShowApiKey={setShowApiKey}
          formType={formType}
          setFormType={setFormType}
          onAnalyze={handleAnalysis}
          isAnalyzing={isAnalyzing}
          results={results}
          error={error}
          databaseError={databaseError}
        />
      </div>
    </div>
  );
}
