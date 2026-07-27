import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "./supabase";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import { LanguageProvider } from "./utils/LanguageContext";
import AnimatedBackground from "./components/Background";
import { AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  useEffect(() => {
    const trackVisit = async () => {
      // Only track once per browser session to prevent spamming
      if (sessionStorage.getItem("tracked_session")) return;

      try {
        const geoRes = await fetch("https://ipapi.co/json/");
        const geoData = await geoRes.json();

        const logData = {
          ip: geoData.ip || "Unknown",
          city: geoData.city || "Unknown",
          region: geoData.region || "Unknown",
          country: geoData.country_name || "Unknown",
          org: geoData.org || "Unknown",
          user_agent: navigator.userAgent,
          referrer: document.referrer || "Direct",
          path: window.location.pathname
        };

        await supabase.from("visitors").insert(logData);
        sessionStorage.setItem("tracked_session", "true");
      } catch (err) {
        console.error("Tracking error:", err);
        try {
          const logData = {
            ip: "Unknown",
            city: "Unknown",
            region: "Unknown",
            country: "Unknown",
            org: "Unknown",
            user_agent: navigator.userAgent,
            referrer: document.referrer || "Direct",
            path: window.location.pathname
          };
          await supabase.from("visitors").insert(logData);
          sessionStorage.setItem("tracked_session", "true");
        } catch (e) {
          console.error("Fallback tracking error:", e);
        }
      }
    };

    trackVisit();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={null}>
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
      
          <Home />
          <About />
          <Suspense fallback={<div className="h-20" />}>
            <Portofolio />
            <ContactPage />
          </Suspense>
          <Footer />
        </>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <LanguageProvider>
      <HelmetProvider>
        <div className="pointer-events-none">
          <AnimatedBackground />
        </div>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC */}
            <Route
              path="/"
              element={
                <LandingPage
                  showWelcome={showWelcome}
                  setShowWelcome={setShowWelcome}
                />
              }
            />

            <Route path="/project/:slug" element={<ProjectPageLayout />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />

            {/* ADMIN (PROTECTED) */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <Suspense fallback={null}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </LanguageProvider>
  );
}

export default App;