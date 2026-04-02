import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { useSyncUser } from "../hooks/useSyncUser";

// ── Skeleton loader for a single card ────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
  );
}

export function Dashboard() {
  const navigate = useNavigate();

  // Sync Clerk user → MongoDB on mount
  useSyncUser();

  // Fetch real dashboard data
  const { data, loading, error } = useDashboard();

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8 pb-12 bg-black text-white">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-red-400 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 rounded-full text-sm font-bold hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    user,
    stats,
    topMatches,
    recentActivity,
    profileCompletion,
    completionPercent,
  } = data;

  // ── Profile completion items ─────────────────────────────
  const completionItems = [
    { label: "Basic Info",   done: profileCompletion.basicInfo },
    { label: "Preferences", done: profileCompletion.preferences },
    { label: "Photos",       done: profileCompletion.photos },
    { label: "Verification", done: profileCompletion.verification },
  ];

  // ── Stat cards ───────────────────────────────────────────
  const statCards = [
    {
      label: "Profile Views",
      value: stats.profileViews.toLocaleString(),
      icon: "👁️",
      delta: `${stats.profileViews} total`,
    },
    {
      label: "Total Matches",
      value: stats.totalMatches.toLocaleString(),
      icon: "✨",
      delta: `${topMatches.length} shown`,
    },
    {
      label: "Messages",
      value: stats.messages.toLocaleString(),
      icon: "💬",
      delta:
        stats.unreadMessages > 0
          ? `${stats.unreadMessages} unread`
          : "All read ✓",
    },
    {
      label: "Listing Views",
      value: stats.listingViews.toLocaleString(),
      icon: "🏠",
      delta: `${stats.listingViews} total`,
    },
  ];

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-12 bg-black text-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">
              Welcome back, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              You have{" "}
              <span className="text-purple-400 font-semibold">
                {stats.totalMatches} matches
              </span>{" "}
              waiting for you
            </p>
          </div>

          <button
            onClick={() => navigate("/listing")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all w-fit"
          >
            + Post a Listing
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Stats row */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/4 border border-white/8"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
                <div className="text-xs text-green-400 mt-1">{s.delta}</div>
              </div>
            ))}
          </div>

          {/* Top Matches */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Your Top Matches</h2>
              <button
                onClick={() => navigate("/search")}
                className="text-xs text-purple-400 hover:underline"
              >
                View All →
              </button>
            </div>

            {topMatches.length === 0 ? (
              <div className="p-8 text-center text-gray-500 rounded-2xl bg-white/4 border border-white/8">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-sm">No matches yet. Complete your profile to get matched!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topMatches.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/4 border border-white/8 hover:border-purple-500/40 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {m.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          {m.name}
                        </span>
                        {m.verified && (
                          <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {m.city} · {m.budget}/mo
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {m.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="text-lg font-black text-purple-400">
                        {m.score}%
                      </div>
                      <div className="text-[10px] text-gray-500">match</div>
                    </div>

                    <button
                      onClick={() => navigate("/messages")}
                      className="opacity-0 group-hover:opacity-100 transition-all bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      Chat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">

            {/* Activity */}
            <div>
              <h2 className="text-lg font-bold mb-4 text-white">
                Recent Activity
              </h2>

              {recentActivity.length === 0 ? (
                <p className="text-xs text-gray-500 px-1">No activity yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <span className="text-lg">{a.icon}</span>
                      <div>
                        <div className="text-xs text-white">{a.text}</div>
                        <div className="text-[10px] text-gray-500">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boost */}
            <div className="p-5 rounded-2xl bg-purple-900/20 border border-purple-500/30">
              <div className="text-sm font-bold mb-1 text-white">
                🚀 Boost Your Profile
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Get 5x more views with a sponsored listing.
              </p>
              <button className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all">
                Upgrade Now
              </button>
            </div>

            {/* Profile Completion */}
            <div className="p-4 rounded-2xl bg-white/4 border border-white/8">
              <div className="text-sm font-bold mb-3 text-white">
                Profile Completion
              </div>

              <div className="space-y-2">
                {completionItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-400">{item.label}</span>
                    <span className={item.done ? "text-green-400" : "text-gray-600"}>
                      {item.done ? "✓ Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              <div className="text-[10px] text-gray-500 mt-1">
                {completionPercent}% complete
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
