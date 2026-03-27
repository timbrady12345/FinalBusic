import { useState, useEffect } from "react";
import RecipeView from "../components/RecipeView";

const API = import.meta.env.VITE_API_URL;
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function Recipes() {
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${API}/api/recipes/get`, {
          headers: authHeader(),
        });
        const data = await res.json();
        if (res.ok) setRecipes(data.recipes);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      }
    };
    fetchRecipes();
  }, []);

  const handleAddRecipe = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(`${API}/api/recipes/add`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecipes([...recipes, data.recipe]);
        setActiveRecipe(data.recipe);
        setNewTitle("");
        setNewDescription("");
        setAdding(false);
      }
    } catch (err) {
      console.error("Failed to add recipe:", err);
    }
  };

  const handleUpdateRecipe = async (updatedRecipe) => {
    try {
      const res = await fetch(
        `${API}/api/recipes/update/${updatedRecipe._id}`,
        {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify({
            title: updatedRecipe.title,
            description: updatedRecipe.description,
            notes: updatedRecipe.notes,
          }),
        },
      );
      if (res.ok) {
        setRecipes(
          recipes.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r)),
        );
        setActiveRecipe(updatedRecipe);
      }
    } catch (err) {
      console.error("Failed to update recipe:", err);
    }
  };

  const handleSetRecipeImage = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("recipeId", id);
      const res = await fetch(`${API}/api/recipes/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setRecipes((prev) => prev.map((r) => (r._id === id ? data.recipe : r)));
        setActiveRecipe(data.recipe);
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };

  return (
    <div className="inline-flex flex-row w-full h-[95vh]">
      <div className="w-1/4 bg-gray-900">
        <div className="border-gray-700 border-b">Recipes:</div>

        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="border-gray-700 border-b cursor-pointer hover:bg-gray-700 p-1"
            onClick={() => setActiveRecipe(recipe)}
          >
            {recipe.title}
          </div>
        ))}

        {adding ? (
          <div className="flex flex-col gap-1 p-2">
            <input
              className="bg-gray-700 text-white p-1 text-sm"
              placeholder="Recipe title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              className="bg-gray-700 text-white p-1 text-sm"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddRecipe}
                className="text-green-400 text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setAdding(false)}
                className="text-red-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="border-gray-700 border-b cursor-pointer hover:bg-gray-700 p-1"
            onClick={() => setAdding(true)}
          >
            Add Recipe +
          </div>
        )}
      </div>

      <div className="h-[95vh] w-full bg-gray-800">
        {activeRecipe ? (
          <RecipeView
            key={activeRecipe._id}
            recipe={activeRecipe}
            onSetImage={(file) => handleSetRecipeImage(activeRecipe._id, file)}
            onUpdateRecipe={handleUpdateRecipe}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select or add a recipe
          </div>
        )}
      </div>
    </div>
  );
}
