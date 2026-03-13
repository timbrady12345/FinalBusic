import { useState } from "react";
import SongsView from "../components/SongsView";
import BusicView from "../components/BusicView";

export default function Songs() {
  const [activeSong, setActiveSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");

  const handleAddSong = () => {
    if (!newSongTitle.trim()) return;
    const newSong = {
      id: Date.now(),
      title: newSongTitle,
      artist: newSongArtist,
    };
    setSongs([...songs, newSong]);
    setActiveSong(newSong);
    setNewSongTitle("");
    setNewSongArtist("");
    setAdding(false);
  };

  return (
    <div className="inline-flex flex-row w-full">
      <div className="w-1/4 bg-gray-900">
        <div className="border-gray-700 border-b">Songs:</div>

        {/* Song List */}
        {songs.map((song) => (
          <div
            key={song.id}
            className="border-gray-700 border-b cursor-pointer hover:bg-gray-700 p-1"
            onClick={() => setActiveSong(song)}
          >
            {song.title}
          </div>
        ))}

        {/* Add Song Form */}
        {adding ? (
          <div className="flex flex-col gap-1 p-2">
            <input
              className="bg-gray-700 text-white p-1 text-sm"
              placeholder="Song title"
              value={newSongTitle}
              onChange={(e) => setNewSongTitle(e.target.value)}
            />
            <input
              className="bg-gray-700 text-white p-1 text-sm"
              placeholder="Artist"
              value={newSongArtist}
              onChange={(e) => setNewSongArtist(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddSong}
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
            Add Song +
          </div>
        )}
      </div>

      {/* Main View */}
      <div className="h-screen w-full bg-gray-800">
        {activeSong ? <SongsView song={activeSong} /> : <BusicView />}
      </div>
    </div>
  );
}
// export default function Songs() {
//   const [songs, setSongs] = useState([]); // fetched from API
//   const [activeSong, setActiveSong] = useState(null);

//   return (
//     <div className="inline-flex flex-row">
//       <div className="w-1/4 bg-gray-900">
//         {songs.map(song => (
//           <div key={song._id} onClick={() => setActiveSong(song)}>
//             {song.title}
//           </div>
//         ))}
//       </div>

//       <div className="h-screen w-full bg-gray-800">
//         {activeSong ? <SongView song={activeSong} /> : <BusicView />}
//       </div>
//     </div>
//   );
// }
