import React from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { toSlug } from "../utils/slug";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const navigate = useNavigate();

  const handleLiveDemo = (e) => {
    e.stopPropagation(); // Prevent card navigation when opening live demo
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleCardClick = () => {
    if (id && Title) {
      navigate(`/project/${toSlug(Title)}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative w-full h-full flex cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20 h-full w-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

        <div className="relative p-5 z-10 flex flex-col justify-between flex-grow h-full">
          <div>
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={Img}
                alt={Title}
                className="w-full h-full object-cover aspect-[16/8] transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent line-clamp-2 min-h-[3.5rem] flex items-center">
                {Title}
              </h3>

              <p className="text-gray-300/80 text-sm leading-relaxed line-clamp-3 min-h-[4rem] flex items-start">
                {Description}
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
            {ProjectLink ? (
              <a
                href={ProjectLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <span className="text-sm font-medium">Live Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="text-gray-500 text-sm">
                Demo Not Available
              </span>
            )}

            {id ? (
              <div
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 group-hover:bg-white/10 text-white/90 transition-all duration-200 group-hover:scale-105 active:scale-95"
              >
                <span className="text-sm font-medium">Details</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            ) : (
              <span className="text-gray-500 text-sm">
                Details Not Available
              </span>
            )}
          </div>
        </div>
        <div className="absolute inset-0 border border-white/0 group-hover:border-purple-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
      </div>
    </div>
  );
};

export default CardProject;
