import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  if (!token) {
    console.log("No token → redirecting");
    return <Navigate to="/login" replace />;
  }

  console.log("Token exists → showing dashboard");

  return children;
};

export default PrivateRoute;