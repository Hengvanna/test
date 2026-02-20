import { useState, useEffect } from "react";
import { Search, Filter, Package, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  model: string | null;
  specs: { key: string; value: string }[];
  image_url: string | null;
  catalog_url: string | null;
  drawing_2d_url: string | null;
  drawing_3d_url: string | null;
}

interface SeriesGroup {
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  models: string[];
  catalog_url: string | null;
  drawing_2d_url: string | null;
  drawing_3d_url: string | null;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, description, category, model, specs, image_url, catalog_url, drawing_2d_url, drawing_3d_url")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(
          (data || []).map(p => ({
            ...p,
            specs: Array.isArray(p.specs)
              ? (p.specs as unknown as { key: string; value: string }[])
              : [],
          })) as Product[]
        );
        setLoading(false);
      });
  }, []);

  // Group products by name (series)
  const seriesMap = new Map<string, SeriesGroup>();
  products.forEach(p => {
    if (!seriesMap.has(p.name)) {
      seriesMap.set(p.name, {
        name: p.name,
        description: p.description,
        image_url: p.image_url,
        category: p.category,
        models: [],
        catalog_url: p.catalog_url,
        drawing_2d_url: p.drawing_2d_url,
        drawing_3d_url: p.drawing_3d_url,
      });
    }
    const series = seriesMap.get(p.name)!;
    if (p.model && !series.models.includes(p.model)) {
      series.models.push(p.model);
    }
    if (!series.image_url && p.image_url) series.image_url = p.image_url;
    if (!series.catalog_url && p.catalog_url) series.catalog_url = p.catalog_url;
    if (!series.drawing_2d_url && p.drawing_2d_url) series.drawing_2d_url = p.drawing_2d_url;
    if (!series.drawing_3d_url && p.drawing_3d_url) series.drawing_3d_url = p.drawing_3d_url;
  });

  const allSeries = Array.from(seriesMap.values());
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = allSeries.filter(s => {
    const matchCat = activeCat === "All" || s.category === activeCat;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(search.toLowerCase()) ||
      s.models.some(m => m.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-toyo-dark py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-xs mb-2">Product Information</p>
          <h1 className="text-3xl font-black text-white">Product List</h1>
          <p className="text-gray-400 mt-1 text-sm">Diverse product line-up, multiple combinations, customer-selected motors</p>
        </div>
      </div>

      {/* Section header like TOYO site */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="bg-toyo-dark text-white text-sm font-bold px-4 py-2">
            Linear motion modules
          </div>
          <p className="text-sm text-gray-500">Diverse product line-up, multiple combinations, customer-selected motors</p>
        </div>
      </div>

      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search + Filters */}
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search series or models..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-toyo-red text-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Filter className="w-4 h-4" />
              <span>{filtered.length} series found</span>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 text-sm font-medium border transition-all ${
                  activeCat === cat
                    ? "bg-toyo-red text-white border-toyo-red"
                    : "bg-white text-gray-600 border-gray-300 hover:border-toyo-red hover:text-toyo-red"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Series Grid — 3 columns like reference */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-gray-200 animate-pulse">
                  <div className="bg-gray-200 h-6 mb-2" />
                  <div className="flex gap-4 p-4">
                    <div className="bg-gray-100 w-28 h-20 flex-shrink-0 rounded" />
                    <div className="flex-1 space-y-2 pt-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-3 bg-gray-100 rounded w-3/4" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Package className="w-10 h-10 mx-auto text-gray-200 mb-3" />
              <p>{products.length === 0 ? "No products available yet." : "No products found."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(series => (
                <div
                  key={series.name}
                  className="border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow"
                >
                  {/* Series Header */}
                  <div className="border-b border-gray-200 px-5 py-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900">{series.name}</h3>
                    {series.description && (
                      <p className="text-sm text-gray-500 mt-1">{series.description}</p>
                    )}
                  </div>

                  {/* Body: image + model list */}
                  <div className="flex gap-5 p-5">
                    {/* Image */}
                    <div className="w-40 flex-shrink-0 flex items-start justify-center">
                      {series.image_url ? (
                        <img
                          src={series.image_url}
                          alt={series.name}
                          className="w-full object-contain max-h-44 rounded"
                        />
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded">
                          <Package className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Model list */}
                    <div className="flex-1 min-w-0">
                      {series.models.length > 0 ? (
                        <ul>
                          {series.models.map(model => (
                            <li
                              key={model}
                              className="text-sm text-gray-800 py-2 border-b border-gray-100 last:border-b-0 hover:text-toyo-red cursor-pointer transition-colors"
                            >
                              {model}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No models listed</p>
                      )}
                    </div>
                  </div>

                  {/* Footer: download icons */}
                  <div className="px-5 pb-4 border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{series.category}</span>
                    <div className="flex items-center gap-3">
                      {series.catalog_url && (
                        <a
                          href={series.catalog_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download PDF Catalog"
                          className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity"
                        >
                          <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">PDF</div>
                          <Download className="w-3.5 h-3.5 text-gray-500" />
                        </a>
                      )}
                      {series.drawing_2d_url && (
                        <a
                          href={series.drawing_2d_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download 2D Drawing"
                          className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity"
                        >
                          <div className="bg-gray-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">2D</div>
                          <Download className="w-3.5 h-3.5 text-gray-500" />
                        </a>
                      )}
                      {series.drawing_3d_url && (
                        <a
                          href={series.drawing_3d_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download 3D Model"
                          className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity"
                        >
                          <div className="bg-gray-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">3D</div>
                          <Download className="w-3.5 h-3.5 text-gray-500" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
