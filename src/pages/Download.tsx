import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, FileText, Box, BookOpen, Monitor, Award, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PdfFirstPageThumb } from "@/components/PdfFirstPageThumb";

const CATEGORIES = [
  { id: "catalogs", label: "Product Catalogs", icon: FileText },
  { id: "drawings", label: "2D/3D Drawings", icon: Box },
  { id: "manuals", label: "User Manuals", icon: BookOpen },
  { id: "software", label: "Software", icon: Monitor },
  { id: "certificates", label: "Certificates", icon: Award },
];

interface DownloadItem {
  id: string;
  name: string;
  category: string;
  file_url: string;
  file_path: string;
  file_size: number;
  file_type: string;
  revision: string | null;
  updated_at: string;
}

const formatSize = (bytes: number) => {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const getFormat = (item: DownloadItem) => item.file_path?.split(".").pop()?.toUpperCase() || "FILE";

const isImage = (item: DownloadItem) => ["jpg", "jpeg", "png", "gif", "webp"].includes(
  item.file_path?.split(".").pop()?.toLowerCase() || ""
);

const isPdf = (item: DownloadItem) =>
  item.file_path?.toLowerCase().endsWith(".pdf") ?? false;

// Language badge colors matching reference (CN=red, EN=dark blue, JP=green, TH=purple)
const langBadgeColor: Record<string, string> = {
  EN: "bg-blue-700",
  CN: "bg-red-600",
  JP: "bg-green-600",
  KR: "bg-blue-500",
  TH: "bg-purple-600",
};

const langLabel: Record<string, string> = {
  EN: "英文版",
  CN: "中文版",
  JP: "日本語版",
  TH: "泰文版",
  KR: "한국어",
};

// Try to detect language from filename
const detectLang = (name: string): string | null => {
  const upper = name.toUpperCase();
  for (const lang of ["EN", "CN", "JP", "KR", "TH"]) {
    if (upper.includes(lang)) return lang;
  }
  return null;
};

const formatUpdateDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/-/g, ".");

const CATEGORY_IDS = ["catalogs", "drawings", "manuals", "software", "certificates"];

const DownloadPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const initialCat = categoryParam && CATEGORY_IDS.includes(categoryParam) ? categoryParam : "catalogs";
  const [activeCat, setActiveCat] = useState(initialCat);
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryParam && CATEGORY_IDS.includes(categoryParam)) {
      setActiveCat(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("downloads")
        .select("id, name, category, file_url, file_path, file_size, file_type, revision, updated_at")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (!cancelled) {
        if (error) console.error("Download fetch error:", error);
        setItems(data ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = items.filter((d) => d.category === activeCat);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-toyo-dark py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Resource Center</p>
          <h1 className="text-4xl font-black text-white">Downloads</h1>
          <p className="text-gray-400 text-sm mt-1">Catalog, 2D/3D Model Downloads</p>
        </div>
      </div>

      {/* Section label bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="bg-toyo-dark text-white text-sm font-bold px-4 py-2">File Downloads</div>
          <p className="text-sm text-gray-400">Catalog, 2D/3D Model Downloads</p>
        </div>
      </div>

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto flex gap-8">
          {/* Sidebar */}
          <div className="hidden md:block w-52 flex-shrink-0">
            <ul className="space-y-1">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setActiveCat(id)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      activeCat === id
                        ? "bg-toyo-red text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile select */}
          <div className="md:hidden w-full mb-4">
            <select value={activeCat} onChange={e => setActiveCat(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {/* File grid — HSF catalog card style */}
          <div className="flex-1">
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-toyo-red" />
              <h2 className="font-bold text-gray-900">
                {CATEGORIES.find((c) => c.id === activeCat)?.label}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="aspect-[3/4] bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Package className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">No files in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {filtered.map((file) => {
                  const lang = detectLang(file.name);
                  const fmt = getFormat(file);
                  const img = isImage(file);
                  const pdf = isPdf(file);
                  return (
                    <div key={file.id} className="group flex flex-col">
                      {/* Thumbnail */}
                      <div className="border border-gray-200 bg-white aspect-[3/4] flex items-center justify-center overflow-hidden relative mb-3">
                        {img ? (
                          <img src={file.file_url} alt={file.name} className="w-full h-full object-cover" />
                        ) : pdf ? (
                          <PdfFirstPageThumb
                            src={file.file_url}
                            alt={file.name}
                            className="w-full h-full object-cover object-top"
                            fallback={
                              <div className="flex flex-col items-center justify-center gap-3 w-full h-full p-6">
                                <FileText className="w-16 h-16 text-gray-300 stroke-[1.5]" strokeWidth={1.5} />
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{fmt}</span>
                              </div>
                            }
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3 w-full h-full p-6">
                            <FileText className="w-16 h-16 text-gray-300 stroke-[1.5]" strokeWidth={1.5} />
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{fmt}</span>
                          </div>
                        )}
                      </div>
                      {/* Language: "中文版 CN" with colored badge */}
                      <div className="flex items-center gap-1.5 mb-1">
                        {lang ? (
                          <>
                            <span className="text-sm text-gray-900">{langLabel[lang] ?? lang}</span>
                            <span className={`text-xs font-bold text-white px-2 py-0.5 ${langBadgeColor[lang] || "bg-gray-600"}`}>
                              {lang}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">—</span>
                        )}
                      </div>
                      {/* Update date: 更新: YYYY.MM.DD */}
                      <p className="text-xs text-gray-500 mb-3">
                        更新: {file.updated_at ? formatUpdateDate(file.updated_at) : "—"}
                      </p>
                      {/* Download */}
                      <button
                        onClick={() => window.open(file.file_url, "_blank")}
                        className="mt-auto flex flex-col items-center justify-center gap-0.5 w-14 h-14 bg-gray-900 text-white border border-gray-700 hover:bg-gray-800 transition-colors"
                        title="Download PDF"
                      >
                        <span className="text-[10px] font-bold leading-none">PDF</span>
                        <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default DownloadPage;
