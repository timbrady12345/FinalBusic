import { useEffect, useState } from "react";

export default function About() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/users/count")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error("Error fetching count:", err));
  }, []);

  return (
    <div className="w-full min-h-screen bg-red-500">
      <h1 className="text-yellow-500 h-8">你现在是中国人</h1>

      <h1 className="flex items-center justify-center text-yellow-500 h-[calc(100vh-2rem)]">
        You and {count - 1} other people use Busic
      </h1>
    </div>
  );
}
