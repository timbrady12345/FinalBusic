// components/LoginRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../conProv/UserContext";

export default function LoginRoute({ children }) {
  const { user } = useContext(UserContext);

  if (user) {
    return <Navigate to="/About" replace />;
  }

  return children;
}
