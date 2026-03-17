import { useState } from "react";

export default function SongsView({ song, onSetImage, onUpdateSong }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [notes, setNotes] = useState(song.notes || "");
  const [files, setFiles] = useState(song.files || []);

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setFiles([...files, ...uploaded]);
  };

  const handleSave = () => {
    onUpdateSong({ ...song, title, artist });
    setEditing(false);
  };

  const handleDeleteFile = (index) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="inline-flex flex-row w-full">
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
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
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
            <div className="song-title">{song.title}</div>
            <div className="band-title">By: {song.artist}</div>
            <button
              onClick={() => setEditing(true)}
              className="text-gray-400 text-sm mt-1"
            >
              Edit
            </button>
          </div>
        )}

        {/* Notes Box */}
        <textarea
          className="bg-gray-700 text-white p-2 mt-4 w-full h-40 resize-none rounded"
          placeholder="Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onUpdateSong({ ...song, title, artist, notes })}
        />
      </div>

      {/* Album Cover */}
      <div className="flex flex-col p-4 w-full">
        <label
          className="w-60 h-60 bg-white cursor-pointer flex items-center justify-center overflow-hidden"
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) onSetImage(URL.createObjectURL(file));
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) onSetImage(URL.createObjectURL(file));
            }}
          /> */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onSetImage(e.target.files[0])} // pass the File object up
          />
          {song.image ? (
            <img
              src={song.image}
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
        {/* File Upload */}
        <div className="mt-4">
          <label className="cursor-pointer text-sm text-gray-400 border border-gray-600 rounded px-3 py-1 hover:bg-gray-700">
            Upload Files +
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {/* File List */}
        {files.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-400 hover:underline truncate"
                >
                  📄 {file.name}
                </a>
                <button
                  onClick={() => handleDeleteFile(index)}
                  className="text-gray-500 hover:text-red-400 text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
