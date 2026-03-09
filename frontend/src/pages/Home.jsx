import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/users/count")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error("Error fetching count:", err));
  }, []);

  return (
    <div className="flex flex-col  w-full min-h-screen">
      {/* //Top */}
      {/* <div className="h-full p-4 bg-gray-500 flex flex-row">
        <div className="w-auto pr-8 text-left">
          <h1>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (busicVisible == false) {
                  setBusicVisible(true);
                }
              }}
            >
              Busic
            </a>
          </h1>
        </div>
        <div className="w-full flex flex-col justify-end">
          <div className="w-full flex flex-row">
            <div className="pl-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (songsVisible == false) {
                    setSongsVisible(true);
                    setRecipesVisible(false);
                  } else {
                    setSongsVisible(false);
                  }
                }}
              >
                Songs
              </a>
            </div>
            <div className="pl-4">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (recipesVisible == false) {
                    setRecipesVisible(true);
                    setSongsVisible(false);
                  } else {
                    setRecipesVisible(false);
                  }
                }}
              >
                Recipes
              </a>
            </div>
            <div className="pl-4">
              <a>Playlists</a>
            </div>
          </div>
        </div>
      </div> */}
      <h1 className="flex items-center text-yellow-500 h-[calc(100vh-2rem)]">
        You and {count - 1} other people use Busic
      </h1>
      {/* //Bottom */}
      <div className="h-full p-4 bg-indigo-900 text-center">
        <h4>Created by Timothy Brady</h4>
        <h4>
          Thanks to
          <a className="text-yellow-300"> Kyle</a>,
          <a className="text-indigo-300"> Echo</a>,
          <a className="text-gray-300"> My Parents</a>,
          <a className="text-red-500"> The Mellows</a>,
          <a className="text-green-500"> Connor from Labonnes</a>
        </h4>
      </div>
    </div>
  );
}
