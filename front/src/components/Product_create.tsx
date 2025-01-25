import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importer useNavigate

const ProductCreate = () => {
  const navigate = useNavigate(); // Créer une instance de navigate
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [at_sale, setAt_sale] = useState<boolean>(false);
  const [inventory, setInventory] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);

  const handleProductCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("at_sale", String(at_sale));
    formData.append("inventory", String(inventory));

    if (image) {
      formData.append("image", image);
    } else {
      console.error("Aucune image sélectionnée.");
      return; // Sortir de la fonction si aucune image n'est sélectionnée
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Produit créé : ", response.data);
      navigate("/product"); // Rediriger vers /product après la création réussie
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erreur lors de la création du produit : ", error.response?.data);
      } else {
        console.error("Erreur inconnue :", error);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Formulaire de création de Produit</h1>
      <form onSubmit={handleProductCreate}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            placeholder="Entrer le titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Entrer la description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={at_sale}
            onChange={(e) => setAt_sale(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">À vendre</label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Inventaire</label>
          <input
            type="number"
            placeholder="Entrer l'inventaire"
            value={inventory}
            onChange={(e) => setInventory(Number(e.target.value))}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
            required
            className="mt-1 block w-full text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Créer Produit
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;