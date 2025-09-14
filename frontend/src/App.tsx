// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Sensors from "./pages/Sensors";
import Alerts from "./pages/Alerts";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <div className="flex">
      {/* show sidebar only when logged in */}
      {token && <Sidebar />}

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />

          {/* public */}
          <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />

          {/* protected */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/sensors"
            element={
              <PrivateRoute>
                <Sensors />
              </PrivateRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <PrivateRoute>
                <Alerts />
              </PrivateRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}
