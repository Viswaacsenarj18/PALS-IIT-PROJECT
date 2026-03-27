import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "@/config/api";
import Layout from "@/components/layout/Layout";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  seller?: {
    name?: string;
    phone?: string;
  };
  phone?: string;
  ownerName?: string;
}

const ProductDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(getApiUrl("/api/products"));
      const data = await res.json();
      if (res.ok) {
        const found = data.data.find((p: Product) => p._id === id);
        if (found) setProduct(found);
        else setError(t("product.notFound"));
      } else {
        setError(data.message || t("product.loadFailed"));
      }
    } catch {
      setError(t("common.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    const msg = `${t("product.whatsappMsg")}:
${product?.name}
${t("product.price")}: ₹${product?.price}
${t("product.stock")}: ${product?.stock}
${t("product.description")}: ${product?.description?.slice(0, 100)}...`;

    const phone = product?.seller?.phone?.replace(/[^0-9]/g, "") || "";
    window.open(
      phone
        ? `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  if (loading)
    return <div className="p-8 text-center">{t("common.loading")}</div>;

  if (error || !product)
    return (
      <div className="p-8 text-center text-red-500">
        {error || t("product.notFound")}
      </div>
    );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">

        <button
          onClick={() => navigate("/marketplace")}
          className="mb-8 text-gray-500 hover:text-gray-700"
        >
          ← {t("product.back")}
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">

            <img
              src={product.image || "/api/placeholder/400/400"}
              className="rounded-2xl"
            />

            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <p className="text-xl text-green-600 font-bold">
                ₹{product.price}
              </p>

              <p className="text-sm text-gray-500">
                {t("product.seller")}:{" "}
                {product.seller?.name || product.ownerName}
              </p>

              <p className="text-sm text-gray-500">
                {t("product.stock")}: {product.stock}
              </p>

              <div className="mt-6">
                <h3 className="font-bold mb-2">{t("product.description")}</h3>
                <p>{product.description}</p>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-emerald-500 text-white p-3 rounded-xl">
                  📞 {t("product.call")}
                </button>

                <button
                  onClick={handleMessage}
                  className="w-full bg-green-600 text-white p-3 rounded-xl"
                >
                  💬 {t("product.message")}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;