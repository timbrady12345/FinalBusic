import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import Login from "./pages/Login";
import { useContext } from "react";
import { UserProvider } from "./conProv/UserProvider";
import { UserContext } from "./conProv/UserContext";

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <div className="flex justify-between w-screen bg-gray-900 p-2 sticky top-0">
        <nav className="flex gap-4 text-white">
          <Link to="/">Home</Link>
          <Link to="/About">Facts About You</Link>
          <Link to="/Login">Login</Link>
        </nav>

        <div className="text-white">
          {user && <p className="username">{user.username}</p>}
        </div>
      </div>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Login" element={<Login />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
    </Router>
  );
}
