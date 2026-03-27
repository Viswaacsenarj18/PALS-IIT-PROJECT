import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/utils/apiClient";

interface Product {
  _id: string;
  name: string;
  description: string;
  pricePerKg: number;
  totalQuantity: number;
  totalPrice: number;
  image?: string;
  category?: string;
  phone?: string;
  seller?: {
    _id: string;
    name: string;
    phone?: string;
  };
  createdAt: string;
}

type SortKey = "newest" | "price-asc" | "price-desc" | "name";

/* ── Roles that can SELL (manage products) ─────────────── */
const SELLER_ROLES = ["farmer", "ecommerce"];

const Marketplace = () => {
  const navigate  = useNavigate();
  const role      = localStorage.getItem("role") || "";
  const userId    = localStorage.getItem("userId") || "";
  const isSeller  = SELLER_ROLES.includes(role);

  const [products,     setProducts]     = useState<Product[]>([]);
  const [filtered,     setFiltered]     = useState<Product[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [category,     setCategory]     = useState("all");
  const [sort,         setSort]         = useState<SortKey>("newest");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting,     setDeleting]     = useState(false);
  const [toasts,       setToasts]       = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);

  /* ══════════════════════════════════════════
     TOAST HELPERS
  ══════════════════════════════════════════ */
  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  /* ══════════════════════════════════════════
     FETCH PRODUCTS
     - Seller roles: fetch only their own products
     - Buyers / renters: fetch all products
  ══════════════════════════════════════════ */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = isSeller
        ? `/api/products?seller=${userId}`
        : `/api/products`;

      const data = await apiFetch(endpoint);

      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.message || "Failed to load products.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isSeller, userId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ══════════════════════════════════════════
     FILTER + SORT
  ══════════════════════════════════════════ */
  useEffect(() => {
    let list = [...products];

    if (category !== "all")
      list = list.filter(
        (p) => (p.category || "").toLowerCase() === category.toLowerCase()
      );

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        list.sort((a, b) => a.pricePerKg - b.pricePerKg);
        break;
      case "price-desc":
        list.sort((a, b) => b.pricePerKg - a.pricePerKg);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFiltered(list);
  }, [products, search, category, sort]);

  const categories = [
    "all",
    ...Array.from(
      new Set(products.map((p) => p.category).filter(Boolean) as string[])
    ),
  ];

  const sortLabels: Record<SortKey, string> = {
    newest:       "Newest",
    "price-asc":  "Price: Low → High",
    "price-desc": "Price: High → Low",
    name:         "Name A–Z",
  };

  /* ══════════════════════════════════════════
     DELETE PRODUCT (seller only)
  ══════════════════════════════════════════ */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const data = await apiFetch(`/api/products/${deleteTarget._id}`, {
        method: "DELETE",
      });

      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        showToast(`"${deleteTarget.name}" deleted!`, "success");
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* ══════════════════════════════════════════
     BUYER CONTACT HELPERS
  ══════════════════════════════════════════ */
  const getPhone = (product: Product): string | null =>
    product.seller?.phone || product.phone || null;

  const formatWhatsApp = (phone: string): string => {
    let cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
    if (cleaned.length === 10) return `91${cleaned}`;
    if (cleaned.startsWith("91") && cleaned.length === 12) return cleaned;
    return cleaned;
  };

  const handleWhatsApp = (product: Product) => {
    const phone = getPhone(product);
    if (!phone) { alert("Seller's phone number is not available."); return; }
    const message =
      `Hi, I'm interested in your product from HillSmart Marketplace:\n\n` +
      `Product: ${product.name}\n` +
      `Price: ₹${product.pricePerKg}/kg\n` +
      `Quantity Available: ${product.totalQuantity} kg\n` +
      `Total Price: ₹${product.totalPrice}\n\n` +
      `Please let me know if this is still available.`;
    window.open(`https://wa.me/${formatWhatsApp(phone)}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCall = (product: Product) => {
    const phone = getPhone(product);
    if (!phone) { alert("Seller's phone number is not available."); return; }
    window.open(`tel:${phone.replace(/[^0-9]/g, "")}`, "_blank");
  };

  /* ══════════════════════════════════════════
     SHARED STATES
  ══════════════════════════════════════════ */
  if (loading) return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🌾</div>
        <p className="text-gray-500 font-medium">Loading marketplace...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow max-w-sm w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     SELLER VIEW  (farmer | ecommerce)
  ══════════════════════════════════════════ */
  if (isSeller) return (
    <div className="min-h-screen bg-[#f5f3ef] pb-12">

      {/* TOASTS */}
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl text-white shadow-2xl flex items-center gap-3
              ${t.type === "success" ? "bg-green-600" : "bg-red-500"}`}
          >
            <span>{t.type === "success" ? "✅" : "❌"}</span>
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-auto text-lg">×</button>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-bold mb-2">Delete "{deleteTarget.name}"?</h2>
            <p className="text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-extrabold mb-2">
            {role === "ecommerce" ? "🛒 My Shop" : "👨‍🌾 My Marketplace"}
          </h1>
          <p className="text-green-100 max-w-md mx-auto">
            Manage your farm products — add, edit, delete
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">

        {/* CONTROLS */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your products..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchProducts}
              className="px-6 py-4 rounded-2xl border border-gray-200 hover:bg-gray-50 font-bold whitespace-nowrap"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-green-700 whitespace-nowrap"
            >
              ➕ Add Product
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-3 rounded-xl font-bold border-2 transition-all capitalize ${
                category === cat
                  ? "bg-green-600 border-green-600 text-white shadow-md"
                  : "border-gray-200 hover:border-green-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6 opacity-20">📦</div>
            <h2 className="text-2xl font-bold text-gray-500 mb-4">No products yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start by adding your first product to the marketplace.
            </p>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700"
            >
              ➕ Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-6 border border-gray-100"
              >
                {/* IMAGE */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-50 to-gray-100 group">
                  <img
                    src={product.image || "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=No+Image";
                    }}
                  />
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                      {product.category}
                    </span>
                  )}
                  {product.totalQuantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {product.description || "No description available"}
                </p>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-extrabold text-green-600">
                    ₹{product.pricePerKg?.toLocaleString()}/kg
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.totalQuantity > 10
                      ? "bg-green-100 text-green-700"
                      : product.totalQuantity > 0
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {product.totalQuantity > 0 ? `${product.totalQuantity}kg` : "Out of Stock"}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-5">
                  Total: ₹{product.totalPrice?.toLocaleString()}
                </div>

                {/* SELLER ACTIONS */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(product)}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     BUYER / PUBLIC VIEW
     (tractor_renter | tractor_owner | any other role)
  ══════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f5f3ef] pb-12">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-extrabold mb-1">🌾 HillSmart Marketplace</h1>
          <p className="text-green-100 text-sm">
            Fresh farm products, sourced directly from local farmers
          </p>

          {/* SEARCH */}
          <div className="relative mt-5 max-w-lg mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xl"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border-2 capitalize transition ${
                  category === cat
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <option key={key} value={key}>{sortLabels[key]}</option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          {filtered.length === 0
            ? "No products found"
            : <>Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
              {search && <> for "<strong>{search}</strong>"</>}
              {category !== "all" && <> in <strong className="capitalize">{category}</strong></>}
            </>
          }
        </p>

        {/* PRODUCTS */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100 group flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden h-52 bg-gradient-to-br from-green-50 to-emerald-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-25">🌿</div>
                  )}
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm capitalize">
                      {product.category}
                    </span>
                  )}
                  {product.totalQuantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.totalQuantity > 0 && product.totalQuantity <= 10 && (
                    <span className="absolute top-3 right-3 bg-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      Only {product.totalQuantity} kg left!
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2 flex-1">
                    {product.description || "No description available"}
                  </p>
                  {product.seller?.name && (
                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <span>👨‍🌾</span> {product.seller.name}
                    </p>
                  )}

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-extrabold text-green-600">
                      ₹{Number(product.pricePerKg).toLocaleString("en-IN")}/kg
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      product.totalQuantity > 10
                        ? "bg-green-100 text-green-700"
                        : product.totalQuantity > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {product.totalQuantity > 0 ? `${product.totalQuantity} kg` : "Out of stock"}
                    </span>
                  </div>

                  {product.totalPrice > 0 && (
                    <p className="text-xs text-gray-500 mb-3">
                      Total: ₹{Number(product.totalPrice).toLocaleString("en-IN")}
                    </p>
                  )}

                  {/* CONTACT BUTTONS */}
                  <div className="space-y-2 mt-auto pt-2">
                    <button
                      onClick={() => handleCall(product)}
                      disabled={!getPhone(product) || product.totalQuantity === 0}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                    >
                      📞 Call Seller
                    </button>
                    <button
                      onClick={() => handleWhatsApp(product)}
                      disabled={!getPhone(product) || product.totalQuantity === 0}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                    >
                      💬 Message on WhatsApp
                    </button>
                    {getPhone(product) && (
                      <p className="text-xs text-center text-gray-400 mt-1">
                        📱 {getPhone(product)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-30">🛒</div>
            <h3 className="text-lg font-bold text-gray-400 mb-1">No products found</h3>
            <p className="text-sm text-gray-400">
              {search || category !== "all"
                ? "Try a different search or category."
                : "No products are listed yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;