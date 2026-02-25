import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FileText } from "lucide-react";

// Vite: use ?url so worker is resolved from node_modules
// @ts-expect-error - Vite resolves ?url for worker
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfFirstPageThumbProps {
  /** Public URL of the PDF (must be CORS-enabled for cross-origin) */
  src: string;
  alt?: string;
  className?: string;
  /** Fallback when PDF fails to load or render */
  fallback?: React.ReactNode;
}

/**
 * Renders the first page of a PDF as an image thumbnail using PDF.js.
 * Use for card covers on the Download page.
 */
export function PdfFirstPageThumb({ src, alt = "PDF", className, fallback }: PdfFirstPageThumbProps) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setError(false);
    setThumbUrl(null);

    if (!src) return;

    const scale = 2; // Slightly higher for crisp thumbnail
    let canvas: HTMLCanvasElement | null = null;

    const load = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: src,
          verbosity: 0,
        });
        const pdf = await loadingTask.promise;
        if (cancelledRef.current) return;

        const page = await pdf.getPage(1);
        if (cancelledRef.current) return;

        const viewport = page.getViewport({ scale });
        canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError(true);
          return;
        }

        const outputScale = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        ctx.scale(outputScale, outputScale);

        await page.render({
          canvasContext: ctx,
          viewport,
          intent: "display",
        }).promise;

        if (cancelledRef.current) return;
        setThumbUrl(canvas.toDataURL("image/jpeg", 0.85));
      } catch (e) {
        if (!cancelledRef.current) setError(true);
      }
    };

    load();
    return () => {
      cancelledRef.current = true;
    };
  }, [src]);

  if (error || !thumbUrl) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 w-full h-full p-6 bg-gray-50 ${className ?? ""}`}
      >
        <FileText className="w-16 h-16 text-gray-300 stroke-[1.5]" strokeWidth={1.5} />
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">PDF</span>
      </div>
    );
  }

  return (
    <img
      src={thumbUrl}
      alt={alt}
      className={className}
    />
  );
}
