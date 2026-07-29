import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  Users,
  Eye,
  Globe2,
  Trash2,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Clock,
  Compass,
  Monitor,
  MapPin,
} from "lucide-react";

/* ─── Shared UI components ──────────────────────────────────── */
const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
);

const StatCard = ({ icon: Icon, value, label, subtitle }) => (
  <Card>
    <div className="p-6 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {subtitle && <p className="text-[10px] text-indigo-400">{subtitle}</p>}
      </div>
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
    </div>
  </Card>
);

/* ─── User Agent Helper ─────────────────────────────────────── */
const parseUserAgent = (ua) => {
  if (!ua) return "Unknown Device";
  let browser = "Other";
  let os = "Other OS";

  // Browser detection
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  // OS detection
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return `${browser} on ${os}`;
};

/* ─── Format Time Ago ────────────────────────────────────────── */
const formatTimeAgo = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

/* ─── Google Maps Helper ────────────────────────────────────── */
const getGoogleMapsUrl = (city, region, country) => {
  const parts = [city, region, country].filter((p) => p && p !== "Unknown");
  if (parts.length === 0) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`;
};

/* ─── Main Component ────────────────────────────────────────── */
export default function Tracker() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 15;

  // Stats
  const [stats, setStats] = useState({
    totalHits: 0,
    uniqueVisitors: 0,
    todayHits: 0,
  });

  const fetchStats = async () => {
    try {
      // 1. Total Hits
      const { count: total } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true });

      // 2. Unique IP count
      const { data: uniqueData } = await supabase
        .from("visitors")
        .select("ip");
      const uniqueIPs = new Set(uniqueData?.map((v) => v.ip) || []);

      // 3. Today's hits
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const { count: today } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true })
        .gte("visited_at", startOfToday.toISOString());

      setStats({
        totalHits: total || 0,
        uniqueVisitors: uniqueIPs.size,
        todayHits: today || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("visitors")
        .select("*", { count: "exact" })
        .order("visited_at", { ascending: false });

      if (search) {
        query = query.or(
          `ip.ilike.%${search}%,city.ilike.%${search}%,country.ilike.%${search}%,referrer.ilike.%${search}%`
        );
      }

      // Apply date filters
      if (filterYear) {
        let startStr = `${filterYear}-01-01T00:00:00.000Z`;
        let endStr = `${filterYear}-12-31T23:59:59.999Z`;

        if (filterMonth) {
          const daysInMonth = new Date(parseInt(filterYear), parseInt(filterMonth), 0).getDate();
          startStr = `${filterYear}-${filterMonth}-01T00:00:00.000Z`;
          endStr = `${filterYear}-${filterMonth}-${daysInMonth}T23:59:59.999Z`;

          if (filterDay) {
            startStr = `${filterYear}-${filterMonth}-${filterDay}T00:00:00.000Z`;
            endStr = `${filterYear}-${filterMonth}-${filterDay}T23:59:59.999Z`;
          }
        }

        query = query.gte("visited_at", startStr).lte("visited_at", endStr);
      }

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, count, error } = await query.range(from, to);

      if (error) throw error;
      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching access logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [page, search, filterYear, filterMonth, filterDay]);

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear ALL access logs? This action is irreversible.")) return;
    setClearing(true);
    try {
      const { error } = await supabase.from("visitors").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all
      if (error) throw error;
      setPage(1);
      setSearch("");
      setFilterYear("");
      setFilterMonth("");
      setFilterDay("");
      fetchStats();
      fetchLogs();
    } catch (err) {
      alert("Failed to clear logs: " + err.message);
    } finally {
      setClearing(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
            <div className="relative w-10 h-10 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Visitor Tracker</h1>
            <p className="text-gray-500 text-xs">
              Monitor who visits your portfolio site in real-time
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { fetchStats(); fetchLogs(); }}
            className="p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
            title="Refresh logs"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleClearLogs}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all text-sm font-medium"
          >
            {clearing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear Logs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Eye} value={stats.totalHits} label="Total Page Views" subtitle="All-time clicks" />
        <StatCard icon={Users} value={stats.uniqueVisitors} label="Unique Visitors" subtitle="Distinct IP addresses" />
        <StatCard icon={Calendar} value={stats.todayHits} label="Views Today" subtitle="Since midnight" />
      </div>

      {/* Main Logs Table card */}
      <Card>
        <div className="p-6 space-y-4">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="flex items-center gap-3 bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 max-w-xs flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by IP, Country, City, Referrer..."
                className="w-full bg-transparent text-gray-200 placeholder-gray-600 text-sm outline-none border-none p-0 focus:ring-0"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-500 hover:text-gray-300 text-xs font-bold shrink-0">
                  Clear
                </button>
              )}
            </div>

            {/* Year Selector */}
            <select
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                setFilterMonth("");
                setFilterDay("");
                setPage(1);
              }}
              className="bg-[#0d0d22] border border-white/10 rounded-xl px-3 py-2.5 text-gray-200 text-sm outline-none focus:border-indigo-500/60 transition-all cursor-pointer min-w-[120px]"
            >
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>

            {/* Month Selector */}
            <select
              value={filterMonth}
              disabled={!filterYear}
              onChange={(e) => {
                setFilterMonth(e.target.value);
                setFilterDay("");
                setPage(1);
              }}
              className="bg-[#0d0d22] border border-white/10 rounded-xl px-3 py-2.5 text-gray-200 text-sm outline-none focus:border-indigo-500/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-w-[130px]"
            >
              <option value="">All Months</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            {/* Day Selector */}
            <select
              value={filterDay}
              disabled={!filterMonth}
              onChange={(e) => {
                setFilterDay(e.target.value);
                setPage(1);
              }}
              className="bg-[#0d0d22] border border-white/10 rounded-xl px-3 py-2.5 text-gray-200 text-sm outline-none focus:border-indigo-500/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-w-[110px]"
            >
              <option value="">All Days</option>
              {Array.from(
                { length: filterYear && filterMonth ? new Date(parseInt(filterYear), parseInt(filterMonth), 0).getDate() : 31 },
                (_, i) => {
                  const dayVal = String(i + 1).padStart(2, "0");
                  return (
                    <option key={dayVal} value={dayVal}>
                      {dayVal}
                    </option>
                  );
                }
              )}
            </select>

            {/* Reset Button */}
            {(filterYear || filterMonth || filterDay || search) && (
              <button
                onClick={() => {
                  setFilterYear("");
                  setFilterMonth("");
                  setFilterDay("");
                  setSearch("");
                  setPage(1);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors px-2 py-1.5 shrink-0"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto rounded-xl border border-white/8">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/8 text-[11px] text-indigo-300 uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3">Visited At</th>
                  <th className="px-5 py-3">IP Address</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Organization / ISP</th>
                  <th className="px-5 py-3">Device / Browser</th>
                  <th className="px-5 py-3">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4 text-sm text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">Loading visitor logs...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-500">
                      No visitor logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/2 transition-colors">
                      {/* Visited At */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-white flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {formatTimeAgo(log.visited_at)}
                          </span>
                          <span className="text-[10px] text-gray-500 mt-0.5">
                            {new Date(log.visited_at).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* IP Address */}
                      <td className="px-5 py-4 font-mono text-xs whitespace-nowrap">
                        {log.ip}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        {getGoogleMapsUrl(log.city, log.region, log.country) ? (
                          <a
                            href={getGoogleMapsUrl(log.city, log.region, log.country)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/loc flex flex-col hover:text-indigo-400 transition-colors"
                            title="Open in Google Maps"
                          >
                            <span className="font-semibold text-white group-hover/loc:text-indigo-300 transition-colors flex items-center gap-1.5">
                              {log.country}
                              <MapPin className="w-3.5 h-3.5 text-gray-500 group-hover/loc:text-indigo-400 transition-colors" />
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 group-hover/loc:text-gray-400 transition-colors">
                              {log.city !== "Unknown" ? `${log.city}, ` : ""}
                              {log.region !== "Unknown" ? log.region : ""}
                            </span>
                          </a>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">🌎 Global Visit</span>
                            <span className="text-xs text-gray-500 mt-0.5">Unknown Location</span>
                          </div>
                        )}
                      </td>

                      {/* Org */}
                      <td className="px-5 py-4 max-w-[200px] truncate text-xs text-gray-400 font-medium" title={log.org}>
                        {log.org || "Direct ISP"}
                      </td>

                      {/* Device */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-gray-500 shrink-0" />
                          <span className="text-xs">{parseUserAgent(log.user_agent)}</span>
                        </div>
                      </td>

                      {/* Referrer */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-gray-500 shrink-0" />
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${
                              log.referrer.toLowerCase().includes("google")
                                ? "bg-red-500/10 border-red-500/20 text-red-300"
                                : log.referrer.toLowerCase().includes("github")
                                ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                                : log.referrer.toLowerCase().includes("linkedin")
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                                : log.referrer === "Direct"
                                ? "bg-gray-500/10 border-gray-500/20 text-gray-400"
                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                            }`}
                          >
                            {log.referrer}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">
                Showing {(page - 1) * itemsPerPage + 1} to{" "}
                {Math.min(page * itemsPerPage, totalCount)} of {totalCount} logs
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
