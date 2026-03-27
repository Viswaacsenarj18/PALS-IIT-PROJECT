import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApiUrl } from "@/config/api";
import Layout from "@/components/layout/Layout";

const BuyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${getApiUrl("/api/products")}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const foundProduct = data.data.find((p) => p._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } else {
        setError(data.message || "Failed to load product");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    setBuyLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/products/buy"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId: id, quantity }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Purchase successful! Total: ₹${data.data.price}`);
        navigate("/products");
      } else {
        setError(data.message || "Purchase failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setBuyLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !product) return <div className="p-8 text-center text-red-500">{error || "Product not found"}</div>;

  const totalPrice = product.price * quantity;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate("/products")}
          className="mb-8 text-gray-500 hover:text-gray-700 flex items-center"
        >
          ← Back to Marketplace
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <img 
                src={product.image || "/api/placeholder/400/400"} 
                alt={product.name}
                className="w-full max-w-md h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                <p className="text-2xl text-green-600 font-bold mb-2">₹{product.price} / unit</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Seller: {product.seller?.name}</span>
                  <span className="mx-4">•</span>
                  <span>Stock: {product.stock}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                <h3 className="font-bold text-lg mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl mb-8">
                <h3 className="font-bold text-lg mb-4">Order Details</h3>
                <div className="flex items-center gap-4 mb-4">
                  <label className="font-semibold">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">Available: {product.stock}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    Total: ₹{totalPrice}
                  </div>
                </div>
              </div>

              <button
                onClick={handleBuy}
                disabled={buyLoading || product.stock === 0 || quantity > product.stock}
                className="w-full bg-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                {buyLoading ? "Processing..." : "Buy Now"} 
                <span className="text-sm">({quantity})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyProduct;

