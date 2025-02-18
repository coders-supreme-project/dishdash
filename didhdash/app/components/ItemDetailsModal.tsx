'use client';

import Image from "next/image";
import { useState } from "react";

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
  };
  onAddToCart: (ingredients: string[]) => void;
}

export function ItemDetailsModal({ isOpen, onClose, item, onAddToCart }: ItemDetailsModalProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="relative h-[200px] mb-4">
          <Image
            src={item.imageUrl || "/default-food-image.jpg"}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <h2 className="text-xl font-bold mb-2">{item.name}</h2>
        <p className="text-yellow font-medium mb-4">${item.price.toFixed(2)}</p>
        
        {item.description && (
          <p className="text-gray-600 mb-4">{item.description}</p>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Select Ingredients:</h3>
          <div className="space-y-2">
            {['Cheese', 'Tomatoes', 'Lettuce', 'Onions', 'Pickles'].map((ingredient) => (
              <label key={ingredient} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient)}
                  onChange={() => handleIngredientToggle(ingredient)}
                  className="rounded border-gray-300 text-yellow focus:ring-yellow"
                />
                <span>{ingredient}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAddToCart(selectedIngredients);
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-yellow text-white font-medium hover:bg-yellow-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 