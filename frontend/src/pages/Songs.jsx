import { useState, useEffect } from "react";
import SongsView from "../components/SongsView";
import BusicView from "../components/BusicView";

const API = import.meta.env.VITE_API_URL;
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function Songs() {
  const [activeSong, setActiveSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");

  const handleUpdateSong = async (updatedSong) => {
    try {
      const res = await fetch(`${API}/api/songs/update/${updatedSong._id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({
          title: updatedSong.title,
          artist: updatedSong.artist,
        }),
      });
      if (res.ok) {
        setSongs(
          songs.map((s) => (s._id === updatedSong._id ? updatedSong : s)),
        );
        setActiveSong(updatedSong);
      }
    } catch (err) {
      console.error("Failed to update song:", err);
    }
  };

  // GET songs on load
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`${API}/api/songs/get`, {
          headers: authHeader(),
        });
        const data = await res.json();
        if (res.ok) setSongs(data.songs);
      } catch (err) {
        console.error("Failed to fetch songs:", err);
      }
    };
    fetchSongs();
  }, []);

  // POST new song
  const handleAddSong = async () => {
    if (!newSongTitle.trim()) return;
    try {
      const res = await fetch(`${API}/api/songs/add`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ title: newSongTitle, artist: newSongArtist }),
      });
      const data = await res.json();
      if (res.ok) {
        setSongs([...songs, data.song]);
        setActiveSong(data.song);
        setNewSongTitle("");
        setNewSongArtist("");
        setAdding(false);
      }
    } catch (err) {
      console.error("Failed to add song:", err);
    }
  };

  //Update Song upon image
  const handleSetSongImage = async (id, url) => {
    try {
      const res = await fetch(`${API}/api/songs/update`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({
          songId: id,
          title: activeSong.title,
          artist: activeSong.artist,
          image: url,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update songs list
        setSongs((prev) =>
          prev.map((song) => (song._id === id ? data.song : song)),
        );

        // Update active song
        setActiveSong(data.song);
      } else {
        console.error("Update failed:", data.error);
      }
    } catch (err) {
      console.error("Failed to update song:", err);
    }
  };

  return (
    <div className="inline-flex flex-row w-full h-[95vh]">
      <div className="w-1/4 bg-gray-900">
        <div className="border-gray-700 border-b">Songs:</div>

        {songs.map((song) => (
          <div
            key={song._id}
            className="border-gray-700 border-b cursor-pointer hover:bg-gray-700 p-1"
            onClick={() => setActiveSong(song)}
          >
            {song.title}
          </div>
        ))}

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

      <div className="h-[95vh] w-full bg-gray-800">
        {activeSong ? (
          <SongsView
            song={activeSong}
            onSetImage={(url) => handleSetSongImage(activeSong._id, url)}
            onUpdateSong={handleUpdateSong}
          />
        ) : (
          <BusicView />
        )}
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
