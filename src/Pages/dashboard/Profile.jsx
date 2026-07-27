import { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabase";
import {
  User,
  Upload,
  Save,
  ImageIcon,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Code2,
  FileText,
  Camera,
} from "lucide-react";

/* ─── Shared UI ─────────────────────────────────────────────── */
const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
      <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
        <Icon className="w-4 h-4 text-indigo-400" />
      </div>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
    </div>
  </div>
);

const SaveButton = ({ loading, label = "Save Changes" }) => (
  <button type="submit" disabled={loading} className="relative group/s shrink-0">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
    <div className="relative flex items-center gap-2 px-5 py-2.5 bg-[#030014] rounded-xl border border-white/10">
      {loading ? (
        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
      ) : (
        <Save className="w-4 h-4 text-indigo-400" />
      )}
      <span className="text-sm text-gray-200">{loading ? "Saving..." : label}</span>
    </div>
  </button>
);

/* ─── Toast ─────────────────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        type === "success"
          ? "bg-green-500/10 border-green-500/25 text-green-300"
          : "bg-red-500/10 border-red-500/25 text-red-300"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-current/60 hover:text-current">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ─── Tech Stack Checkbox Input ──────────────────────────────── */
const TechStackInput = ({ tags, onChange }) => {
  const PREDEFINED_TECH = [
    "Laravel",
    "PHP",
    "C++",
    "Arduino",
    "MySQL",
    "ReactJS",
    "JavaScript",
    "Tailwind CSS",
    "Vite",
    "Node JS",
    "Bootstrap",
    "HTML",
    "CSS",
    "Git",
    "GitHub",
    "Python",
    "Java",
    "Supabase",
    "PostgreSQL",
    "MongoDB",
    "Firebase",
    "Vue",
    "Next.js"
  ];

  const [customTech, setCustomTech] = useState("");
  const [options, setOptions] = useState([]);

  // Initialize options with predefined + any existing tags not in predefined
  useEffect(() => {
    const uniqueOptions = Array.from(
      new Set([...PREDEFINED_TECH, ...tags])
    );
    setOptions(uniqueOptions);
  }, [tags]);

  const handleToggle = (tech) => {
    if (tags.includes(tech)) {
      onChange(tags.filter((t) => t !== tech));
    } else {
      onChange([...tags, tech]);
    }
  };

  const addCustomTech = (e) => {
    e.preventDefault();
    const val = customTech.trim();
    if (val) {
      if (!options.includes(val)) {
        setOptions([...options, val]);
      }
      if (!tags.includes(val)) {
        onChange([...tags, val]);
      }
      setCustomTech("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search / Add Custom */}
      <div className="flex gap-2 max-w-md">
        <input
          type="text"
          value={customTech}
          onChange={(e) => setCustomTech(e.target.value)}
          placeholder="Add other tech (e.g. Docker, Python)..."
          className="flex-1 bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
        <button
          type="button"
          onClick={addCustomTech}
          className="px-4 py-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-colors text-sm flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Grid of Checkboxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {options.map((tech) => {
          const isChecked = tags.includes(tech);
          return (
            <label
              key={tech}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                isChecked
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/15 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/5 scale-[1.02]"
                  : "bg-[#0d0d22]/50 border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(tech)}
                className="w-4 h-4 rounded border-white/10 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-0 bg-[#0d0d22]"
              />
              <span className="text-xs sm:text-sm font-medium tracking-wide truncate">
                {tech}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-white/5">
        <p>Selected: <span className="text-indigo-400 font-semibold">{tags.length}</span> technologies</p>
      </div>
    </div>
  );
};


/* ─── Main Component ─────────────────────────────────────────── */
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [titleLine1, setTitleLine1] = useState("");
  const [titleLine2, setTitleLine2] = useState("");
  const [descHome, setDescHome] = useState("");
  const [descHomeEn, setDescHomeEn] = useState("");
  const [descAbout, setDescAbout] = useState("");
  const [descAboutEn, setDescAboutEn] = useState("");
  const [quote, setQuote] = useState("");
  const [quoteEn, setQuoteEn] = useState("");
  const [techStack, setTechStack] = useState([]);

  // Photo
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef();

  /* ── fetch ── */
  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (data) {
      setProfile(data);
      setName(data.name || "");
      setTitleLine1(data.title_line1 || "");
      setTitleLine2(data.title_line2 || "");
      setDescHome(data.desc_home || "");
      setDescHomeEn(data.desc_home_en || "");
      setDescAbout(data.desc_about || "");
      setDescAboutEn(data.desc_about_en || "");
      setQuote(data.quote || "");
      setQuoteEn(data.quote_en || "");
      setTechStack(Array.isArray(data.tech_stack) ? data.tech_stack : []);
      setPhotoPreview(data.photo_url || null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, []);

  /* ── upload photo ── */
  const uploadPhoto = async (file) => {
    const ext = file.name.split(".").pop();
    const fileName = `profile-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file, { upsert: true });
    if (upErr) throw upErr;
    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  /* ── save ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photoUrl = profile?.photo_url || null;
      if (photoFile) photoUrl = await uploadPhoto(photoFile);

      const payload = {
        id: 1,
        name,
        title_line1: titleLine1,
        title_line2: titleLine2,
        desc_home: descHome,
        desc_home_en: descHomeEn,
        desc_about: descAbout,
        desc_about_en: descAboutEn,
        quote,
        quote_en: quoteEn,
        tech_stack: techStack,
        photo_url: photoUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profile").upsert(payload);
      if (error) throw error;

      setPhotoFile(null);
      setPhotoPreview(photoUrl);
      setToast({ message: "Profile saved successfully!", type: "success" });
      await fetchProfile();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to save profile. " + err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  /* ── photo pick ── */
  const handlePhotoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  /* ── skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-white/5 rounded-2xl" />
          <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl" />
        </div>
        <div className="h-40 bg-white/5 rounded-2xl" />
        <div className="h-32 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
          <div className="relative w-10 h-10 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-500 text-xs">
            Manage your public profile information
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Photo + Name ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo */}
          <Card>
            <div className="p-6 flex flex-col items-center gap-5">
              <SectionTitle icon={Camera} title="Photo" subtitle="Profile picture" />

              {/* Avatar preview */}
              <div className="relative group/photo">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover/photo:opacity-60 transition duration-500" />
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-white/15">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-gray-600" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-indigo-500 border-2 border-[#030014] flex items-center justify-center hover:bg-indigo-400 transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d0d22] border border-dashed border-white/15 text-gray-400 hover:border-indigo-500/40 hover:text-gray-200 text-sm transition-all"
              >
                <Upload className="w-4 h-4" />
                {photoPreview ? "Change Photo" : "Upload Photo"}
              </button>

              {photoFile && (
                <p className="text-xs text-indigo-300 text-center">
                  📎 {photoFile.name}
                </p>
              )}
            </div>
          </Card>

          {/* Name & Titles */}
          <Card className="lg:col-span-2">
            <div className="p-6 space-y-4">
              <SectionTitle icon={User} title="Identity" subtitle="Name and page titles" />

              <div className="space-y-1.5">
                <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditya Ryan Wardana"
                  className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
                    Hero Title Line 1
                  </label>
                  <input
                    type="text"
                    value={titleLine1}
                    onChange={(e) => setTitleLine1(e.target.value)}
                    placeholder="e.g. Full Stack"
                    className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
                    Hero Title Line 2
                  </label>
                  <input
                    type="text"
                    value={titleLine2}
                    onChange={(e) => setTitleLine2(e.target.value)}
                    placeholder="e.g. Developer"
                    className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Descriptions ── */}
        <Card>
          <div className="p-6 space-y-5">
            <SectionTitle
              icon={FileText}
              title="Profile Descriptions"
              subtitle="Texts shown on the Home and About pages (Bilingual)"
            />

            {/* Home Page Descriptions */}
            <div className="border-b border-white/5 pb-5">
              <h3 className="text-sm font-semibold text-indigo-400 mb-3">Home Page Description</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Indonesian (ID)
                  </label>
                  <textarea
                    value={descHome}
                    onChange={(e) => setDescHome(e.target.value)}
                    placeholder="Deskripsi singkat di halaman utama..."
                    rows={4}
                    className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    English (EN)
                  </label>
                  <textarea
                    value={descHomeEn}
                    onChange={(e) => setDescHomeEn(e.target.value)}
                    placeholder="Short intro for the home page..."
                    rows={4}
                    className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* About Page Descriptions */}
            <div className="border-b border-white/5 pb-5">
              <h3 className="text-sm font-semibold text-indigo-400 mb-3">About Page Bio</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Indonesian (ID)
                  </label>
                  <textarea
                    value={descAbout}
                    onChange={(e) => setDescAbout(e.target.value)}
                    placeholder="Biografi di halaman tentang saya..."
                    rows={5}
                    className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    English (EN)
                  </label>
                  <textarea
                    value={descAboutEn}
                    onChange={(e) => setDescAboutEn(e.target.value)}
                    placeholder="Detailed biography for the about page..."
                    rows={5}
                    className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Quote Descriptions */}
            <div>
              <h3 className="text-sm font-semibold text-indigo-400 mb-3">Favorite Quote</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Indonesian (ID)
                  </label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder='e.g. "Memanfaatkan AI sebagai alat profesional, bukan pengganti."'
                    className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    English (EN)
                  </label>
                  <input
                    type="text"
                    value={quoteEn}
                    onChange={(e) => setQuoteEn(e.target.value)}
                    placeholder='e.g. "Leveraging AI as a professional tool, not a replacement."'
                    className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Tech Stack ── */}
        <Card>
          <div className="p-6 space-y-4">
            <SectionTitle
              icon={Code2}
              title="Tech Stack"
              subtitle="Technologies shown as badges on Home & About pages"
            />
            <TechStackInput tags={techStack} onChange={setTechStack} />
          </div>
        </Card>

        {/* ── Save ── */}
        <div className="flex justify-end">
          <SaveButton loading={saving} label="Save Profile" />
        </div>
      </form>
    </>
  );
}
