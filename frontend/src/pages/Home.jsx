import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/count`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error("Error fetching count:", err));
  }, []);

  return (
    <div className="flex flex-col w-full h-[calc(100)]">
      <div className="flex items-center justify-center text-yellow-500 h-[calc(100vh-11rem)]">
        <h1>You and {count - 1} other people use Busic</h1>
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
  );
}
