import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Vite: ?url resolves worker from node_modules (path includes base in production).
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

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
        let arrayBuffer: ArrayBuffer;
        if (storagePath) {
          // Load via Supabase client — works on localhost and server without extra CORS config
          const { data, error: downloadError } = await supabase.storage
            .from(storageBucket)
            .download(storagePath);
          if (downloadError || !data) throw new Error(downloadError?.message ?? "Download failed");
          arrayBuffer = await data.arrayBuffer();
        } else if (src) {
          const res = await fetch(src, { mode: "cors" });
          if (!res.ok) throw new Error(`PDF fetch ${res.status}`);
          arrayBuffer = await res.arrayBuffer();
        } else {
          return;
        }
        if (cancelledRef.current) return;

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
