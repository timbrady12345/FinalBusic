// components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../conProv/UserContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}
