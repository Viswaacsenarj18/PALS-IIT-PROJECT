import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Marketplace from "./pages/Marketplace";
import BuyerDashboard from "./pages/BuyerDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SensorDetails from "./pages/SensorDetails";
import TractorListing from "./pages/TractorListing";
import TractorRegistration from "./pages/TractorRegistration";
import RentTractor from "./pages/RentTractor";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import BuyProduct from "./pages/BuyProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const getRole   = () => localStorage.getItem("role")   || "";
const getUserId = () => localStorage.getItem("userId") || "";

/* ══════════════════════════════════════════════════════════
   ROLE GUARD
══════════════════════════════════════════════════════════ */
const RoleRoute = ({
  element,
  allowed,
}: {
  element: JSX.Element;
  allowed: string[];
}) => {
  const role = getRole();

  if (allowed.includes(role)) return element;

  // Redirect based on role
  if (role === "tractor_owner") return <Navigate to="/register"   replace />;
  if (role === "admin")         return <Navigate to="/admin"      replace />;
  if (role === "buyer")         return <Navigate to="/marketplace" replace />;
  return                               <Navigate to="/"           replace />;
};

/* ══════════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════════ */
const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition:    true,   // ← removes warning 1
        v7_relativeSplatPath:  true,   // ← removes warning 2
      }}
    >
      <Routes>

        {/* ── Public routes ──────────────────────────────── */}
        <Route path="/login"                 element={<Login />} />
        <Route path="/signup"                element={<Signup />} />
        <Route path="/forgot-password"       element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Public product pages — no login needed */}
        <Route path="/buy/:id"      element={<BuyProduct />} />
        <Route path="/product/:id"  element={<ProductDetails />} />

        {/* ── Protected routes ───────────────────────────── */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>

                  {/* ── FARMER + BUYER ── */}
                  <Route
                    path="/"
                    element={
                      <RoleRoute
                        element={<Dashboard />}
                        allowed={["farmer", "buyer"]}
                      />
                    }
                  />

                  {/* Marketplace — all logged-in roles */}
                  <Route path="/marketplace" element={<Marketplace />} />

                  {/* ── FARMER ONLY ── */}
                  <Route
                    path="/sensors"
                    element={
                      <RoleRoute
                        element={<SensorDetails />}
                        allowed={["farmer"]}
                      />
                    }
                  />
                  <Route
                    path="/my-products"
                    element={
                      <RoleRoute
                        element={<ProductList />}
                        allowed={["farmer"]}
                      />
                    }
                  />
                  <Route
                    path="/add-product"
                    element={
                      <RoleRoute
                        element={<AddProduct />}
                        allowed={["farmer"]}
                      />
                    }
                  />
                  <Route
                    path="/edit-product/:id"
                    element={
                      <RoleRoute
                        element={<EditProduct />}
                        allowed={["farmer"]}
                      />
                    }
                  />

                  {/* /products → redirect to marketplace for all */}
                  <Route
                    path="/products"
                    element={<Navigate to="/marketplace" replace />}
                  />

                  {/* ── BUYER ONLY ── */}
                  <Route
                    path="/buyer"
                    element={
                      <RoleRoute
                        element={<BuyerDashboard />}
                        allowed={["buyer"]}
                      />
                    }
                  />

                  {/* ── TRACTOR ── */}
                  <Route
                    path="/tractors"
                    element={
                      <RoleRoute
                        element={<TractorListing />}
                        allowed={["farmer", "tractor_owner", "buyer"]}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <RoleRoute
                        element={<TractorRegistration />}
                        allowed={["tractor_owner", "farmer"]}
                      />
                    }
                  />
                  <Route
                    path="/rent/:id"
                    element={
                      <RoleRoute
                        element={<RentTractor />}
                        allowed={["farmer", "buyer"]}
                      />
                    }
                  />

                  {/* ── ADMIN ONLY ── */}
                  <Route
                    path="/admin"
                    element={
                      <RoleRoute
                        element={<AdminDashboard />}
                        allowed={["admin"]}
                      />
                    }
                  />

                  {/* ── CATCH-ALL ── */}
                  <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;