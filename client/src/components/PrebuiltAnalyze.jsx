import React, { useState } from "react";
import RightSidebar from "./RightSidebar";
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
  const [showApiKey, setShowApiKey] = useState(true);
  const [endpoint, setEndpoint] = useState("");
  const [formType, setFormType] = useState("invoice");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalysis = async () => {
    if (!selectedFile || !apiKey || !endpoint) {
      setError("Please select a file and provide API key and endpoint");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      // Clean up endpoint URL
      const cleanEndpoint = endpoint.replace(/\/$/, "");

      // Construct the API URL based on form type
      const apiUrl = `${cleanEndpoint}/formrecognizer/v2.1/prebuilt/${FORM_TYPES[formType]}/analyze?includeTextDetails=true`;

      // Convert file to base64 for JSON payload (alternative approach)
      const formData = new FormData();
      formData.append("file", selectedFile);

      // First, submit the document for analysis
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

      // Get the operation location from the response headers
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
          console.log("Analysis results:", resultData);
          setResults(resultData.analyzeResult);
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
        />
      </div>
    </div>
  );
}
