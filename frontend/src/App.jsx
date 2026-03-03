import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <nav className="sticky w-screen p-2 w-full bg-gray-900">
        <Link to="/">Home</Link> | <Link to="/About">Facts About You</Link> |{" "}
        <Link to="/Login">Login</Link>
      </nav>
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
