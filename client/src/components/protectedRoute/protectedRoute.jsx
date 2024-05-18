import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoute = () => {
  const iscrsf = document.cookie.includes("csrftoken");
  const isSession = document.cookie.includes("LEETCODE_SESSION");
  return iscrsf && isSession ? <Outlet /> : <Navigate to="/login" />;
};
