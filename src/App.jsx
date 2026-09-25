import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import RunHistory from "./pages/RunHistory.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Logout from "./pages/Logout.jsx";
import Running from "./pages/Running.jsx";
import RunDetail from "./pages/RunDetail.jsx";
import RunResult from "./pages/RunResult.jsx";

function App() {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  return (
    <Routes>

      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Navigate to="/" />
          ) : (
            <Register />
          )
        }
      />

      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Home />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/history"
        element={
          isLoggedIn ? (
            <RunHistory />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
  path="/history/:id"
  element={
    isLoggedIn ? (
      <RunDetail />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      <Route
        path="/profile"
        element={
          isLoggedIn ? (
            <Profile />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/logout"
        element={
          isLoggedIn ? (
            <Logout />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
  path="/running"
  element={
    isLoggedIn ? (
      <Running />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
path="/result/:id"
  element={
    isLoggedIn ? (
      <RunResult />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

    </Routes>
    
    
  );
}

export default App;