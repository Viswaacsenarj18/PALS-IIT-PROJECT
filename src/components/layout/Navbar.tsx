import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Tractor,
  UserPlus,
  ShoppingCart,
  ChevronDown,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/images/logo.jpeg";
import { logout } from "@/utils/auth";

/* AUTH */
const isAuthenticated = () => {
  return !!localStorage.getItem("token") && !!localStorage.getItem("userId");
};

const getUserRole = () => {
  return localStorage.getItem("role") || "";
};

const Navbar = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const loggedIn = isAuthenticated();
  const userRole = getUserRole();

  /* 🔥 IMPORTANT: INSIDE COMPONENT */
  const navItems = {
    farmer: [
      { to: "/", label: t("dashboard"), icon: LayoutDashboard },
      { to: "/sensors", label: t("sensors"), icon: Activity },
      { to: "/marketplace", label: t("marketplace"), icon: ShoppingCart },
      { to: "/tractors", label: t("tractors"), icon: Tractor },
      { to: "/register", label: t("register"), icon: UserPlus },
    ],
    tractor_owner: [
      { to: "/register", label: t("register"), icon: UserPlus },
      { to: "/tractors", label: t("tractors"), icon: Tractor },
    ],
    buyer: [
      { to: "/marketplace", label: t("marketplace"), icon: ShoppingCart },
    ],
    admin: [
      { to: "/admin", label: t("admin"), icon: ShieldAlert },
    ],
  }[userRole] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const languages = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "hi", label: "हिंदी" },
];
  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">

        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3">
<img src={logo} alt="HillSmart Logo" className="h-8 sm:h-10 w-10 rounded-xl" />
          <h1 className="font-bold text-lg">HillSmart</h1>
        </NavLink>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 -mr-1"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          {/* ROLE */}
          {loggedIn && (
            <div className="px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              👤 {t(`role.${userRole}`)}
            </div>
          )}

          {/* NAV ITEMS - HIDDEN MOBILE */}
          <div className="hidden md:flex items-center gap-1 md:gap-2">
            {loggedIn &&
              navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-3 md:py-2 rounded-md md:rounded hover:bg-gray-100 text-sm transition-colors"
                >
                  <item.icon size={14} className="md:w-4 md:h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </NavLink>
              ))}
          </div>

          {/* LANGUAGE */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 md:gap-2 p-1 rounded hover:bg-gray-100"
            >
              <span className="text-xs md:text-sm">🌐</span>
              <span className="text-xs md:text-sm">{i18n.language.toUpperCase()}</span>
              <ChevronDown size={12} className="md:w-3.5 md:h-3.5" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1 md:mt-2 bg-white border rounded-lg md:rounded shadow-lg p-1 md:p-2 min-w-[120px]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      localStorage.setItem("i18nextLng", lang.code);
                      setIsLangOpen(false);
                    }}
                    className="block w-full text-left px-2 py-1.5 md:px-3 md:py-1 text-xs md:text-sm hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AUTH */}
          {!loggedIn ? (
            <>
              <NavLink 
                to="/login" 
                className="hidden sm:inline px-3 py-1.5 md:px-3 md:py-2 rounded-md hover:bg-gray-100 text-sm transition-colors"
              >
                {t("login")}
              </NavLink>
              <NavLink 
                to="/signup" 
                className="bg-green-600 text-white px-3 py-1.5 md:px-3 md:py-2 rounded-md hover:bg-green-700 text-sm font-semibold transition-colors shadow-sm"
              >
                {t("signup")}
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-md text-xs md:text-sm font-semibold transition-colors shadow-sm"
            >
              {t("logout")}
            </button>
          )}
        </div>

        {/* MOBILE MENU */}
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsMobileOpen(false)}>
            <div className="bg-white w-64 h-full absolute right-0 shadow-2xl p-4">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold">Menu</h2>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Role */}
              {loggedIn && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm font-semibold text-blue-800">👤 {t(`role.${userRole}`)}</p>
                </div>
              )}

              {/* Nav Items */}
              {loggedIn && navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 mb-2 text-lg"
                >
                  <item.icon size={24} />
                  {item.label}
                </NavLink>
              ))}

              {/* Auth Mobile */}
              {!loggedIn ? (
                <div className="space-y-2 mt-4 pt-4 border-t">
                  <NavLink 
                    to="/login" 
                    onClick={() => setIsMobileOpen(false)}
                    className="block p-4 rounded-xl hover:bg-blue-50 text-blue-600 font-semibold border-2 border-blue-200"
                  >
                    🔐 {t("login")}
                  </NavLink>
                  <NavLink 
                    to="/signup" 
                    onClick={() => setIsMobileOpen(false)}
                    className="block w-full bg-green-600 text-white p-4 rounded-xl font-bold text-center hover:bg-green-700 shadow-lg"
                  >
                    ➕ {t("signup")}
                  </NavLink>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileOpen(false);
                  }}
                  className="w-full bg-red-500 text-white p-4 rounded-xl font-bold hover:bg-red-600 mt-4 shadow-lg"
                >
                  🚪 {t("logout")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;