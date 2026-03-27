import { useState, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { getApiUrl } from "@/config/api";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
  createdBy?: string;
}

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

/* ═══════════════════════════════════════════════════════
   MINI TOAST SYSTEM  (no external dependency)
═══════════════════════════════════════════════════════ */
const ToastContainer = ({ toasts, remove }: { toasts: ToastItem[]; remove: (id: number) => void }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl
                    text-white text-sm font-semibold min-w-[220px] animate-slide-in
                    ${t.type === "success" ? "bg-green-600" : "bg-red-500"}`}
      >
        <span className="text-base">{t.type === "success" ? "✅" : "❌"}</span>
        <span className="flex-1">{t.message}</span>
        <button
          onClick={() => remove(t.id)}
          className="opacity-70 hover:opacity-100 text-lg leading-none"
        >
          ×
        </button>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════
   DELETE CONFIRM MODAL
═══════════════════════════════════════════════════════ */
const DeleteModal = ({
  product,
  onConfirm,
  onCancel,
}: {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Modal */}
    <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-pop-in">
      <div className="text-5xl mb-4">🗑️</div>
      <h2 className="text-xl font-extrabold text-gray-800 mb-2">Delete Product?</h2>
      <p className="text-gray-500 text-sm mb-1">
        You're about to permanently delete:
      </p>
      <p className="font-bold text-gray-800 mb-6 text-base">"{product.name}"</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600
                     hover:bg-gray-50 transition text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white
                     font-bold transition text-sm shadow-md"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════════════ */
const ProductCard = ({
  product,
  role,
  onEdit,
  onDelete,
}: {
  product: Product;
  role: string;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
                  overflow-hidden border border-gray-100 group flex flex-col">
    {/* Image */}
    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-gray-100 to-gray-200">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
          🛒
        </div>
      )}
      {/* Category badge */}
      {product.category && (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700
                         text-xs font-bold px-2.5 py-1 rounded-full shadow-sm capitalize">
          {product.category}
        </span>
      )}
      {/* Out of stock overlay */}
      {product.stock === 0 && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
            Out of Stock
          </span>
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">{product.name}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>

      {/* Price & Stock row */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-extrabold text-green-600">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full
                         ${product.stock > 10
                           ? "bg-green-100 text-green-700"
                           : product.stock > 0
                           ? "bg-yellow-100 text-yellow-700"
                           : "bg-red-100 text-red-600"}`}>
          Stock: {product.stock}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {/* Farmer: edit + delete */}
        {role === "farmer" && (
          <>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                         bg-amber-50 border-2 border-amber-200 text-amber-700 font-bold text-sm
                         hover:bg-amber-100 transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                         bg-red-50 border-2 border-red-200 text-red-600 font-bold text-sm
                         hover:bg-red-100 transition"
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT — ProductList (Farmer View)
═══════════════════════════════════════════════════════ */
const ProductList = () => {
  const navigate = useNavigate();

  const [products,    setProducts]    = useState<Product[]>([]);
  const [filtered,    setFiltered]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting,    setDeleting]    = useState(false);
  const [toasts,      setToasts]      = useState<ToastItem[]>([]);

  const role = localStorage.getItem("role") || "farmer";

  /* ── toast helper ── */
  const toast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  /* ── fetch ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(getApiUrl("/api/products"));
      const data = await res.json();
      if (res.ok) {
        setProducts(data.data || []);
      } else {
        setError(data.message || "Failed to load products");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── filter / search ── */
  useEffect(() => {
    let list = [...products];
    if (category !== "all") {
      list = list.filter((p) =>
        (p.category || "").toLowerCase() === category.toLowerCase()
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [products, search, category]);

  /* ── unique categories ── */
  const categories = [
    "all",
    ...Array.from(
      new Set(products.map((p) => p.category).filter(Boolean) as string[])
    ),
  ];

  /* ── delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(getApiUrl(`/api/products/${deleteTarget._id}`), {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        toast(`"${deleteTarget.name}" deleted successfully`, "success");
      } else {
        const data = await res.json();
        toast(data.message || "Failed to delete product", "error");
      }
    } catch {
      toast("Network error. Delete failed.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* ════════════════════════════════════════
     LOADING
  ════════════════════════════════════════ */
  if (loading) return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🌾</div>
        <p className="text-gray-500 font-medium">Loading marketplace...</p>
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     ERROR
  ════════════════════════════════════════ */
  if (error) return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow text-center max-w-sm w-full">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     MAIN RENDER
  ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f5f3ef] pb-12">
      {/* Toasts */}
      <ToastContainer toasts={toasts} remove={removeToast} />

      {/* Delete confirm modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row
                        sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">My Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {products.length} product{products.length !== 1 ? "s" : ""} listed
            </p>
          </div>
          <div className="flex gap-3">
            <NavLink
              to="/add-product"
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold
                         hover:bg-green-700 transition shadow-md text-sm"
            >
              + Add Product
            </NavLink>
            <button
              onClick={fetchProducts}
              className="bg-white border-2 border-gray-200 text-gray-600 px-4 py-2.5
                         rounded-xl font-bold hover:border-gray-300 transition text-sm"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">

        {/* ── Search + Filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search input */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl
                         text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-gray-600 text-lg"
              >
                ×
              </button>
            )}
          </div>

          {/* Category filter */}
          {categories.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 capitalize transition
                             ${category === cat
                               ? "bg-green-600 border-green-600 text-white"
                               : "bg-white border-gray-200 text-gray-600 hover:border-green-300"}`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Results count ── */}
        {(search || category !== "all") && (
          <p className="text-sm text-gray-500 mb-4">
            Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""}
            {search && <> for "<strong>{search}</strong>"</>}
            {category !== "all" && <> in <strong className="capitalize">{category}</strong></>}
          </p>
        )}

        {/* ── Product Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                role={role}
                onEdit={() => navigate(`/edit-product/${product._id}`)}
                onDelete={() => setDeleteTarget(product)}
              />
            ))}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-30">📦</div>
            <h3 className="text-lg font-bold text-gray-400 mb-1">No products found</h3>
            <p className="text-sm text-gray-400 mb-6">
              {search || category !== "all"
                ? "Try adjusting your search or filter."
                : "You haven't added any products yet."}
            </p>
            {!search && category === "all" && (
              <NavLink
                to="/add-product"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl
                           font-bold hover:bg-green-700 transition shadow-md"
              >
                + Add Your First Product
              </NavLink>
            )}
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease; }
        .animate-pop-in   { animation: pop-in  0.2s ease; }
      `}</style>
    </div>
  );
};

export default ProductList;