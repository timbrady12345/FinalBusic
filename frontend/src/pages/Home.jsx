import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* //Top */}
      <div className="h-full p-4 bg-indigo-200 text-center">
        <h1>Information</h1>
      </div>
      {/* //Middle */}
      {/* Make a grid of 4 images */}
      <div className="h-screen bg-blue-800">
        <div className="inline-flex flex-row">
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
      {/* //Bottom */}
      <div className="h-full p-4 bg-indigo-900 text-center">
        <h1>Details</h1>
      </div>
    </div>
  );
}
