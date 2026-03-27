import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4">🛒 Buyer Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Browse marketplace, contact farmers directly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marketplace */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-3xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Marketplace</h2>
            <p className="text-gray-600 mb-6">View all available products from farmers</p>
            <button
              onClick={() => navigate("/marketplace")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md"
            >
              Go to Marketplace
            </button>
          </div>

          {/* My Orders (placeholder) */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-3xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">My Orders</h2>
            <p className="text-gray-600 mb-6">Track your purchases and orders</p>
            <button
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
