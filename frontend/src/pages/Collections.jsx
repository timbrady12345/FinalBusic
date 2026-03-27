import { useState, useEffect } from "react";
import CollectionPage from "./CollectionPage";

const API = import.meta.env.VITE_API_URL;
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch(`${API}/api/collections`, { headers: authHeader() })
      .then((r) => r.json())
      .then((d) => setCollections(d.collections));
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const res = await fetch(`${API}/api/collections`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({
        name: newName,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setCollections([...collections, data.collection]);
      setActiveCollection(data.collection);
      setCreating(false);
      setNewName("");
    }
  };

  const handleCollectionUpdate = (updatedCollection) => {
    setCollections((prev) =>
      prev.map((c) =>
        c._id === updatedCollection._id ? updatedCollection : c,
      ),
    );
    setActiveCollection(updatedCollection);
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Delete this collection?")) return;
    const res = await fetch(`${API}/api/collections/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    if (res.ok) {
      setCollections((prev) => prev.filter((c) => c._id !== id));
      if (activeCollection?._id === id) setActiveCollection(null);
    }
  };

  return (
    <div className="inline-flex flex-row w-full h-[95vh]">
      {/* Left sidebar — collection list */}
      <div className="w-1/4 bg-gray-900 flex flex-col">
        <div className="border-gray-700 border-b p-1">Memories:</div>

        {collections.map((c) => (
          <div
            key={c._id}
            className={`border-gray-700 border-b cursor-pointer hover:bg-gray-700 p-1 flex items-center justify-between group ${activeCollection?._id === c._id ? "bg-gray-700" : ""}`}
            onClick={() => setActiveCollection(c)}
          >
            <div className="flex items-center gap-2">
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCollection(c._id);
              }}
              className="text-gray-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 pr-1"
            >
              🗑️
            </button>
          </div>
        ))}

        {creating ? (
          <div className="flex flex-col gap-1 p-2">
            <input
              className="bg-gray-700 text-white p-1 text-sm"
              placeholder="Title"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="text-green-400 text-sm">
                Create
              </button>
              <button
                onClick={() => setCreating(false)}
                className="text-red-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="border-gray-700 border-b cursor-pointer hover:bg-gray-700 p-1 text-gray-400"
            onClick={() => setCreating(true)}
          >
            + New Collection
          </div>
        )}
      </div>

      {/* Right panel — collection contents */}
      <div className="w-3/4 bg-gray-800">
        {activeCollection ? (
          <CollectionPage
            key={activeCollection._id}
            collection={activeCollection}
            onCollectionUpdate={handleCollectionUpdate}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select or create a collection
          </div>
        )}
      </div>
    </div>
  );
}
