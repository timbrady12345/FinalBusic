import { useState } from "react";

export default function Songs() {
  const [chVisible, setChVisible] = useState(false);
  const [busicVisible, setBusicVisible] = useState(false);
  return (
    <div className="flex flex-col  w-full min-h-screen">
      {/* //Middle */}
      {/* Make a grid of 4 images */}
      {/* Collaps Section */}
      <div className="inline-flex flex-row">
        <div className="w-1/4 bg-gray-900">
          <div className="border-gray-700 border-b"> Songs:</div>
          <a
            className="pb-1"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (chVisible == false || busicVisible == true) {
                setChVisible(true);
                setBusicVisible(false);
              }
            }}
          >
            Coming Home
          </a>
        </div>

        {/* MAIN SCREEN */}
        <div className="h-screen w-full bg-gray-800">
          {/* Horizontal Boxes */}
          {busicVisible && (
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
          )}
          {/* ----------------------------------- */}
          {!busicVisible && chVisible && (
            <div className="inline-flex flex-row w-full min-h-screen">
              {/* Vertical */}
              <div className="flex flex-col p-2 w-full">
                <div className="w-fit">
                  <div className="song-title">Coming Home</div>
                  <div className="flex band-title justify-end">
                    By: The Mellows
                  </div>
                </div>
              </div>
              {/* ml-auto*/}
              <div className="flex flex-col p-4 album-height w-full">
                <div className="w-60 h-60 bg-white">Album Cover</div>
                <div>Song Facts</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
