// App Version: 5.1.0 - Visitor Prompt & Tracker Live
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

import VisitorPromptModal from "./components/VisitorPromptModal";

const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  const getSavedVisitor = () => {
    try {
      const raw = sessionStorage.getItem("visitor_info") || localStorage.getItem("visitor_info");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name && parsed?.instansi) return parsed;
      }
    } catch (e) {
      console.warn("Visitor parse error:", e);
    }
    return null;
  };

  const saveAndTrackVisitor = async (visitorInfo = null) => {
    try {
      let geoData = {};
      try {
        const geoRes = await fetch("https://ipapi.co/json/");
        geoData = await geoRes.json();
      } catch (e) {
        console.warn("Geo lookup fallback", e);
      }

      const name = visitorInfo?.name || "Tamu";
      const instansi = visitorInfo?.instansi || "Umum";
      const hasIdentity = Boolean(visitorInfo?.name);

      const logData = {
        ip: geoData.ip || "Unknown",
        city: geoData.city || "Unknown",
        region: geoData.region || "Unknown",
        country: geoData.country_name || "Unknown",
        org: hasIdentity ? `[${instansi}] ${name}` : (geoData.org || "Direct ISP"),
        user_agent: hasIdentity
          ? `[Visitor: ${name} | ${instansi}] ${navigator.userAgent}`
          : navigator.userAgent,
        referrer: hasIdentity
          ? `Visitor: ${name} (${instansi})`
          : (document.referrer || "Direct"),
        path: window.location.pathname,
      };

      await supabase.from("visitors").insert(logData);
      sessionStorage.setItem("tracked_session", "true");
    } catch (err) {
      console.error("Tracking error:", err);
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    const savedInfo = getSavedVisitor();
    if (!savedInfo) {
      setShowPrompt(true);
    } else if (!sessionStorage.getItem("tracked_session")) {
      saveAndTrackVisitor(savedInfo);
    }
  };

  useEffect(() => {
    if (!showWelcome) {
      const savedInfo = getSavedVisitor();
      if (!savedInfo) {
        setShowPrompt(true);
      }
    }
  }, [showWelcome]);

  const handlePromptSubmit = async (data) => {
    sessionStorage.setItem("visitor_info", JSON.stringify(data));
    localStorage.setItem("visitor_info", JSON.stringify(data));
    window.dispatchEvent(new Event("visitor_info_updated"));
    setShowPrompt(false);
    await saveAndTrackVisitor(data);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={null}>
            <WelcomeScreen onLoadingComplete={handleWelcomeComplete} />
          </Suspense>
        )}
      </AnimatePresence>

      <VisitorPromptModal
        isOpen={showPrompt}
        onSubmit={handlePromptSubmit}
      />

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