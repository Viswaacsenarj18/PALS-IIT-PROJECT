import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserPlus,
  User,
  Phone,
  Mail,
  MapPin,
  Tractor,
  Hash,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Gauge,
  Fuel,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import apiFetch from "../utils/apiClient";
import { isAuthenticated, getStoredRole } from "../utils/auth";


interface FormData {
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  model: string;
  tractorNumber: string;
  horsepower: string;
  fuelType: string;
  rentPerHour: string;
  rentPerDay: string;
  isAvailable: boolean;
  imageFile: File | null;
  imagePreview: string | null;
}

interface FormErrors {
  [key: string]: string;
}

const TractorRegistration = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    model: "",
    tractorNumber: "",
    horsepower: "",
    fuelType: "Diesel",
    rentPerHour: "",
    rentPerDay: "",
    isAvailable: true,
    imageFile: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.ownerName.trim()) newErrors.ownerName = t("ownerNameRequired");
    if (!formData.email.trim()) newErrors.email = t("emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t("invalidEmail");
    if (!formData.phone.trim()) newErrors.phone = t("phoneRequired");
    if (!formData.location.trim()) newErrors.location = t("locationRequired");
    if (!formData.model.trim()) newErrors.model = t("modelRequired");
    if (!formData.tractorNumber.trim()) newErrors.tractorNumber = t("tractorNumberRequired");
    if (!formData.horsepower || Number(formData.horsepower) <= 0)
      newErrors.horsepower = t("invalidHorsepower");
    if (!formData.rentPerHour || Number(formData.rentPerHour) <= 0)
      newErrors.rentPerHour = t("invalidHourlyRate");
    if (!formData.rentPerDay || Number(formData.rentPerDay) <= 0)
      newErrors.rentPerDay = t("invalidDailyRate");
    if (!formData.imageFile) newErrors.image = t("tractorImageRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image upload handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("invalidImageType"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("imageTooLarge"));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result as string,
      }));
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };



  // Submit handler with image upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("pleaseFixErrors"));
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isAuthenticated()) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const role = getStoredRole();
      if (!["tractor_owner", "farmer"].includes(role)) {
        toast.error("Access denied. Tractor owners/farmers only.");
        navigate("/dashboard");
        return;
      }

      const fd = new FormData();
      fd.append("ownerName", formData.ownerName);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("location", formData.location);
      fd.append("model", formData.model);
      fd.append("tractorNumber", formData.tractorNumber);
      fd.append("horsepower", formData.horsepower);
      fd.append("fuelType", formData.fuelType);
      fd.append("rentPerHour", formData.rentPerHour);
      fd.append("rentPerDay", formData.rentPerDay);
      fd.append("isAvailable", formData.isAvailable.toString());
      if (formData.imageFile) fd.append("image", formData.imageFile);

      const data = await apiFetch("/api/tractors/register", {
        method: "POST",
        body: fd,
      });

      if (data.success) {
        toast.success(data.message || "Tractor registered successfully!");
        navigate("/tractors");
      } else {
        throw new Error(data.message || "Registration failed");
      }

    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || t("backendNotReachable"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("registerTractorTitle")}
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            {t("registerTractorDesc")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Owner Details Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                {t("ownerDetails")}
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("ownerName")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    placeholder={t("enterYourFullName")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.ownerName
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                    }`}
                  />
                </div>
                {errors.ownerName && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.ownerName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("email")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder={t("exampleEmail")}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("phoneNumber")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder={t("examplePhone")}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                          ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("location")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder={t("cityState")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.location
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                    }`}
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">{errors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tractor Details Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Tractor className="h-5 w-5 text-green-600" />
                {t("tractorDetails")}
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("tractorModel")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tractor className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      placeholder={t("exampleModel")}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.model
                          ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                      }`}
                    />
                  </div>
                  {errors.model && (
                    <p className="text-xs text-red-500 mt-1">{errors.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("tractorNumber")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.tractorNumber}
                      onChange={(e) => handleInputChange("tractorNumber", e.target.value)}
                      placeholder={t("exampleTractorNumber")}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.tractorNumber
                          ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                      }`}
                    />
                  </div>
                  {errors.tractorNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.tractorNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("horsepower")} (HP) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.horsepower}
                      onChange={(e) => handleInputChange("horsepower", e.target.value)}
                      placeholder={t("exampleHorsepower")}
                      min="0"
                      step="1"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.horsepower
                          ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                      }`}
                    />
                  </div>
                  {errors.horsepower && (
                    <p className="text-xs text-red-500 mt-1">{errors.horsepower}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("fuelType")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={formData.fuelType}
                      onChange={(e) => handleInputChange("fuelType", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 appearance-none bg-white"
                    >
                      <option value="Diesel">{t("diesel")}</option>
                      <option value="Petrol">{t("petrol")}</option>
                      <option value="Bio-Diesel">{t("bioDiesel")}</option>
                      <option value="Electric">{t("electric")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tractor Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("tractorImage")} <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  {!formData.imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 transition-colors bg-gray-50/50"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">{t("clickToUpload")}</p>
                      <p className="text-xs text-gray-400 mt-1">{t("imageFormatHint")}</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={formData.imagePreview}
                        alt="Tractor preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/70 text-white text-xs rounded-lg hover:bg-black/80 transition-colors"
                      >
                        {t("changeImage")}
                      </button>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.image}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-green-600" />
                {t("tractorRental")}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("rentPerHour")} (₹/hour) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.rentPerHour}
                      onChange={(e) => handleInputChange("rentPerHour", e.target.value)}
                      placeholder={t("exampleRentHour")}
                      min="0"
                      step="50"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.rentPerHour
                          ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                      }`}
                    />
                  </div>
                  {errors.rentPerHour && (
                    <p className="text-xs text-red-500 mt-1">{errors.rentPerHour}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("rentPerDay")} (₹/day) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.rentPerDay}
                      onChange={(e) => handleInputChange("rentPerDay", e.target.value)}
                      placeholder={t("exampleRentDay")}
                      min="0"
                      step="500"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.rentPerDay
                          ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-green-200 focus:border-green-500"
                      }`}
                    />
                  </div>
                  {errors.rentPerDay && (
                    <p className="text-xs text-red-500 mt-1">{errors.rentPerDay}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {t("availabilityStatus")}
                  </h3>
                  <p className="text-sm text-gray-500">{t("setAvailable")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange("isAvailable", !formData.isAvailable)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.isAvailable ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all ${
                      formData.isAvailable ? "left-7" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("registering")}
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                {t("registerTractor")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TractorRegistration;