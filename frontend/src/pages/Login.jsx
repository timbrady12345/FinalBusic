import { useState } from "react";

export default function Login() {
  const [text, setText] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: text }),
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center">
      <div className="flex flex-row w-full justify-center text-5xl p-4">
        <a>Log in here</a>
      </div>

      <input
        type="text"
        placeholder="Type here"
        className="bg-red-900 text-white w-64 p-3 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
