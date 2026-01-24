import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure PDF.js worker - use CDN with proper CORS
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type GuestPdfPreviewProps = {
  file: string;
  pageNumber: number;
  width: number;
  onLoadSuccess?: (numPages: number) => void;
};

export default function GuestPdfPreview({
  file,
  pageNumber,
  width,
  onLoadSuccess,
}: GuestPdfPreviewProps) {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setError(null);
    setRetryCount((prev) => prev + 1);
  };

  const handleError = (err: Error) => {
    console.error("PDF Load Error:", err);
    setError(err);
  };

  return (
    <Document
      key={`${file}-${retryCount}`}
      file={file}
      onLoadSuccess={({ numPages }) => {
        setError(null);
        onLoadSuccess?.(numPages);
      }}
      onLoadError={handleError}
      loading={
        <div className="flex flex-col items-center justify-center h-96 gap-3">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      }
      error={
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground gap-4 p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground mb-1">Failed to load PDF</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              The document couldn't be loaded. Please check your connection and try again.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      }
    >
      <Page
        pageNumber={pageNumber}
        renderTextLayer
        renderAnnotationLayer
        className="shadow-xl rounded-lg overflow-hidden"
        width={width}
        loading={
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        }
      />
    </Document>
  );
}
