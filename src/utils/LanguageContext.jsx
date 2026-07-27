import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  id: {
    // Navbar
    navHome: "Home",
    navAbout: "Tentang",
    navPortfolio: "Portofolio",
    navContact: "Kontak",

    // Home
    statusBadge: "Siap Berinovasi",
    typingWords: ["Mahasiswa Teknik Informatika", "Antusias Teknologi"],
    btnProjects: "Proyek",
    btnContact: "Kontak",

    // About
    aboutHeader: "Tentang Saya",
    aboutSubtitle: "Mengubah ide menjadi pengalaman digital",
    aboutHello: "Halo, Saya",
    btnDownloadCV: "Unduh CV",
    btnViewProjects: "Lihat Proyek",
    statProjects: "Total Proyek",
    statProjectsDesc: "Solusi web inovatif yang dibuat",
    statCertificates: "Sertifikat",
    statCertificatesDesc: "Validasi keahlian profesional",
    statExperience: "Tahun Pengalaman",
    statExperienceDesc: "Perjalanan belajar terus-menerus",

    // Portfolio
    portfolioHeader: "Galeri Portofolio",
    portfolioSubtitle: "Jelajahi perjalanan saya melalui proyek, sertifikasi, dan keahlian teknis. Setiap bagian mewakili pencapaian dalam proses belajar saya.",
    tabProjects: "Proyek",
    tabCertificates: "Sertifikat",
    tabTech: "Tech Stack",
    btnSeeMore: "Lihat Semua",
    btnSeeLess: "Lihat Sedikit",

    // Contact
    contactHeader: "Hubungi Saya",
    contactSubtitle: "Punya pertanyaan? Kirimi saya pesan, dan saya akan segera membalasnya.",
    contactTitle: "Hubungi",
    contactDesc: "Ada yang ingin didiskusikan? Kirim saya pesan dan mari kita bicara.",
    placeholderName: "Nama Anda",
    placeholderEmail: "Email Anda",
    placeholderMessage: "Pesan Anda",
    btnSend: "Kirim Pesan",
    btnSending: "Mengirim...",
    alertSendingTitle: "Mengirim Pesan...",
    alertSendingBody: "Harap tunggu selagi kami mengirim pesan Anda",
    alertSuccessTitle: "Berhasil!",
    alertSuccessBody: "Pesan Anda telah berhasil terkirim!",
    alertErrorTitle: "Gagal!",
    alertErrorBody: "Terjadi kesalahan. Silakan coba lagi nanti.",
  },
  en: {
    // Navbar
    navHome: "Home",
    navAbout: "About",
    navPortfolio: "Portfolio",
    navContact: "Contact",

    // Home
    statusBadge: "Ready to Innovate",
    typingWords: ["Informatics Engineering Student", "Tech Enthusiast"],
    btnProjects: "Projects",
    btnContact: "Contact",

    // About
    aboutHeader: "About Me",
    aboutSubtitle: "Transforming ideas into digital experiences",
    aboutHello: "Hello, I'm",
    btnDownloadCV: "Download CV",
    btnViewProjects: "View Projects",
    statProjects: "Total Projects",
    statProjectsDesc: "Innovative web solutions crafted",
    statCertificates: "Certificates",
    statCertificatesDesc: "Professional skills validated",
    statExperience: "Years of Experience",
    statExperienceDesc: "Continuous learning journey",

    // Portfolio
    portfolioHeader: "Portfolio Showcase",
    portfolioSubtitle: "Explore my journey through projects, certifications, and technical expertise. Each section represents a milestone in my continuous learning path.",
    tabProjects: "Projects",
    tabCertificates: "Certificates",
    tabTech: "Tech Stack",
    btnSeeMore: "See More",
    btnSeeLess: "See Less",

    // Contact
    contactHeader: "Contact Me",
    contactSubtitle: "Have a question? Send me a message, and I will reply as soon as possible.",
    contactTitle: "Contact",
    contactDesc: "Anything to discuss? Send me a message and let's talk.",
    placeholderName: "Your Name",
    placeholderEmail: "Your Email",
    placeholderMessage: "Your Message",
    btnSend: "Send Message",
    btnSending: "Sending...",
    alertSendingTitle: "Sending Message...",
    alertSendingBody: "Please wait while we send your message",
    alertSuccessTitle: "Success!",
    alertSuccessBody: "Your message has been successfully sent!",
    alertErrorTitle: "Failed!",
    alertErrorBody: "An error occurred. Please try again later.",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "id");

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
