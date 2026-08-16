
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "./utils/axioClient";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import ImageConverter from "./pages/imageConversion";
import BackgroundRemover from "./pages/BackgroundRemover";
import Layout from "./pages/Layout";
import LandingPage from "./pages/landingpage";

// Website Builder
import Builder from "./websitebuilder/websitebuilder";
import CodeStudio from "./websitebuilder/codestudio";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosClient.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-purple-400">
        Loading LogixAI...
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={user ? <Navigate to="/chat" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/chat" /> : <Signup />}
        />

        {/* PROTECTED ROUTES */}
        <Route element={user ? <Layout setUser={setUser} /> : <Navigate to="/login" />}>
          <Route path="/chat" element={<Chat user={user} />} />
          <Route path="/imageconverter" element={<ImageConverter />} />
          <Route path="/backgroundremover" element={<BackgroundRemover />} />

          {/* Website Builder — only change is /studio (no :chatId) */}
          <Route path="/website-builder" element={<Builder user={user} />} />
          <Route path="/website-builder/studio" element={<CodeStudio />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;