import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./hoc/auth";
// pages for this product
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import NavBar from "./components/views/NavBar/NavBar";
import Footer from "./components/views/Footer/Footer";
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage";
import VideoDetailPage from "./components/views/VideoDetailPage/VideoDetailPage";
import SubscriptionPage from "./components/views/SubscriptionPage/SubscriptionPage";

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthVideoUploadPage = Auth(VideoUploadPage, true);
  const AuthVideoDetailPage = Auth(VideoDetailPage, null);
  const AuthSubscriptionPage = Auth(SubscriptionPage, null);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/register" element={<AuthRegisterPage />} />
          <Route path="/video/upload" element={<AuthVideoUploadPage />} />
          <Route path="/video/:videoId" element={<AuthVideoDetailPage />} />
          <Route path="/subscription" element={<AuthSubscriptionPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
