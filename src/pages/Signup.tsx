import { useState } from "react";
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

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("farmer");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const accent = ACCENT[role];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (form.password.length < 6) {
      setError(t('auth.minPassword'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl("/api/auth/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message || t('auth.signupFailed'));
      }
    } catch {
      setError(t('common.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row animate-fade-in">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Farming"
        />
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 p-12 flex flex-col justify-between text-white">
          <div className="flex items-center gap-3">
            <img src={logo} className="h-10 w-10 rounded-xl" alt="HillSmart Logo" />
            <h1 className="font-black text-lg">HillSmart</h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-3">
              {t('auth.createAccount')} 🚀
            </h2>
            <p className="text-white/70 text-sm">
              {t('auth.joinPlatform')}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white">

        <div className="w-full max-w-sm">

          {/* TITLE */}
          <h1 className="text-3xl font-black mb-2">{t('auth.createAccount')}</h1>
          <p className="text-gray-400 mb-6">{t('auth.joinPlatform')}</p>

          {/* ROLE */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id as Role)}
                style={{
                  borderColor: role === r.id ? ACCENT[r.id as Role] : "#e5e7eb",
                  color: role === r.id ? ACCENT[r.id as Role] : "#6b7280",
                  background:
                    role === r.id ? `${ACCENT[r.id as Role]}10` : "transparent",
                }}
                className="py-2 rounded-xl border-2 text-sm font-bold transition-all"
              >
                {t(`role.${r.id}`)}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="bg-red-50 text-red-600 p-2 rounded">
                {error}
              </div>
            )}

            <input
              name="name"
              placeholder={t('auth.fullName')}
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              name="email"
              placeholder={t('auth.email')}
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              name="phone"
              placeholder={t('auth.phoneNumber')}
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder={t('auth.password')}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3"
              >
                👁
              </button>
            </div>

            <div className="relative">
              <input
                type={showConf ? "text" : "password"}
                name="confirmPassword"
                placeholder={t('auth.confirmPassword')}
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowConf(!showConf)}
                className="absolute right-3 top-3"
              >
                👁
              </button>
            </div>

            <button
              type="submit"
              style={{ background: accent }}
              className="w-full py-3 text-white rounded-xl font-bold"
            >
              {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </button>
          </form>

          <p className="text-sm text-center mt-5">
            {t('auth.haveAccount')}{" "}
            <Link to="/login" className="font-bold text-green-600">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
