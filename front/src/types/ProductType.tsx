export interface ProductType {
    id?: number; // Peut être optionnel lors de la création
    title: string; // Titre du produit
    description: string; // Description du produit
    image: string; // Utilisez string pour l'URL de l'image
    at_sale: boolean; // Indique si le produit est à vendre
    inventory: number; // Quantité en stock
    added_at?: string; // Peut être optionnel lors de la création, date d'ajout
}