import { useState } from "react";

export default function SongsView({ song }) {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  return (
    <div className="inline-flex flex-row w-full min-h-screen">
      <div className="flex flex-col p-2 w-full">
        <div className="w-fit">
          <div className="song-title">{song.title}</div>
          <div className="band-title">By: {song.artist}</div>
        </div>
      </div>

      <div className="flex flex-col p-4 w-full">
        {/* Album Cover Box */}
        <label
          className="w-60 h-60 bg-white cursor-pointer flex items-center justify-center overflow-hidden"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {image ? (
            <img
              src={image}
              alt="Album Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm text-center p-2">
              Click or drag to upload album cover
            </span>
          )}
        </label>

        <div>Song Facts</div>
      </div>
    </div>
  );
}
