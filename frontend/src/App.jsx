import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Collections from "./pages/Collections";
import { useContext } from "react";
import { UserProvider } from "./conProv/UserProvider";
import { UserContext } from "./conProv/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginRoute from "./components/LoginRoute";

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const { user, setUser } = useContext(UserContext);

  return (
    <Router>
      {user && (
        <div className="flex justify-between w-screen bg-gray-500 p-2 sticky top-0">
          <nav className="flex gap-4 text-white items-center h-8 h-full p-4 flex flex-row">
            <Link className="w-auto pr-8 text-left" to="/">
              <h1>Busic</h1>
            </Link>
            <Link to="/Collections">Memories</Link>
          </nav>

          <div className="text-white flex items-center gap-4">
            {user && (
              <button
                onClick={() => {
                  setUser(null);
                  localStorage.removeItem("token");
                }}
                className="text-white text-sm px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 flex justify-center"
              >
                Sign Out
              </button>
            )}
            {user && <p className="username">{user.username}</p>}
          </div>
        </div>
      )}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Collections"
            element={
              <ProtectedRoute>
                <Collections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Login"
            element={
              <LoginRoute>
                <Login />
              </LoginRoute>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
    </Router>
  );
}
