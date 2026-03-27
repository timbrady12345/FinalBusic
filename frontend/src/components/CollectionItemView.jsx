import { useState } from "react";

export default function CollectionItemView({
  item,
  subtitleLabel,
  onUpdateItem,
  onSetImage,
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle || "");
  const [notes, setNotes] = useState(item.notes || "");

  const handleSave = () => {
    onUpdateItem({ ...item, title, subtitle, notes });
    setEditing(false);
  };

  return (
    <div className="inline-flex flex-row w-full">
      {/* Left — title, subtitle, notes */}
      <div className="flex flex-col p-2 w-full">
        {editing ? (
          <div className="flex flex-col gap-2">
            <input
              className="bg-gray-700 text-white p-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="bg-gray-700 text-white p-1"
              placeholder={subtitleLabel}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="text-green-400 text-sm">
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-red-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="w-fit">
            <div className="song-title">{item.title}</div>
            {item.subtitle && <div className="band-title">{item.subtitle}</div>}
            <button
              onClick={() => setEditing(true)}
              className="text-gray-400 text-sm mt-1"
            >
              Edit
            </button>
          </div>
        )}

        <textarea
          className="bg-gray-700 text-white p-2 mt-4 w-full h-40 resize-none rounded"
          placeholder="Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onUpdateItem({ ...item, title, subtitle, notes })}
        />
      </div>

      {/* Right — image */}
      <div className="flex flex-col p-4 w-full">
        <label
          className="w-60 h-60 cursor-pointer flex flex-col"
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) onSetImage(file);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onSetImage(e.target.files[0])}
          />
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm text-center p-2">
              Click or drag to upload image
            </span>
          )}
        </label>
      </div>
    </div>
  );
}
