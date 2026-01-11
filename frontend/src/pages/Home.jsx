import React from "react";
import { useState } from "react";

export default function Home() {
  const [songsVisible, setSongsVisible] = useState(false);
  const [recipesVisible, setRecipesVisible] = useState(false);
  return (
    <html>
      <head></head>
      <body>
        <div className="flex flex-col">
          {/* //Top */}
          <div className="h-full p-4 bg-gray-500 flex flex-row">
            <div className="w-auto pr-8 text-left">
              <h1>Busic</h1>
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
          </div>
          {/* //Middle */}
          {/* Make a grid of 4 images */}
          {/* Collaps Section */}
          <div className="inline-flex flex-row">
            {songsVisible && (
              <div className="w-1/4 bg-gray-900">
                <div className="border-gray-700 border-b"> Songs:</div>
                <div className="pb-1">Coming Home</div>
              </div>
            )}
            {recipesVisible && (
              <div className="w-1/4 bg-gray-900">
                <div className="border-gray-700 border-b"> Recipes:</div>
                <div className="pb-1">Chocolate Chip Cookies</div>
                <div className="pb-1">Chocolate Chip Cookies II</div>
                <div className="pb-1">Chocolate Chip Cookies III</div>
              </div>
            )}
            {/* MAIN SCREEN */}
            <div className="h-screen w-full bg-gray-800">
              {/* Horizontal Boxes */}
              <div className="inline-flex flex-row">
                {/* Vertical */}
                <div className="flex flex-col p-2">
                  <div>Top Left</div>
                  <div>Bottom Left</div>
                </div>
                <div className="flex flex-col p-2">
                  <div>Top Right</div>
                  <div>Bottom Right</div>
                </div>
              </div>
            </div>
          </div>
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
      </body>
    </html>
  );
}
