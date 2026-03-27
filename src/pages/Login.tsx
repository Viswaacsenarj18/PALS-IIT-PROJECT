import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "@/config/api";
import logo from "@/images/logo.jpeg";

type Role = "farmer" | "tractor_owner" | "buyer";

const ROLES = [
  { id: "farmer", label: "Farmer" },
  { id: "tractor_owner", label: "Tractor Owner" },
  { id: "buyer", label: "Buyer" },
];

const ACCENT: Record<Role, string> = {
  farmer: "#16a34a",
  tractor_owner: "#d97706",
  buyer: "#2563eb",
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("farmer");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accent = ACCENT[role];

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(getApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.id);

        const r = data.user.role;
        if (r === "tractor_owner") navigate("/tractors");
        else if (r === "buyer") navigate("/marketplace");
        else navigate("/");
      } else {
        setError(data.message || t("auth.loginFailed"));
      }
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Farming"
        />
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 p-12 text-white">
          <h1 className="text-3xl font-bold">HillSmart 🌱</h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">

          <h1 className="text-3xl font-bold mb-4">
            {t("signIn")}
          </h1>

          {/* ROLE */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id as Role)}
                className={`p-2 border rounded-xl text-sm ${
                  role === r.id ? "bg-green-100 border-green-600" : ""
                }`}
              >
                {t(`role${r.id.charAt(0).toUpperCase() + r.id.slice(1)}`)}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              placeholder={t("email")}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />
            <input
              name="password"
              type="password"
              placeholder={t("password")}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <button
              style={{ background: accent }}
              className="w-full p-3 text-white rounded-xl"
              disabled={loading}
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <p className="text-sm mt-4 text-center">
            <Link to="/signup" className="text-green-600 font-bold">
              {t("signUpLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;