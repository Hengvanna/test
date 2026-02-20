import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Upload, Trash2, Download, LogOut, FileText,
  Search, Check, AlertCircle, CloudUpload, Images,
  Files, Copy, Eye, Package, Plus, X, Pencil, ChevronDown, ChevronUp, Newspaper
} from "lucide-react";
import DownloadsTab from "@/components/admin/DownloadsTab";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MediaItem {
  id: string;
  name: string;
  file_path: string;
  url: string;
  type: string;
  size: number;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  model: string | null;
  specs: { key: string; value: string }[];
  image_url: string | null;
  image_path: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  catalog_url: string | null;
  drawing_2d_url: string | null;
  drawing_3d_url: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext || "")) return "📄";
  if (["doc", "docx"].includes(ext || "")) return "📝";
  if (["xls", "xlsx"].includes(ext || "")) return "📊";
  if (["zip", "rar"].includes(ext || "")) return "🗜️";
  if (["dwg", "step", "stp"].includes(ext || "")) return "📐";
  return "📁";
};

const PRODUCT_CATEGORIES = [
  "Single-axis Linear Actuators",
  "Multi-axis Linear Actuators",
  "Servo Cylinders",
  "Miniature Cylinders",
  "Electric Grippers",
  "Linear Motor Robots",
  "Nanometer-precision Air Bearing System",
  "Nanometer-precision Linear Motor System",
  "Air Bearing Stage / Alignment Stage",
  "Desktop Robots",
  "Clean Room Series",
  "Automated Guided Vehicles",
  "Controllers",
  "Discontinued Product List",
];

const emptyProduct = (): Omit<Product, "id" | "created_at"> => ({
  name: "",
  description: "",
  category: PRODUCT_CATEGORIES[0],
  model: "",
  specs: [],
  image_url: null,
  image_path: null,
  published: true,
  sort_order: 0,
  catalog_url: null,
  drawing_2d_url: null,
  drawing_3d_url: null,
});

// ─── Product Form Modal ───────────────────────────────────────────────────────

