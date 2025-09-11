import React, { useCallback, useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

export default function ImageWithBoundingBoxes({
  imageUrl,
  results,
  onImageGenerated,
  displayInMainArea,
}) {
  const canvasRef = useRef(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "#22c55e"; // green-500
    if (confidence >= 0.7) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  const extractBoundingBoxes = (analyzeResults) => {
    const boundingBoxes = [];

    if (
      !analyzeResults ||
      !analyzeResults.readResults ||
      analyzeResults.readResults.length === 0
    ) {
      return boundingBoxes;
    }

    const readResult = analyzeResults.readResults[0];

    // Extract from lines
    if (readResult.lines) {
      readResult.lines.forEach((line, index) => {
        if (line.boundingBox && line.boundingBox.length >= 8) {
          boundingBoxes.push({
            id: `line-${index}`,
            type: "line",
            boundingBox: line.boundingBox,
            text: line.text,
            confidence: line.appearance?.style?.confidence || 0.8,
            page: readResult.page || 1,
          });
        }
      });
    }

    // Extract from words if available
    if (readResult.lines) {
      readResult.lines.forEach((line, lineIndex) => {
        if (line.words) {
          line.words.forEach((word, wordIndex) => {
            if (word.boundingBox && word.boundingBox.length >= 8) {
              boundingBoxes.push({
                id: `word-${lineIndex}-${wordIndex}`,
                type: "word",
                boundingBox: word.boundingBox,
                text: word.text,
                confidence: word.confidence || 0.8,
                page: readResult.page || 1,
              });
            }
          });
        }
      });
    }

    return boundingBoxes;
  };

  const drawBoundingBoxes = useCallback((canvas, image, boundingBoxes) => {
    const ctx = canvas.getContext("2d");

    // Set canvas size to match image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Draw the original image
    ctx.drawImage(image, 0, 0);

    // Draw bounding boxes
    boundingBoxes.forEach((box) => {
      const coords = box.boundingBox;
      if (coords.length < 8) return;

      // Extract coordinate pairs [x1,y1,x2,y2,x3,y3,x4,y4]
      const points = [];
      for (let i = 0; i < coords.length; i += 2) {
        points.push({ x: coords[i], y: coords[i + 1] });
      }

      // Set stroke style based on confidence and type
      ctx.strokeStyle = getConfidenceColor(box.confidence);
      ctx.lineWidth = box.type === "line" ? 2 : 1;
      ctx.globalAlpha = 0.8;

      // Draw polygon
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw text label for lines (not words to avoid clutter)
      if (box.type === "line" && box.text) {
        ctx.font = "12px Arial";
        ctx.fillStyle = getConfidenceColor(box.confidence);
        ctx.globalAlpha = 0.9;

        // Position label above the bounding box
        const minY = Math.min(...points.map((p) => p.y));
        const minX = Math.min(...points.map((p) => p.x));

        // Add background for text
        const textMetrics = ctx.measureText(
          box.text.substring(0, 30) + (box.text.length > 30 ? "..." : "")
        );
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(minX, minY - 18, textMetrics.width + 4, 16);

        // Draw text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          box.text.substring(0, 30) + (box.text.length > 30 ? "..." : ""),
          minX + 2,
          minY - 6
        );
      }

      ctx.globalAlpha = 1.0;
    });

    // Add legend
    drawLegend(ctx, canvas.width, canvas.height);
  }, []);

  const drawLegend = (ctx) => {
    const legendItems = [
      { color: "#22c55e", label: "High Confidence (90%+)" },
      { color: "#eab308", label: "Medium Confidence (70-89%)" },
      { color: "#ef4444", label: "Low Confidence (<70%)" },
    ];

    const legendX = 20;
    const legendY = 20;
    const itemHeight = 20;
    const legendWidth = 200;
    const legendHeight = legendItems.length * itemHeight + 20;

    // Draw legend background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(legendX - 10, legendY - 10, legendWidth, legendHeight);

    // Draw legend items
    ctx.font = "12px Arial";
    legendItems.forEach((item, index) => {
      const y = legendY + index * itemHeight;

      // Draw color indicator
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 15, 12);

      // Draw text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(item.label, legendX + 20, y + 9);
    });
  };

  const generateImage = useCallback(async () => {
    if (!imageUrl || !results) return;

    setIsGenerating(true);

    try {
      const image = new Image();
      image.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = imageUrl;
      });

      const canvas = canvasRef.current;
      const boundingBoxes = extractBoundingBoxes(results);

      drawBoundingBoxes(canvas, image, boundingBoxes);

      // Convert canvas to blob and create URL
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setGeneratedImageUrl(url);
        if (onImageGenerated) {
          onImageGenerated(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [imageUrl, results, drawBoundingBoxes, onImageGenerated]);

  const downloadImage = () => {
    if (!generatedImageUrl) return;

    const link = document.createElement("a");
    link.download = `document-analysis-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}.png`;
    link.href = generatedImageUrl;
    link.click();
  };

  useEffect(() => {
    if (imageUrl && results) {
      generateImage();
    }
  }, [generateImage, imageUrl, results]);

  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (generatedImageUrl) {
        URL.revokeObjectURL(generatedImageUrl);
      }
    };
  }, [generatedImageUrl]);

  return (
    <div
      className={
        displayInMainArea ? "w-full h-full flex flex-col" : "space-y-4"
      }
    >
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {isGenerating && (
        <div className="flex items-center justify-center p-4 bg-gray-800 rounded">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-gray-300">Generating annotated image...</span>
        </div>
      )}

      {generatedImageUrl && (
        <div
          className={displayInMainArea ? "flex flex-col h-full" : "space-y-2"}
        >
          {!displayInMainArea && (
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-white">
                Annotated Image with Bounding Boxes
              </h4>
              <button
                onClick={downloadImage}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                <Download className="w-3 h-3" />
                <span>Download Image</span>
              </button>
            </div>
          )}

          <div
            className={`${"flex items-center justify-center w-full h-full p-4  rounded"}`}
          >
            <img
              src={generatedImageUrl}
              alt="Document with bounding boxes"
              className={
                "max-w-[900px] max-h-[700px] object-contain rounded-lg shadow-2xl border border-gray-700 bg-white"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
