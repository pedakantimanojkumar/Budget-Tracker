import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import CategoryPage from "./pages/CategoryPage";
import TransactionPage from "./pages/TransactionPage";

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";

// ✅ Simple button style
const buttonStyle = {
  margin: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "#fff",
};

function App() {
  return (
    <BrowserRouter>
      <Toaster />

      <Routes>
        {/* ✅ UPDATED HOME PAGE */}
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <h1>💰 Budget Tracker</h1>
              <p>Track your income and expenses easily</p>

              <div style={{ marginTop: "20px" }}>
                <Link to="/login">
                  <button style={buttonStyle}>Login</button>
                </Link>

                <Link to="/signup">
                  <button style={buttonStyle}>Signup</button>
                </Link>
              </div>
            </div>
          }
        />

        {/* Auth Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Layout>
                <CategoryPage />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Layout>
                <TransactionPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;