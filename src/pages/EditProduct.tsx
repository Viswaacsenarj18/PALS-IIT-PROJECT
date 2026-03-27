import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "@/utils/apiClient";

const CATEGORIES = [
  "Seeds",
  "Fertilizers",
  "Pesticides",
  "Tools",
  "Equipment",
  "Organic",
  "Other",
];

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerKg: "",
    totalQuantity: "",
    totalPrice: "",
    phone: "",
    category: "",
    imageUrl: "",
  });

  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageMode, setImageMode] = useState<"keep" | "file" | "url">("keep");

  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await apiFetch(`/api/products/${id}`);
        if (data.success) {
          const p = data.data;
          setForm({
            name: p.name || "",
            description: p.description || "",
            pricePerKg: String((p.pricePerKg ?? p.price) || ""),
            totalQuantity: String((p.totalQuantity ?? p.stock) || ""),
            totalPrice: String(p.totalPrice || ""),
            phone: p.phone || "",
            category: p.category || "",
            imageUrl: "",
          });
          setExistingImage(p.image || "");
          setImagePreview(p.image || "");
        } else {
          setError(data.message || "Failed to load product.");
        }
      } catch {
        setError("Network error. Could not load product.");
      } finally {
        setFetchLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  useEffect(() => {
    const price = Number(form.pricePerKg);
    const qty = Number(form.totalQuantity);
    if (price && qty) {
      setForm((prev) => ({
        ...prev,
        totalPrice: String(price * qty),
      }));
    }
  }, [form.pricePerKg, form.totalQuantity]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "imageUrl" && imageMode === "url") {
      setImagePreview(value);
    }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const switchMode = (mode: "keep" | "file" | "url") => {
    setImageMode(mode);
    setImageFile(null);
    if (mode === "keep") {
      setImagePreview(existingImage);
      setForm((f) => ({ ...f, imageUrl: "" }));
    } else if (mode === "file") {
      setImagePreview("");
    } else {
      setImagePreview(form.imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) { setError("Product name is required."); return; }
    if (!form.pricePerKg) { setError("Price per KG is required."); return; }
    if (!form.totalQuantity) { setError("Total Quantity is required."); return; }
    if (Number(form.pricePerKg) <= 0) { setError("Price must be greater than 0."); return; }
    if (Number(form.totalQuantity) < 0) { setError("Quantity cannot be negative."); return; }
    if (!form.phone.trim()) { setError("Phone number is required for buyers to contact."); return; }

    const token = localStorage.getItem("token");
    if (!token) { setError("You must be logged in."); return; }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("pricePerKg", form.pricePerKg);
      formData.append("totalQuantity", form.totalQuantity);
      formData.append("totalPrice", form.totalPrice);
      formData.append("phone", form.phone);
      formData.append("category", form.category);

      if (imageMode === "file" && imageFile) {
        formData.append("image", imageFile);
      } else if (imageMode === "url" && form.imageUrl.trim()) {
        formData.append("imageUrl", form.imageUrl.trim());
      }

      const data = await apiFetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (data.success) {
        setSuccess("✅ Product updated successfully!");
        setTimeout(() => navigate("/products"), 1500);
      } else {
        setError(data.message || "Failed to update product.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (fetchLoading) return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">📦</div>
        <p className="text-gray-500 font-medium">Loading product...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f3ef] pb-12">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate("/products")}
            className="text-gray-400 hover:text-gray-700 transition text-xl font-bold"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-800">Edit Product</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Update product details — changes go live immediately
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-3.5 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-3.5 text-sm font-medium">
              {success}
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Product Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Price per KG (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerKg"
                  value={form.pricePerKg}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Total Quantity (KG) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="totalQuantity"
                  value={form.totalQuantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Total Price (Auto) <span className="text-gray-400">(₹)</span>
              </label>
              <input
                type="number"
                value={form.totalPrice}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Phone Number (for buyers) <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Organic Fertilizers"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Product Image
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => switchMode("keep")}
                className={`py-2.5 rounded-xl border-2 text-xs font-bold transition
                           ${imageMode === "keep" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                🔒 Keep Current
              </button>
              <button
                type="button"
                onClick={() => switchMode("file")}
                className={`py-2.5 rounded-xl border-2 text-xs font-bold transition
                           ${imageMode === "file" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                📁 Upload New
              </button>
              <button
                type="button"
                onClick={() => switchMode("url")}
                className={`py-2.5 rounded-xl border-2 text-xs font-bold transition
                           ${imageMode === "url" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                🔗 New URL
              </button>
            </div>

            {imageMode === "keep" && (
              <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center h-44">
                {existingImage ? (
                  <img src={existingImage} alt="current" className="max-h-44 object-contain" />
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2 opacity-30">🖼️</div>
                    <p className="text-xs">No image currently set</p>
                  </div>
                )}
              </div>
            )}

            {imageMode === "file" && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="max-h-40 rounded-xl object-contain mb-3" />
                ) : (
                  <div className="text-5xl mb-3 opacity-30 group-hover:opacity-50 transition">🖼️</div>
                )}
                <p className="text-sm font-semibold text-gray-500">
                  {imageFile ? imageFile.name : "Click or drag & drop a new image"}
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF — max 5 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFilePick}
                  className="hidden"
                />
              </div>
            )}

            {imageMode === "url" && (
              <div className="space-y-3">
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                {imagePreview && (
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={imagePreview}
                      alt="URL preview"
                      className="w-full max-h-48 object-cover"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition shadow-md text-sm disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
