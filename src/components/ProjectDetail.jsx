import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../utils/LanguageContext";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize2,
  Layers,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
} from "lucide-react";
import Swal from "sweetalert2";
import { toSlug } from "../utils/slug";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-50 blur-2xl z-0" />
      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg">
        <div className="bg-blue-500/20 p-1.5 md:p-2 rounded-full">
          <Code2
            className="text-blue-300 w-4 h-4 md:w-6 md:h-6"
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-blue-200">
            {techStackCount}
          </div>
          <div className="text-[10px] md:text-xs text-gray-400">
            Total Teknologi
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-lg">
        <div className="bg-purple-500/20 p-1.5 md:p-2 rounded-full">
          <Layers
            className="text-purple-300 w-4 h-4 md:w-6 md:h-6"
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-purple-200">
            {featuresCount}
          </div>
          <div className="text-[10px] md:text-xs text-gray-400">
            Fitur Utama
          </div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === "Private") {
    Swal.fire({
      icon: "info",
      title: "Source Code Private",
      text: "Maaf, source code untuk proyek ini bersifat privat.",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#3085d6",
      background: "#030014",
      color: "#ffffff",
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { language } = useLanguage();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0); // Reset active image when project changes
    setIsLightboxOpen(false); // Reset lightbox when project changes

    const fetchProjectDetails = async () => {
      // 1. Try loading from localStorage first for instant display
      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const cached = storedProjects.find((p) => toSlug(p.Title) === slug);
      if (cached) {
        setProject({
          ...cached,
          Features: cached.Features || [],
          TechStack: cached.TechStack || [],
          Github: cached.Github || "https://github.com/AdityaRyanWardana",
          Images: Array.isArray(cached.Images) ? cached.Images : []
        });
      }

      // 2. Fetch live data from Supabase directly to ensure it is up to date
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*");
        
        if (error) throw error;
        
        if (data) {
          // Update localStorage cache
          localStorage.setItem("projects", JSON.stringify(data));
          
          const liveProject = data.find((p) => toSlug(p.Title) === slug);
          if (liveProject) {
            setProject({
              ...liveProject,
              Features: liveProject.Features || [],
              TechStack: liveProject.TechStack || [],
              Github: liveProject.Github || "https://github.com/AdityaRyanWardana",
              Images: Array.isArray(liveProject.Images) ? liveProject.Images : []
            });
          }
        }
      } catch (err) {
        console.error("Error fetching live project details:", err);
      }
    };

    fetchProjectDetails();
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Loading Project...
          </h2>
        </div>
      </div>
    );
  }

  const projectDescription = language === "en" ? (project.Description_EN || project.description_en || project.Description) : project.Description;
  const projectUrl = `https://adityaryan.com/project/${toSlug(project.Title)}`;
  const projectImages = Array.isArray(project.Images) && project.Images.length > 0
    ? project.Images
    : (project.Img ? [project.Img] : []);

  return (
    <>
      <Helmet>
        <title>{project.Title} — Aditya Ryan Wardana</title>
        <meta
          name="description"
          content={
            projectDescription
              ? projectDescription.slice(0, 155)
              : `Project ${project.Title} oleh Aditya Ryan Wardana — Full Stack Web Developer.`
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={projectUrl} />
        <meta
          property="og:title"
          content={`${project.Title} — Aditya Ryan Wardana`}
        />
        <meta
          property="og:description"
          content={projectDescription?.slice(0, 155)}
        />
        <meta property="og:url" content={projectUrl} />
        <meta property="og:type" content="website" />
        {project.Img && <meta property="og:image" content={project.Img} />}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": "${project.Title}",
            "description": "${projectDescription?.replace(/"/g, '\\"')}",
            "url": "${projectUrl}",
            "author": {
              "@type": "Person",
              "name": "Aditya Ryan Wardana",
              "url": "https://adityaryan.com"
            }
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
        <div className="fixed inset-0">
          <div className="absolute -inset-[10px] opacity-20">
            <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
            <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
              <button
                onClick={() => navigate(-1)}
                className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
                <span>Projects</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-white/90 truncate">{project.Title}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
              <div className="space-y-6 md:space-y-10 animate-slideInLeft">
                <div className="space-y-4 md:space-y-6">
                  <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                    {project.Title}
                  </h1>
                  <div className="relative h-1 w-16 md:w-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                    {projectDescription}
                  </p>
                </div>

                <ProjectStats project={project} />

                <div className="flex flex-wrap gap-3 md:gap-4">
                  <a
                    href={project.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                  >
                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                    <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">Live Website</span>
                  </a>

                  <a
                    href={project.Github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 text-purple-300 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                    onClick={(e) =>
                      !handleGithubClick(project.Github) && e.preventDefault()
                    }
                  >
                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-600/10 to-pink-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                    <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">Github</span>
                  </a>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                    <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    Technologies Used
                  </h3>
                  {project.TechStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {project.TechStack.map((tech, index) => (
                        <TechBadge key={index} tech={tech} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-gray-400 opacity-50">
                      No technologies added.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6 md:space-y-10 animate-slideInRight">
                <div className="space-y-4">
                  {/* Main Image View */}
                  <div 
                    onClick={() => setIsLightboxOpen(true)}
                    className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group aspect-[16/10] bg-white/5 flex items-center justify-center cursor-zoom-in"
                  >
                    {projectImages.length > 0 ? (
                      <img
                        src={projectImages[activeImageIndex]}
                        alt={`${project.Title} - Preview`}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:scale-[1.02]"
                        onLoad={() => setIsImageLoaded(true)}
                      />
                    ) : (
                      <div className="text-gray-500">No previews available</div>
                    )}
                    {/* Hover indicator for full screen */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs sm:text-sm font-medium">
                        <Maximize2 className="w-4 h-4" />
                        <span>Click to Expand</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl pointer-events-none" />
                  </div>

                  {/* Thumbnail Selector */}
                  {projectImages.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto py-3 scrollbar-none snap-x">
                      {projectImages.map((imgUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative w-20 h-12 sm:w-24 sm:h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 snap-start ${
                            activeImageIndex === index 
                              ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/20' 
                              : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/20'
                          }`}
                        >
                          <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                  <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                    Key Features
                  </h3>
                  {project.Features.length > 0 ? (
                    <ul className="list-none space-y-2">
                      {project.Features.map((feature, index) => (
                        <FeatureItem key={index} feature={feature} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 opacity-50">
                      No features added.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 10s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-fadeIn {
            animation: fadeIn 0.7s ease-out;
          }
          .animate-slideInLeft {
            animation: slideInLeft 0.7s ease-out;
          }
          .animate-slideInRight {
            animation: slideInRight 0.7s ease-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      {/* Lightbox Modal */}
      {isLightboxOpen && projectImages.length > 0 && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 p-4"
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all hover:scale-105 z-[101]"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls if there are multiple images */}
          {projectImages.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1));
                }}
                className="absolute left-6 p-3.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all hover:scale-105 z-[101] md:block hidden"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-6 p-3.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all hover:scale-105 z-[101] md:block hidden"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Centered Image Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[80vh] flex flex-col items-center justify-center"
          >
            <img
              src={projectImages[activeImageIndex]}
              alt={`${project.Title} - Full Screen Preview`}
              className="max-w-full max-h-full object-contain rounded-xl select-none"
            />
            {projectImages.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-6">
                {/* Mobile controls */}
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1))}
                  className="p-2 bg-white/5 border border-white/10 text-white rounded-full transition-all md:hidden block"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-400 font-medium tracking-wider">
                  {activeImageIndex + 1} / {projectImages.length}
                </span>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1))}
                  className="p-2 bg-white/5 border border-white/10 text-white rounded-full transition-all md:hidden block"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ProjectDetails;