function ProductFormModal({
  initial,
  seriesProducts,
  onSave,
  onClose,
  showToast,
}: {
  initial: (Omit<Product, "id" | "created_at"> & { _id?: string }) | null;
  seriesProducts?: Product[];
  onSave: () => void | Promise<void>;
  onClose: () => void;
  showToast: (msg: string, ok?: boolean) => void;
}) {
  const isEditSeries = !!initial && !!seriesProducts && seriesProducts.length > 0;
  const initialForm = initial
    ? {
        ...initial,
        model: isEditSeries
          ? seriesProducts!.map(p => p.model).filter(Boolean).join("\n")
          : (initial.model ?? ""),
      }
    : emptyProduct();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initial;

  const set = (key: keyof typeof form, val: unknown) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const uploadImage = async (file: File) => {
    setImgUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { showToast("Image upload failed", false); setImgUploading(false); return; }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    set("image_url", data.publicUrl);
    set("image_path", path);
    setImgUploading(false);
  };

  const save = async () => {
    if (!form.name || !form.category) { showToast("Name and category required", false); return; }
    setSaving(true);

    const basePayload = {
      name: form.name,
      description: form.description || null,
      category: form.category,
      specs: form.specs,
      image_url: form.image_url,
      image_path: form.image_path,
      published: form.published,
      sort_order: form.sort_order,
      catalog_url: form.catalog_url || null,
      drawing_2d_url: form.drawing_2d_url || null,
      drawing_3d_url: form.drawing_3d_url || null,
    };

    if (isEdit) {
      if (isEditSeries && seriesProducts!.length > 0) {
        const newModels = (form.model || "")
          .split("\n")
          .map(m => m.trim())
          .filter(m => m.length > 0);
        const existing = seriesProducts!;
        const baseSort = existing[0]?.sort_order ?? 0;
        for (let i = 0; i < Math.max(existing.length, newModels.length); i++) {
          if (i < newModels.length && i < existing.length) {
            const { error } = await supabase
              .from("products")
              .update({ ...basePayload, model: newModels[i], sort_order: baseSort + i })
              .eq("id", existing[i].id);
            if (error) { setSaving(false); showToast(error.message, false); return; }
          } else if (i < newModels.length) {
            const { error } = await supabase
              .from("products")
              .insert({ ...basePayload, model: newModels[i], sort_order: baseSort + i });
            if (error) { setSaving(false); showToast(error.message, false); return; }
          } else {
            const path = existing[i].image_path;
            const stillUsed = existing.some((p, j) => j < newModels.length && p.image_path === path);
            if (path && !stillUsed) await supabase.storage.from("media").remove([path]);
            await supabase.from("products").delete().eq("id", existing[i].id);
          }
        }
        setSaving(false);
        showToast("Series updated!");
      } else {
        const { error } = await supabase.from("products").update({ ...basePayload, model: form.model || null }).eq("id", (initial as any)._id);
        setSaving(false);
        if (error) { showToast(error.message, false); return; }
        showToast("Product updated!");
      }
    } else {
      // Parse multiple models (one per line)
      const models = (form.model || "")
        .split("\n")
        .map(m => m.trim())
        .filter(m => m.length > 0);

      if (models.length === 0) {
        // Single product with no model
        const { error } = await supabase.from("products").insert({ ...basePayload, model: null });
        setSaving(false);
        if (error) { showToast(error.message, false); return; }
        showToast("Product created!");
      } else {
        const rows = models.map((m, i) => ({ ...basePayload, model: m, sort_order: form.sort_order + i }));
        const { error } = await supabase.from("products").insert(rows);
        setSaving(false);
        if (error) { showToast(error.message, false); return; }
        showToast(`${models.length} products created!`);
      }
    }
    await onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Product Image</label>
            <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            <div
              onClick={() => imgInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-toyo-red/50 transition-colors overflow-hidden bg-gray-50"
            >
              {imgUploading ? (
                <span className="text-sm text-gray-400">Uploading...</span>
              ) : form.image_url ? (
                <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">Click to upload image</span>
                </div>
              )}
            </div>
            {form.image_url && (
              <button
                onClick={() => { set("image_url", null); set("image_path", null); }}
                className="text-xs text-red-500 mt-1 hover:underline"
              >Remove image</button>
            )}
          </div>

          {/* Name & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Product Name *</label>
              <input
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. GLTH Series"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                {isEdit && !isEditSeries ? "Model Number" : "Model Numbers (one per line)"}
              </label>
              {isEdit && !isEditSeries ? (
                <input
                  value={form.model || ""}
                  onChange={e => set("model", e.target.value)}
                  placeholder="e.g. TAS-100"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red"
                />
              ) : (
                <textarea
                  value={form.model || ""}
                  onChange={e => set("model", e.target.value)}
                  placeholder={"e.g.\nGLTH3\nGLTH5\nGLTH8"}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red resize-none"
                />
              )}
              {(!isEdit || isEditSeries) && (
                <p className="text-[10px] text-gray-400 mt-1">One product per line; edit the list to add or remove models.</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Category *</label>
            <select
              value={form.category}
              onChange={e => set("category", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red bg-white"
            >
              {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              value={form.description || ""}
              onChange={e => set("description", e.target.value)}
              rows={3}
              placeholder="Brief product description..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red resize-none"
            />
          </div>

          {/* Download Links */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Download Links</label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">PDF Catalog URL</label>
                <input
                  value={form.catalog_url || ""}
                  onChange={e => set("catalog_url", e.target.value)}
                  placeholder="https://... (PDF catalog link)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">2D Drawing URL</label>
                <input
                  value={form.drawing_2d_url || ""}
                  onChange={e => set("drawing_2d_url", e.target.value)}
                  placeholder="https://... (2D drawing download link)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">3D Model URL</label>
                <input
                  value={form.drawing_3d_url || ""}
                  onChange={e => set("drawing_3d_url", e.target.value)}
                  placeholder="https://... (3D model download link)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set("published", !form.published)}
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${form.published ? "bg-toyo-red" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.published ? "left-5" : "left-0.5"}`} />
              </div>
              <span className="text-sm text-gray-600">{form.published ? "Published" : "Draft"}</span>
            </label>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold bg-toyo-red text-white rounded-lg hover:bg-toyo-red-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

interface ProductSeries {
  name: string;
  products: Product[];
}

function ProductsTab({ showToast }: { showToast: (msg: string, ok?: boolean) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState<{
    open: boolean;
    product: (Product & { _id: string }) | null;
    seriesProducts: Product[] | null;
  }>({ open: false, product: null, seriesProducts: null });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setProducts((data || []).map(p => ({ ...p, specs: Array.isArray(p.specs) ? (p.specs as unknown as { key: string; value: string }[]) : [] })) as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const seriesMap = new Map<string, Product[]>();
  products.forEach(p => {
    if (!seriesMap.has(p.name)) seriesMap.set(p.name, []);
    seriesMap.get(p.name)!.push(p);
  });
  const seriesList: ProductSeries[] = Array.from(seriesMap.entries()).map(([name, prods]) => ({
    name,
    products: prods.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
  }));

  const filteredSeries = seriesList.filter(s => {
    const matchCat = catFilter === "All" || (s.products[0] && s.products[0].category === catFilter);
    const matchSearch =
      !search.trim() ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.products.some(p => (p.model || "").toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const deleteSeries = async (s: ProductSeries) => {
    if (!confirm(`Delete series "${s.name}" and all ${s.products.length} model(s)?`)) return;
    const imagePath = s.products[0]?.image_path;
    if (imagePath) await supabase.storage.from("media").remove([imagePath]);
    for (const p of s.products) await supabase.from("products").delete().eq("id", p.id);
    setProducts(prev => prev.filter(x => !s.products.some(sp => sp.id === x.id)));
    showToast("Series deleted");
  };

  const togglePublishSeries = async (s: ProductSeries) => {
    const target = s.products.every(p => p.published) ? false : true;
    for (const p of s.products) {
      await supabase.from("products").update({ published: target }).eq("id", p.id);
    }
    setProducts(prev =>
      prev.map(x => (s.products.some(sp => sp.id === x.id) ? { ...x, published: target } : x))
    );
    showToast(target ? "Series published!" : "Series set to draft");
  };

  const openEdit = (s: ProductSeries) => {
    const first = s.products[0];
    setModal({
      open: true,
      product: { ...first, _id: first.id } as Product & { _id: string },
      seriesProducts: s.products,
    });
  };

  const cats = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="font-bold text-gray-800 text-sm mr-auto">Products ({products.length})</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text" placeholder="Search..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-toyo-red w-44"
          />
        </div>
        <select
          value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-toyo-red"
        >
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
        <button
          onClick={() => setModal({ open: true, product: null, seriesProducts: null })}
          className="flex items-center gap-1.5 bg-toyo-red text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-toyo-red-dark transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading...</div>
      ) : filteredSeries.length === 0 ? (
        <div className="py-20 text-center">
          <Package className="w-10 h-10 mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No products yet. Click "Add Product" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSeries.map(s => {
            const first = s.products[0];
            const allPublished = s.products.every(p => p.published);
            return (
              <div key={s.name} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:border-gray-200 transition-all">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
                  {first?.image_url ? (
                    <img src={first.image_url} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-7 h-7 text-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{s.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto flex-shrink-0 ${allPublished ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                      {allPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <span className="text-xs text-toyo-red font-semibold">{first?.category}</span>
                  {first?.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{first.description}</p>}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {s.products.map(p => (
                      <span key={p.id} className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {p.model || "—"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublishSeries(s)}
                    className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:border-gray-300 transition-colors"
                  >
                    {allPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => openEdit(s)}
                    className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteSeries(s)}
                    className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal.open && (
        <ProductFormModal
          key={modal.seriesProducts?.map(p => p.id).join(",") ?? (modal.product?._id ?? "new")}
          initial={modal.product}
          seriesProducts={modal.seriesProducts ?? undefined}
          onSave={fetchProducts}
          onClose={() => setModal({ open: false, product: null, seriesProducts: null })}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ─── News Tab ─────────────────────────────────────────────────────────────────

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  event_type: string | null;
  event_date: string | null;
  venue: string | null;
  booth: string | null;
  status: string;
  featured: boolean;
  published_at: string;
}

const NEWS_CATEGORIES = [
  { id: "news", label: "News" },
  { id: "event", label: "Event News" },
  { id: "announcement", label: "Announcements" },
];

const emptyNews = (): Omit<NewsItem, "id"> => ({
  title: "",
  excerpt: "",
  category: "news",
  event_type: "",
  event_date: null,
  venue: null,
  booth: null,
  status: "published",
  featured: false,
  published_at: new Date().toISOString(),
});

function NewsFormModal({ initial, onSave, onClose, showToast }: {
  initial: NewsItem | null;
  onSave: () => void;
  onClose: () => void;
  showToast: (msg: string, ok?: boolean) => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<Omit<NewsItem, "id">>(initial ? {
    title: initial.title,
    excerpt: initial.excerpt,
    category: initial.category,
    event_type: initial.event_type,
    event_date: initial.event_date,
    venue: initial.venue,
    booth: initial.booth,
    status: initial.status,
    featured: initial.featured,
    published_at: initial.published_at,
  } : emptyNews());
  const [saving, setSaving] = useState(false);
  const set = (key: keyof typeof form, val: unknown) => setForm(prev => ({ ...prev, [key]: val }));

  const save = async () => {
    if (!form.title.trim()) { showToast("Title is required", false); return; }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt || null,
      category: form.category,
      event_type: form.event_type || null,
      event_date: form.event_date || null,
      venue: form.venue || null,
      booth: form.booth || null,
      status: form.status,
      featured: form.featured,
      published_at: form.published_at,
    };
    const { error } = isEdit
      ? await (supabase as any).from("news_items").update(payload).eq("id", initial!.id)
      : await (supabase as any).from("news_items").insert(payload);
    setSaving(false);
    if (error) { showToast(error.message, false); return; }
    showToast(isEdit ? "Updated!" : "Created!");
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit News" : "Add News"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red bg-white">
                {NEWS_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Type / Tag</label>
              <input value={form.event_type || ""} onChange={e => set("event_type", e.target.value)}
                placeholder="e.g. Product Launch, Exhibition..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="News title..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Excerpt / Summary</label>
            <textarea value={form.excerpt || ""} onChange={e => set("excerpt", e.target.value)} rows={3}
              placeholder="Brief summary..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red resize-none" />
          </div>
          {form.category === "event" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Event Date</label>
                  <input type="date" value={form.event_date || ""} onChange={e => set("event_date", e.target.value || null)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Booth</label>
                  <input value={form.booth || ""} onChange={e => set("booth", e.target.value)}
                    placeholder="e.g. Booth A0088"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Venue</label>
                <input value={form.venue || ""} onChange={e => set("venue", e.target.value)}
                  placeholder="e.g. Taipei World Trade Center"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red" />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Publish Date</label>
            <input type="datetime-local" value={form.published_at?.slice(0, 16) || ""}
              onChange={e => set("published_at", e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString())}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-toyo-red" />
          </div>
          <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => set("status", form.status === "published" ? "draft" : "published")}
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${form.status === "published" ? "bg-toyo-red" : "bg-gray-200"}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.status === "published" ? "left-5" : "left-0.5"}`} />
              </div>
              <span className="text-sm text-gray-600">{form.status === "published" ? "Published" : "Draft"}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)}
                className="w-4 h-4 accent-toyo-red" />
              <span className="text-sm text-gray-600">Featured</span>
            </label>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving}
            className="px-5 py-2 text-sm font-semibold bg-toyo-red text-white rounded-lg hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NewsTab({ showToast }: { showToast: (msg: string, ok?: boolean) => void }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("news");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; item: NewsItem | null }>({ open: false, item: null });

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("news_items").select("*").order("published_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const deleteItem = async (item: NewsItem) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await (supabase as any).from("news_items").delete().eq("id", item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    showToast("Deleted");
  };

  const toggleStatus = async (item: NewsItem) => {
    const next = item.status === "published" ? "draft" : "published";
    await (supabase as any).from("news_items").update({ status: next }).eq("id", item.id);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: next } : i));
    showToast(next === "published" ? "Published!" : "Set to draft");
  };

  const filtered = items.filter(i => {
    const matchCat = i.category === activeCat;
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1 gap-0.5 mr-auto">
          {NEWS_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeCat === cat.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {cat.label} ({items.filter(i => i.category === cat.id).length})
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-toyo-red w-44" />
        </div>
        <button onClick={() => setModal({ open: true, item: null })}
          className="flex items-center gap-1.5 bg-toyo-red text-white text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> Add News
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Newspaper className="w-10 h-10 mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No items yet. Click "Add News" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:border-gray-200 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  {item.event_type && (
                    <span className="text-xs font-bold text-toyo-red uppercase tracking-wide">{item.event_type}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === "published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {item.status}
                  </span>
                  {item.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">Featured</span>}
                </div>
                <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                {item.excerpt && <p className="text-xs text-gray-400 mt-0.5 truncate">{item.excerpt}</p>}
                <p className="text-xs text-gray-400 mt-0.5">{new Date(item.published_at).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleStatus(item)} className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:border-gray-300 transition-colors">
                  {item.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => setModal({ open: true, item })}
                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button onClick={() => deleteItem(item)}
                  className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <NewsFormModal
          initial={modal.item}
          onSave={fetchItems}
          onClose={() => setModal({ open: false, item: null })}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

type AdminTab = "media" | "products" | "downloads";

export default function AdminPanel() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{ name: string; progress: number; done: boolean; error: boolean }[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "image" | "file">("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("media_items")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate("/admin/login"); return; }
      const { data: role } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", session.user.id).eq("role", "admin").single();
      if (!role) { await supabase.auth.signOut(); navigate("/admin/login"); return; }
      fetchItems();
    });
  }, []);

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setUploading(true);
    const queue = files.map(f => ({ name: f.name, progress: 0, done: false, error: false }));
    setUploadQueue(queue);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      queue[i].progress = 30; setUploadQueue([...queue]);
      const { error: storageErr } = await supabase.storage.from("media").upload(filePath, file);
      if (storageErr) { queue[i].error = true; queue[i].done = true; setUploadQueue([...queue]); continue; }
      queue[i].progress = 80; setUploadQueue([...queue]);
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);
      await supabase.from("media_items").insert({
        name: file.name, file_path: filePath, url: urlData.publicUrl,
        type: file.type.startsWith("image/") ? "image" : "file",
        size: file.size, uploaded_by: session.user.id,
      });
      queue[i].progress = 100; queue[i].done = true; setUploadQueue([...queue]);
    }
    setTimeout(() => {
      setUploading(false); setUploadQueue([]);
      showToast(`✓ ${files.length} file(s) uploaded successfully`);
      fetchItems();
    }, 800);
  };

  const deleteItem = async (item: MediaItem) => {
    await supabase.storage.from("media").remove([item.file_path]);
    await supabase.from("media_items").delete().eq("id", item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    if (preview?.id === item.id) setPreview(null);
    showToast("File deleted");
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("URL copied to clipboard");
  };

  const downloadFile = async (item: MediaItem) => {
    const { data } = await supabase.storage.from("media").createSignedUrl(item.file_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

  const filtered = items.filter(item => {
    const matchTab = tab === "all" || item.type === tab;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const images = items.filter(i => i.type === "image");
  const files = items.filter(i => i.type === "file");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-toyo-red font-black text-xl tracking-widest">TOYO</span>
            <span className="h-5 w-px bg-gray-200" />
            <span className="text-sm font-semibold text-gray-600">Admin Panel</span>
            <div className="flex bg-gray-100 rounded-lg p-1 gap-0.5 ml-4">
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === "products" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Package className="w-3.5 h-3.5" /> Products
              </button>
              <button
                onClick={() => setActiveTab("downloads")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === "downloads" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Download className="w-3.5 h-3.5" /> Downloads
              </button>
            
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              View Website ↗
            </a>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 w-full flex-1">

       
        {activeTab === "products" && <ProductsTab showToast={showToast} />}
        {activeTab === "downloads" && <DownloadsTab showToast={showToast} />}

        
        
      </div>

      {/* Image preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="relative max-w-3xl max-h-[80vh] w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1">✕ Close</button>
            <img src={preview.url} alt={preview.name} className="w-full h-full object-contain rounded-xl max-h-[75vh]" />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-white/80 text-sm truncate">{preview.name}</p>
              <div className="flex gap-2">
                <button onClick={() => copyUrl(preview)} className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors">
                  {copiedId === preview.id ? "Copied!" : "Copy URL"}
                </button>
                <button onClick={() => downloadFile(preview)} className="text-xs bg-toyo-red hover:bg-toyo-red-dark text-white px-3 py-1.5 rounded-lg transition-colors">Download</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-full shadow-xl text-sm font-medium z-50 transition-all ${toast.ok ? "bg-gray-900 text-white" : "bg-red-500 text-white"}`}>
          {toast.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
