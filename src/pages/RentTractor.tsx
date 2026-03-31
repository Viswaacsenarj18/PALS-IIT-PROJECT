import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApiUrl } from "@/config/api";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
interface Tractor {
  _id: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  model: string;
  tractorNumber: string;
  horsepower: number;
  fuelType: string;
  rentPerHour: number;
  rentPerDay: number;
  isAvailable: boolean;
  images?: string[];
  description?: string;
}

type RentalType = "hourly" | "daily";

/* ═══════════════════════════════════════════════════════
   SMALL ICON COMPONENTS
═══════════════════════════════════════════════════════ */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
             19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67
             A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
             c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91
             a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45
             c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconFuel = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 22V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
    <path d="M17 9h1a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v1"/>
    <line x1="3" y1="22" x2="19" y2="22"/>
    <line x1="7" y1="6" x2="13" y2="6"/>
  </svg>
);
const IconHash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="9" x2="20" y2="9"/>
    <line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/>
    <line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════
   TODAY STRING  — for min date on date picker
═══════════════════════════════════════════════════════ */
const todayStr = () => new Date().toISOString().split("T")[0];

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
const RentTractor = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* ── state ── */
  const [tractor,     setTractor]     = useState<Tractor | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");

  const [rentalType,  setRentalType]  = useState<RentalType>("daily");
  const [duration,    setDuration]    = useState(1);
  const [startDate,   setStartDate]   = useState("");
  const [startTime,   setStartTime]   = useState("08:00");
  const [renterName,  setRenterName]  = useState("");
  const [renterEmail, setRenterEmail] = useState("");

  /* ── fetch tractor ── */
  useEffect(() => {
    const fetchTractor = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res   = await fetch(getApiUrl(`/api/tractors/${id}`), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data  = await res.json();
        if (res.ok && data.success) {
          setTractor(data.data);
        } else {
          setError(data.message || "Failed to load tractor details.");
        }
      } catch (err: any) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTractor();
  }, [id]);

  /* ── computed total cost — NaN-safe ── */
  const ratePerUnit =
    tractor
      ? rentalType === "hourly"
        ? Number(tractor.rentPerHour) || 0
        : Number(tractor.rentPerDay)  || 0
      : 0;

  const totalCost = ratePerUnit * duration;

  /* ── submit ── */
  const handleSubmit = async () => {
    setError("");

    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    if (!renterName.trim()) {
      setError("Please enter your name.");
      return;
    }

    // ✅ FIX 1: Added email validation
    if (!renterEmail.trim()) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(renterEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to rent a tractor.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(getApiUrl("/api/tractors/confirm-rental"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // ✅ FIX 2: Added renterEmail and startTime to the POST body
        body: JSON.stringify({
          tractorId: tractor!._id,
          renterName: renterName.trim(),
          renterEmail: renterEmail.trim(),
          startDate,
          startTime,
          rentalType,
          duration,
          totalCost,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("✅ Rental confirmed! Confirmation emails sent.");
        setTimeout(() => navigate("/rent-tractor"), 2500);
      } else {
        setError(data.message || "Failed to confirm rental.");
      }
    } catch (err: any) {
      setError("Network error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ════════════════════════════════════════
     LOADING STATE
  ════════════════════════════════════════ */
  if (loading) return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🚜</div>
        <p className="text-gray-500 font-medium">Loading tractor details...</p>
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     ERROR STATE
  ════════════════════════════════════════ */
  if (error && !tractor) return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow text-center max-w-md w-full">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     MAIN RENDER
  ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f5f3ef] pb-12">

      {/* ── Back navigation ── */}
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition font-medium"
        >
          <IconArrow /> Back to listing
        </button>
      </div>

      {/* ── Success banner ── */}
      {success && (
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700 font-semibold text-sm">
            {success}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ════════════════════════════════
            LEFT COLUMN — Tractor Details
        ════════════════════════════════ */}
        <div className="space-y-4">

          {/* Tractor Image / Hero */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200
                            h-56 flex items-center justify-center">
             {tractor?.images && tractor.images.length > 0 ? (
  <img
    src={tractor.images[0]}
    alt={tractor.model}
    className="h-full w-full object-cover"
  />
) : tractor?.image ? (
  <img
    src={tractor.image}
    alt={tractor.model}
    className="h-full w-full object-cover"
  />
) : (
  <div className="h-full w-full flex items-center justify-center bg-gray-200">
    <p className="text-gray-500 text-sm font-medium">
      No Image Available
    </p>
  </div>
)}
              {/* Availability badge */}
              <div className={`absolute top-3 right-3 flex items-center gap-1.5
                              px-3 py-1.5 rounded-full text-xs font-bold shadow
                              ${tractor?.isAvailable
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"}`}>
                <span className={`w-2 h-2 rounded-full ${tractor?.isAvailable ? "bg-green-500" : "bg-red-500"}`}/>
                {tractor?.isAvailable ? "Available" : "Not Available"}
              </div>
            </div>

            {/* Model + location */}
            <div className="p-5">
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                {tractor?.model || "—"}
              </h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <IconPin />
                {tractor?.location || "—"}
              </div>
            </div>
          </div>

          {/* Owner / Registration Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              Registration
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-gray-400"><IconUser /></span>
                <span className="font-medium">{tractor?.ownerName || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-gray-400"><IconPhone /></span>
                <span>{tractor?.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-gray-400"><IconHash /></span>
                <span className="font-mono font-semibold tracking-wider">
                  {tractor?.tractorNumber || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Power */}
              <div className="bg-orange-50 rounded-xl p-3.5 flex items-center gap-3">
                <span className="text-orange-500"><IconZap /></span>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Power</p>
                  <p className="text-sm font-bold text-gray-800">
                    {tractor?.horsepower ? `${tractor.horsepower} HP` : "—"}
                  </p>
                </div>
              </div>
              {/* Fuel */}
              <div className="bg-blue-50 rounded-xl p-3.5 flex items-center gap-3">
                <span className="text-blue-500"><IconFuel /></span>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Fuel</p>
                  <p className="text-sm font-bold text-gray-800">
                    {tractor?.fuelType || "—"}
                  </p>
                </div>
              </div>
              {/* Hourly rate */}
              <div className="bg-green-50 rounded-xl p-3.5 flex items-center gap-3">
                <span className="text-green-600"><IconClock /></span>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Per Hour</p>
                  <p className="text-sm font-bold text-gray-800">
                    {tractor?.rentPerHour != null
                      ? `₹ ${Number(tractor.rentPerHour).toLocaleString("en-IN")}`
                      : "—"}
                  </p>
                </div>
              </div>
              {/* Daily rate */}
              <div className="bg-purple-50 rounded-xl p-3.5 flex items-center gap-3">
                <span className="text-purple-600"><IconCalendar /></span>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Per Day</p>
                  <p className="text-sm font-bold text-gray-800">
                    {tractor?.rentPerDay != null
                      ? `₹ ${Number(tractor.rentPerDay).toLocaleString("en-IN")}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════
            RIGHT COLUMN — Confirm Rental
        ════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Confirm Rental</h2>

          {/* Error banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl
                            text-red-700 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* ── Rental Type toggle ── */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-500 uppercase
                               tracking-wide mb-2">
              Rental Details
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Hourly */}
              <button
                type="button"
                onClick={() => { setRentalType("hourly"); setDuration(1); }}
                className={`flex flex-col items-center py-3.5 px-4 rounded-xl border-2
                            transition-all duration-200 font-medium
                            ${rentalType === "hourly"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"}`}
              >
                <IconClock />
                <span className="text-sm font-bold mt-1">Hourly</span>
                <span className="text-xs mt-0.5">
                  {tractor?.rentPerHour != null
                    ? `₹ ${Number(tractor.rentPerHour).toLocaleString("en-IN")}/hr`
                    : "—"}
                </span>
              </button>

              {/* Daily */}
              <button
                type="button"
                onClick={() => { setRentalType("daily"); setDuration(1); }}
                className={`flex flex-col items-center py-3.5 px-4 rounded-xl border-2
                            transition-all duration-200 font-medium
                            ${rentalType === "daily"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"}`}
              >
                <IconCalendar />
                <span className="text-sm font-bold mt-1">Daily</span>
                <span className="text-xs mt-0.5">
                  {tractor?.rentPerDay != null
                    ? `₹ ${Number(tractor.rentPerDay).toLocaleString("en-IN")}/day`
                    : "—"}
                </span>
              </button>
            </div>
          </div>

          {/* ── Duration stepper ── */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-500 uppercase
                               tracking-wide mb-2">
              Duration ({rentalType === "hourly" ? "hourly" : "daily"})
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setDuration((d) => Math.max(1, d - 1))}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-gray-50
                           text-gray-700 text-lg font-bold hover:border-green-400
                           hover:bg-green-50 transition flex items-center justify-center"
              >
                −
              </button>
              <span className="flex-1 text-center text-xl font-bold text-gray-800">
                {duration}
                <span className="text-sm font-medium text-gray-400 ml-1">
                  {rentalType === "hourly" ? "hour(s)" : "day(s)"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setDuration((d) => Math.min(rentalType === "hourly" ? 24 : 30, d + 1))}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-gray-50
                           text-gray-700 text-lg font-bold hover:border-green-400
                           hover:bg-green-50 transition flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* ── Date & Time ── */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase
                                 tracking-wide mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                min={todayStr()}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl
                           text-sm bg-gray-50 focus:outline-none focus:ring-2
                           focus:ring-green-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase
                                 tracking-wide mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl
                           text-sm bg-gray-50 focus:outline-none focus:ring-2
                           focus:ring-green-400 transition"
              />
            </div>
          </div>

          {/* ── Renter Name ── */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase
                               tracking-wide mb-1.5">
              Renter Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={renterName}
              onChange={(e) => setRenterName(e.target.value)}
              placeholder="Enter your full name & phone number"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
                         text-sm bg-gray-50 focus:outline-none focus:ring-2
                         focus:ring-green-400 transition"
            />
          </div>

          {/* ── Renter Email ── */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-500 uppercase
                               tracking-wide mb-1.5">
              Renter Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={renterEmail}
              onChange={(e) => setRenterEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
                         text-sm bg-gray-50 focus:outline-none focus:ring-2
                         focus:ring-green-400 transition"
            />
          </div>

          {/* ── Cost Summary ── */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
              <span className="capitalize">{rentalType}</span>
              <span>
                ₹ {ratePerUnit > 0
                  ? Number(ratePerUnit).toLocaleString("en-IN")
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
              <span>Duration</span>
              <span>
                {duration} {rentalType === "hourly" ? "hour(s)" : "day(s)"}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total Cost</span>
              <span className="text-xl font-extrabold text-green-600">
                {totalCost > 0
                  ? `₹ ${totalCost.toLocaleString("en-IN")}`
                  : "₹ 0"}
              </span>
            </div>
          </div>

          {/* ── Submit Button ── */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !tractor?.isAvailable}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all
                        shadow-md disabled:cursor-not-allowed
                        ${tractor?.isAvailable
                          ? "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300"
                          : "bg-gray-300 text-gray-500"}`}
          >
            {submitting
              ? "Confirming..."
              : !tractor?.isAvailable
              ? "Not Available"
              : "Confirm Rental"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            By confirming, you agree to our rental terms and conditions
          </p>
        </div>

      </div>
    </div>
  );
};

export default RentTractor;