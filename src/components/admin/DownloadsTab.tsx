import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Upload, Trash2, Plus, X, FileText, Search, CloudUpload, Eye, EyeOff,
} from "lucide-react";

const DOWNLOAD_CATEGORIES = [
  { id: "catalogs", label: "Product Catalogs" },
  { id: "drawings", label: "2D/3D Drawings" },
  { id: "manuals", label: "User Manuals" },
  { id: "software", label: "Software" },
  { id: "certificates", label: "Certificates" },
];

interface DownloadItem {
  id: string;
  name: string;
  category: string;
  file_path: string;
  file_url: string;
  file_size: number;
  file_type: string;
  revision: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

const formatSize = (bytes: number) => {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const getExt = (path: string) => path.split(".").pop()?.toUpperCase() || "FILE";

// ─── Add File Modal ───────────────────────────────────────────────────────────

function AddFileModal({
  onClose,
  onSaved,
  showToast,
}: {
  onClose: () => void;
  onSaved: () => void;
  showToast: (msg: string, ok?: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(DOWNLOAD_CATEGORIES[0].id);
  const [revision, setRevision] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!name.trim() || !file) {
      showToast("Please fill in name and select a file", false);
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `downloads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: storageErr } = await supabase.storage.from("media").upload(filePath, file);
    if (storageErr) {
      showToast("Upload failed: " + storageErr.message, false);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);
    const { data: { session } } = await supabase.auth.getSession();
    const { error: dbErr } = await (supabase as any).from("downloads").insert({
      name: name.trim(),
      category,
      file_path: filePath,
      file_url: urlData.publicUrl,
      file_size: file.size,
      file_type: file.type || "file",
      revision: revision.trim() || null,
      published: true,
      sort_order: 0,
      uploaded_by: session?.user?.id ?? null,
    });
    setUploading(false);
    if (dbErr) {
      showToast("Save failed: " + dbErr.message, false);
      return;
    }
    showToast("File uploaded!");
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Upload Download File</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* File picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">File *</label>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); if (!name) setName(e.target.files[0].name.replace(/\.[^.]+$/, "")); } }}
            />
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-300 transition-colors bg-gray-50"
            >
              {file ? (
                <>
                  <FileText className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatSize(file.size)}</p>
                </>
              ) : (
                <>
                  <CloudUpload className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">Click to choose file</p>
                </>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Display Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. TOYO Product Catalog 2024"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-red-400"
            >
              {DOWNLOAD_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {/* Revision */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Revision / Version</label>
            <input
              value={revision}
              onChange={e => setRevision(e.target.value)}
              placeholder="e.g. Rev. 3 or v2.1.5"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: "hsl(var(--toyo-red))" }}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Downloads Tab ────────────────────────────────────────────────────────────

export default function DownloadsTab({ showToast }: { showToast: (msg: string, ok?: boolean) => void }) {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("catalogs");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("downloads")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const togglePublish = async (item: DownloadItem) => {
    await (supabase as any).from("downloads").update({ published: !item.published }).eq("id", item.id);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, published: !i.published } : i));
    showToast(item.published ? "Set to draft" : "Published!");
  };

  const deleteItem = async (item: DownloadItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await supabase.storage.from("media").remove([item.file_path]);
    await (supabase as any).from("downloads").delete().eq("id", item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    showToast("File deleted");
  };

  const filtered = items.filter(i => {
    const matchCat = i.category === activeCat;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const countFor = (catId: string) => items.filter(i => i.category === catId).length;

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0">
        <ul className="space-y-1">
          {DOWNLOAD_CATEGORIES.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => setActiveCat(cat.id)}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-lg flex items-center justify-between transition-colors ${
                  activeCat === cat.id
                    ? "font-semibold text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                style={activeCat === cat.id ? { backgroundColor: "hsl(var(--toyo-red))" } : {}}
              >
                <span>{cat.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeCat === cat.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {countFor(cat.id)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-bold text-gray-800 text-sm mr-auto">
            {DOWNLOAD_CATEGORIES.find(c => c.id === activeCat)?.label}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text" placeholder="Search files..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-red-400 w-44"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "hsl(var(--toyo-red))" }}
          >
            <Plus className="w-3.5 h-3.5" /> Upload File
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Upload className="w-10 h-10 mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm mb-3">No files in this category yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "hsl(var(--toyo-red))" }}
            >
              Upload First File
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {filtered.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                {/* Format badge */}
                <span
                  className="text-xs font-bold px-2 py-1 min-w-[44px] text-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--toyo-red) / 0.1)", color: "hsl(var(--toyo-red))" }}
                >
                  {getExt(item.file_path)}
                </span>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatSize(item.file_size)}{item.revision ? ` · ${item.revision}` : ""}
                  </p>
                </div>
                {/* Status */}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${item.published ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                  {item.published ? "Published" : "Draft"}
                </span>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(item)}
                    className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                    title={item.published ? "Unpublish" : "Publish"}
                  >
                    {item.published ? <EyeOff className="w-3.5 h-3.5 text-gray-500" /> : <Eye className="w-3.5 h-3.5 text-gray-500" />}
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddFileModal
          onClose={() => setShowModal(false)}
          onSaved={fetchItems}
          showToast={showToast}
        />
      )}
    </div>
  );
}
