import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductType } from "../types/ProductType"; // Assurez-vous que le chemin est correct

const Product = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductType[]>(
          "http://127.0.0.1:8000/product"
        );
        setProducts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h1 className="text-center">Loading...</h1>;
  }

  if (error) {
    return (
      <h1 className="text-center text-red-500">
        Erreur de récupération des produits : {error}
      </h1>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Page des produits</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 transition hover:shadow-lg">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span>Aucune image disponible</span>
              </div>
            )}
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="mt-2">
              <span className="font-bold">À vendre:</span>{" "}
              {product.at_sale ? "Oui" : "Non"}
            </p>
            <p className="mt-1">
              <span className="font-bold">Inventaire:</span> {product.inventory}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;