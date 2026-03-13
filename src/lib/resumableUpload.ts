/**
 * Resumable file upload to Supabase Storage using TUS protocol.
 * Use for files > 6MB for better reliability. Supports up to 50GB.
 */
import * as tus from "tus-js-client";

const RESUMABLE_THRESHOLD = 6 * 1024 * 1024; // 6MB - use resumable for larger files

function getStorageEndpoint(): string {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) throw new Error("VITE_SUPABASE_URL is not set");
  const hostname = new URL(url).hostname;
  const projectRef = hostname.replace(".supabase.co", "");
  return `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;
}

export function uploadToSupabase(
  bucket: string,
  path: string,
  file: File,
  options: {
    accessToken: string;
    onProgress?: (uploaded: number, total: number) => void;
  }
): Promise<void> {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: getStorageEndpoint(),
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${options.accessToken}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: bucket,
        objectName: path,
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024, // 6MB - required by Supabase
      onError: (err) => reject(err),
      onProgress: (bytesUploaded, bytesTotal) => {
        options.onProgress?.(bytesUploaded, bytesTotal);
      },
      onSuccess: () => resolve(),
    });

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  });
}

export function shouldUseResumableUpload(fileSize: number): boolean {
  return fileSize > RESUMABLE_THRESHOLD;
}
