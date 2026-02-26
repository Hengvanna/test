import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Always use CDN for the worker so Hostinger (and other hosts) never serve .mjs as text/plain and break PDF.js.
const PDFJS_WORKER_VERSION = "5.4.624";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_WORKER_VERSION}/build/pdf.worker.mjs`;

interface PdfFirstPageThumbProps {
  /** Public URL of the PDF (use when storagePath is not set; requires CORS on storage) */
  src?: string;
  /** Prefer this when using Supabase: path in storage bucket (e.g. "downloads/xxx.pdf"). Avoids CORS. */
  storagePath?: string;
  /** Storage bucket name (default "media") when using storagePath */
  storageBucket?: string;
  alt?: string;
  className?: string;
  /** Fallback when PDF fails to load or render */
  fallback?: React.ReactNode;
}

/**
 * Renders the first page of a PDF as an image thumbnail using PDF.js.
 * Use for card covers on the Download page.
 * Prefer storagePath over src when using Supabase so thumbnails work on localhost and deployed sites.
 * If thumbnails still show the placeholder: in Supabase Dashboard → Storage → media bucket → CORS,
 * add allowed origins (e.g. http://localhost:5173 and your production URL).
 */
export function PdfFirstPageThumb({
  src,
  storagePath,
  storageBucket = "media",
  alt = "PDF",
  className,
  fallback,
}: PdfFirstPageThumbProps) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setError(false);
    setThumbUrl(null);

    const source = storagePath ?? src;
    if (!source) return;

    const scale = 2; // Slightly higher for crisp thumbnail
    let canvas: HTMLCanvasElement | null = null;

    const load = async () => {
      try {
        let arrayBuffer: ArrayBuffer | null = null;
        // 1) Prefer Supabase client (no CORS). If env missing on server, this fails.
        if (storagePath && supabase) {
          const { data, error: downloadError } = await supabase.storage
            .from(storageBucket)
            .download(storagePath);
          if (!downloadError && data) arrayBuffer = await data.arrayBuffer();
        }
        // 2) Fallback: load via public URL (works when Supabase env missing on Hostinger; needs CORS on bucket).
        if (!arrayBuffer && src) {
          const res = await fetch(src, { mode: "cors" });
          if (res.ok) arrayBuffer = await res.arrayBuffer();
        }
        if (!arrayBuffer || cancelledRef.current) {
          if (!arrayBuffer) setError(true);
          return;
        }

        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
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
          canvas,
        }).promise;

        if (cancelledRef.current) return;
        setThumbUrl(canvas.toDataURL("image/jpeg", 0.85));
      } catch (e) {
        if (!cancelledRef.current) {
          setError(true);
          console.warn("[PdfFirstPageThumb] Could not load first page:", storagePath ?? src, e);
        }
      }
    };

    load();
    return () => {
      cancelledRef.current = true;
    };
  }, [src, storagePath, storageBucket]);

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
