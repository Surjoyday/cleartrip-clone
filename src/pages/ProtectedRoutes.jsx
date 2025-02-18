import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoutes({ children }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!token) {
        navigate("/");
      }
    },
    [token, navigate]
  );

  return token ? children : null;
}
