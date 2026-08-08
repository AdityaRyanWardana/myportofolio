import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Sparkles, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function VisitorPromptModal({ isOpen, onSubmit, onSkip }) {
  const [name, setName] = useState("");
  const [instansi, setInstansi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    onSubmit({
      name: name.trim(),
      instansi: instansi.trim() || "Pribadi / Umum",
    });
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-x-hidden overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="fixed inset-0 bg-[#030014]/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md my-8 z-10"
          >
          {/* Glowing Ambient Gradient */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] rounded-3xl blur-xl opacity-30 animate-pulse pointer-events-none" />

          <div className="relative bg-[#0d0d22]/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-white">
            {/* Header Icon */}
            <div className="flex items-center justify-center mb-5">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-60" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-2xl flex items-center justify-center text-indigo-300 shadow-inner">
                  <UserCheck className="w-7 h-7 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Selamat Datang di Portofolio Saya</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Kenalan Dulu Yuk! 👋
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Silakan masukkan nama dan instansi Anda agar kami tahu siapa yang berkunjung.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Nama */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Nama Anda <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4 text-indigo-400/80" />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Aditya / Sarah"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Input Instansi */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Instansi / Perusahaan / Kampus <span className="text-gray-500 text-[10px] lowercase">(opsional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Building2 className="w-4 h-4 text-purple-400/80" />
                  </div>
                  <input
                    type="text"
                    value={instansi}
                    onChange={(e) => setInstansi(e.target.value)}
                    placeholder="Contoh: PT Telkom / Universitas Indonesia / Pribadi"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Identitas dicatat untuk statistik kunjungan portofolio.</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Lanjutkan ke Portofolio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-200 transition-colors font-medium cursor-pointer"
                >
                  Lewati sebagai Tamu Anonim
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
