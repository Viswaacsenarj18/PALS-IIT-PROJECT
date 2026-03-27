import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/utils/apiClient";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Plus, Upload, Image, SwitchCamera, AlertCircle } from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  pricePerKg: number;
  totalQuantity: number;
  phone: string;
  category: string;
  image: File | null;
  imageUrl: string;
  imagePreview: string;
}

const AddProduct = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    pricePerKg: 0,
    totalQuantity: 0,
    phone: "",
    category: "",
    image: null,
    imageUrl: "",
    imagePreview: "",
  });

  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof ProductFormData]:
        name === "pricePerKg" || name === "totalQuantity"
          ? parseFloat(value) || 0
          : value,
    }));
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t("fileSizeError") || "File size must be less than 5MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError(t("fileTypeError") || "Only JPG, PNG, GIF, WebP allowed");
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
        imageUrl: "",
      }));
      setError("");
    }
  }, [t]);

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setFormData(prev => ({
      ...prev,
      imageUrl: url,
      imagePreview: url,
      image: null,
    }));
    if (url) setError("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError(t("productNameRequired") || "Product name required");
      setLoading(false);
      return;
    }
    if (formData.name.length < 3) {
      setError(t("productNameMin") || "Name too short");
      setLoading(false);
      return;
    }
    if (formData.pricePerKg <= 0) {
      setError(t("priceRequired") || "Price required");
      setLoading(false);
      return;
    }
    if (formData.totalQuantity <= 0) {
      setError(t("quantityRequired") || "Quantity required");
      setLoading(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError(t("phoneRequired") || "Phone required");
      setLoading(false);
      return;
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      setError(t("invalidPhone") || "Valid 10-digit phone required");
      setLoading(false);
      return;
    }
    if (!formData.category.trim()) {
      setError(t("categoryRequired") || "Category required");
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("pricePerKg", formData.pricePerKg.toString());
      submitData.append("totalQuantity", formData.totalQuantity.toString());
      submitData.append("phone", cleanPhone);
      submitData.append("category", formData.category.trim());

      // Image handling
      if (uploadMethod === "file" && formData.image) {
        submitData.append("image", formData.image);
      } else if (uploadMethod === "url" && formData.imageUrl.trim()) {
        submitData.append("imageUrl", formData.imageUrl.trim());
      }

      const token = localStorage.getItem("token");
      const data = await apiFetch("/api/products", {
        method: "POST",
        body: submitData,
      });

      if (data.success) {
        setSuccess(t("productAddedSuccess") || "Product added successfully!");
        setFormData({
          name: "",
          description: "",
          pricePerKg: 0,
          totalQuantity: 0,
          phone: "",
          category: "",
          image: null,
          imageUrl: "",
          imagePreview: "",
        });
        setTimeout(() => navigate("/marketplace" || "/my-products"), 2000);
      } else {
        setError(data.message || (t("productAddFailed") || "Failed to add product"));
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(t("networkError") || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = formData.pricePerKg * formData.totalQuantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              📦 {t("addProductTitle") || "Add New Product"}
            </CardTitle>
            <CardDescription className="text-green-100">
              {t("addProductDesc") || "List your farm products for sale"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800 leading-relaxed">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800 leading-relaxed font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("productName") || "Product Name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("productNamePlaceholder") || "e.g. Organic Tomatoes"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all text-base"
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("description") || "Description"}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t("descriptionPlaceholder") || "Describe your product..."}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all resize-vertical"
                  disabled={loading}
                  maxLength={500}
                />
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("pricePerKg") || "Price per Kg"} (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    value={formData.pricePerKg || ""}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all text-base"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("totalQuantity") || "Total Quantity"} (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalQuantity"
                    value={formData.totalQuantity || ""}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all text-base"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Total Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("totalCost") || "Total Cost"}
                </label>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100 rounded-xl text-center">
                  <p className="text-3xl font-bold text-green-700">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {totalPrice > 0 ? `${formData.totalQuantity}kg × ₹${formData.pricePerKg}/kg` : t("autoCalculated") || "Auto-calculated"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("phoneNumber") || "Phone Number"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all text-base"
                  disabled={loading}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("category") || "Category"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder={t("categoryPlaceholder") || "Vegetables, Fruits, Grains..."}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all text-base"
                  disabled={loading}
                />
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  🖼️ {t("productImage") || "Product Image"}
                </label>

                {/* Upload Method Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                  <Button
                    type="button"
                    variant={uploadMethod === "file" ? "default" : "ghost"}
                    className="flex-1 rounded-lg"
                    onClick={() => setUploadMethod("file")}
                    disabled={loading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t("uploadFile") || "Upload File"}
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === "url" ? "default" : "ghost"}
                    className="flex-1 rounded-lg"
                    onClick={() => setUploadMethod("url")}
                    disabled={loading}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {t("imageUrl") || "Image URL"}
                  </Button>
                </div>

                {/* Image Input */}
                {uploadMethod === "file" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-green-400 transition-all cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      disabled={loading}
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleImageUrlChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all text-base"
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Image Preview */}
                {formData.imagePreview && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-green-200">
                    <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <SwitchCamera className="h-4 w-4 text-green-600" />
                      {t("imagePreview") || "Image Preview"}
                    </p>
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview"
                      className="w-full max-w-sm max-h-64 object-cover rounded-xl shadow-md mx-auto"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 h-14"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t("addingProduct") || "Adding Product..."}
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    {t("listProduct") || "List Product for Sale"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
