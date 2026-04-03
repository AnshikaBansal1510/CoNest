import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const allListings = [
  { id: 1, name: "Priya K.", title: "Cozy Room in Koramangala", city: "Bangalore", area: "Koramangala", rent: 12000, gender: "Female", occupation: "IT Professional", tags: ["AC", "WiFi", "Gym", "Vegetarian"], score: 91, avatar: "PK", verified: true, furnished: "Fully" },
  { id: 2, name: "Ravi M.", title: "Spacious 2BHK in Bandra", city: "Mumbai", area: "Bandra West", rent: 22000, gender: "Any", occupation: "Finance", tags: ["Sea View", "Parking", "Balcony"], score: 84, avatar: "RM", verified: true, furnished: "Semi" },
  { id: 3, name: "Sneha T.", title: "Studio Near Metro", city: "Delhi", area: "Lajpat Nagar", rent: 9500, gender: "Female", occupation: "Student", tags: ["Metro Access", "Quiet Area", "WiFi"], score: 77, avatar: "ST", verified: false, furnished: "Fully" },
  { id: 4, name: "Aarav P.", title: "Bright Room in Aundh", city: "Pune", area: "Aundh", rent: 8000, gender: "Male", occupation: "Student", tags: ["Bike Parking", "Gated", "Mess Nearby"], score: 73, avatar: "AP", verified: true, furnished: "Unfurnished" },
  { id: 5, name: "Nisha R.", title: "Luxury Flat HSR Layout", city: "Bangalore", area: "HSR Layout", rent: 18000, gender: "Female", occupation: "Any", tags: ["Pool", "Gym", "24hr Security"], score: 88, avatar: "NR", verified: true, furnished: "Fully" },
  { id: 6, name: "Karan V.", title: "Affordable in Kothrud", city: "Pune", area: "Kothrud", rent: 6500, gender: "Male", occupation: "IT Professional", tags: ["Near IT Park", "WiFi", "Cook"], score: 69, avatar: "KV", verified: false, furnished: "Semi" },
];

export function SearchPage() {
  const [filters, setFilters] = useState({ city: "", minRent: "", maxRent: "", gender: "", furnished: "", search: "" });
  const [sortBy, setSortBy] = useState("score");
  const [view, setView] = useState("grid");
  const navigate = useNavigate();

  const updateFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const filtered = allListings
    .filter(l => {
      if (filters.city && l.city !== filters.city) return false;
      if (filters.gender && filters.gender !== "Any" && l.gender !== "Any" && l.gender !== filters.gender) return false;
      if (filters.furnished && l.furnished !== filters.furnished) return false;
      if (filters.minRent && l.rent < parseInt(filters.minRent)) return false;
      if (filters.maxRent && l.rent > parseInt(filters.maxRent)) return false;
      if (filters.search && !l.title.toLowerCase().includes(filters.search.toLowerCase()) && !l.area.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => sortBy === "score" ? b.score - a.score : a.rent - b.rent);

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-12 bg-black text-white">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-black font-display mb-6 text-white">
          Find Flatmates & Listings
        </h1>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              value={filters.search}
              onChange={e => updateFilter("search", e.target.value)}
              placeholder="Search by area, keyword..."
              className="w-full bg-gray-900 border border-purple-500/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-1 p-1 rounded-xl bg-gray-900 border border-purple-500/30">
            {["grid", "list"].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${view === v
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {v === "grid" ? "⊞" : "☰"}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 p-4 rounded-2xl bg-gray-900 border border-purple-500/20">
          {[
            { key: "city", label: "City", allLabel: "All Cities", options: ["", "Bangalore", "Mumbai", "Delhi", "Pune"] },
            { key: "gender", label: "Gender", allLabel: "All Genders", options: ["", "Any", "Male", "Female"] },
            { key: "furnished", label: "Furnished", allLabel: "Any Furnishing", options: ["", "Fully", "Semi", "Unfurnished"] },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[10px] text-gray-400 mb-1">
                {f.label}
              </label>
              <select
                value={filters[f.key]}
                onChange={e => updateFilter(f.key, e.target.value)}
                className="w-full bg-black border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {f.options.map(o => (
                  <option key={o} value={o} className="bg-black">
                    {o || f.allLabel}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label className="block text-[10px] text-gray-400 mb-1">
              Min Rent (₹)
            </label>
            <input
              type="number"
              value={filters.minRent}
              onChange={e => updateFilter("minRent", e.target.value)}
              className="w-full bg-black border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 mb-1">
              Max Rent (₹)
            </label>
            <input
              type="number"
              value={filters.maxRent}
              onChange={e => updateFilter("maxRent", e.target.value)}
              className="w-full bg-black border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            {filtered.length} listings found
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            Sort by:
            {["score", "rent"].map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1 rounded-full transition-all ${sortBy === s
                    ? "bg-purple-500/20 text-purple-400"
                    : "hover:text-white"
                  }`}
              >
                {s === "score" ? "Best Match" : "Lowest Rent"}
              </button>
            ))}
          </div>
        </div>

        {/* Listings */}
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {filtered.map(l => (
            <div
              key={l.id}
              className="group p-5 rounded-2xl bg-gray-900 border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-xs font-bold">
                    {l.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {l.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {l.area}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-purple-400">
                    {l.score}%
                  </div>
                  <div className="text-[10px] text-gray-500">match</div>
                </div>
              </div>

              <h3 className="font-bold text-sm mb-1 text-white">
                {l.title}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-green-400 font-bold text-sm">
                  ₹{l.rent.toLocaleString()}/mo
                </span>
                <span className="text-xs bg-black border border-purple-500/30 px-2 py-0.5 rounded-full text-gray-400">
                  {l.furnished}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {l.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] bg-black border border-purple-500/20 px-2 py-0.5 rounded-full text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/messages/${l.id}`)}
                  className="flex-1 py-2 rounded-lg bg-purple-600/20 text-purple-400 text-xs font-semibold hover:bg-purple-600/30 transition-all"
                >
                  💬 Message
                </button>

                <button
                  onClick={() => navigate(`/profile/${l.id}`)}
                  className="flex-1 py-2 rounded-lg bg-gray-800 text-white text-xs font-semibold hover:bg-gray-700 transition-all"
                >
                  View Profile
                </button>
              </div>

              {l.verified && (
                <div className="mt-2 text-center text-[10px] text-green-400">
                  ✓ Identity Verified
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}