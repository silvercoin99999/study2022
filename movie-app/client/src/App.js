import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./hoc/auth";
// pages for this product
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import NavBar from "./components/views/NavBar/NavBar";
import Footer from "./components/views/Footer/Footer";
import MovieDetail from "./components/views/MovieDetail/MovieDetail";
import FavoritePage from "./components/views/FavoritePage/FavoritePage";

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthMovieDetail = Auth(MovieDetail, null);
  const AuthFavoritePage = Auth(FavoritePage, true);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/register" element={<AuthRegisterPage />} />
          <Route path="/movie/:movieId" element={<AuthMovieDetail />} />
          <Route path="/favorite" element={<AuthFavoritePage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
