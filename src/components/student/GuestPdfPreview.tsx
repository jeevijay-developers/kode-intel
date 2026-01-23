import { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, BookOpen } from "lucide-react";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

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
  useEffect(() => {
    // Using the non-module worker improves compatibility on older Android browsers.
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages }) => onLoadSuccess?.(numPages)}
      loading={
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
      error={
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <BookOpen className="h-12 w-12 mb-2 opacity-50" />
          <p>Failed to load PDF</p>
        </div>
      }
    >
      <Page
        pageNumber={pageNumber}
        renderTextLayer
        renderAnnotationLayer
        className="shadow-xl rounded-lg overflow-hidden"
        width={width}
      />
    </Document>
  );
}
