import { useState } from "react";
import CollectionItemView from "../components/CollectionItemView";

const API = import.meta.env.VITE_API_URL;
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function CollectionPage({ collection, onCollectionUpdate }) {
  const [activeItem, setActiveItem] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");

  const handleSetItemImage = async (itemId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `${API}/api/collections/${collection._id}/items/${itemId}/upload-image`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      },
    );
    const data = await res.json();
    if (res.ok) {
      onCollectionUpdate(data.collection);
      setActiveItem(data.item);
    }
  };

  const handleAddItem = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch(`${API}/api/collections/${collection._id}/items`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ title: newTitle, subtitle: newSubtitle }),
    });
    const data = await res.json();
    if (res.ok) {
      onCollectionUpdate(data.collection);
      setActiveItem(data.collection.items.at(-1));
      setNewTitle("");
      setNewSubtitle("");
      setAdding(false);
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    const res = await fetch(
      `${API}/api/collections/${collection._id}/items/${updatedItem._id}`,
      {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(updatedItem),
      },
    );
    const data = await res.json();
    if (res.ok) {
      onCollectionUpdate(data.collection);
      setActiveItem(updatedItem);
    }
  };

  return (
    <div className="inline-flex flex-row w-full h-[95vh]">
      <div className="w-1/4 bg-gray-900">
        <div className="border-gray-700 border-b p-1">
          {collection.icon} {collection.name}:
        </div>

        {collection.items.map((item) => (
          <div
            key={item._id}
            className="border-gray-700 border-b cursor-pointer hover:bg-gray-700 p-1"
            onClick={() => setActiveItem(item)}
          >
            {item.title}
          </div>
        ))}

        {adding ? (
          <div className="flex flex-col gap-1 p-2">
            <input
              className="bg-gray-700 text-white p-1 text-sm"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              className="bg-gray-700 text-white p-1 text-sm"
              placeholder="Subtitle"
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
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
            +
          </div>
        )}
      </div>

      <div className="h-[95vh] w-full bg-gray-800">
        {activeItem ? (
          <CollectionItemView
            key={activeItem._id}
            item={activeItem}
            subtitleLabel={collection.subtitleLabel}
            onUpdateItem={handleUpdateItem}
            onSetImage={(file) => handleSetItemImage(activeItem._id, file)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select or add an item
          </div>
        )}
      </div>
    </div>
  );
}
