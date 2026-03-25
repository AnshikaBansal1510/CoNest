import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/react";
import {
  MdDashboard,
  MdSearch,
  MdChatBubble,
  MdAddHome,
  MdPerson,
  MdMenu,
  MdClose,
} from "react-icons/md";

const navLinks = [
  { to: "/dashboard", label: "Dashboard",    Icon: MdDashboard  },
  { to: "/search",         label: "Search",        Icon: MdSearch     },
  { to: "/messages",       label: "Messages",      Icon: MdChatBubble },
  { to: "/listing",        label: "Post Listing",  Icon: MdAddHome    },
  { to: "/profile",        label: "Profile",       Icon: MdPerson     },
];

export default function Navbar() {
  const { signOut }      = useClerk();
  const { user }         = useUser();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(17,24,39,0.95)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(139,92,246,0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <NavLink to="/main-dashboard" style={{ textDecoration: "none" }} className="flex items-center">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-2xl tracking-tight">
              CoNest
            </span>
          </NavLink>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 12px", borderRadius: 8,
                  textDecoration: "none", fontSize: 13,
                  fontWeight: 500, transition: "all 0.2s",
                  color:      isActive ? "#a855f7" : "#9ca3af",
                  background: isActive ? "rgba(168,85,247,0.1)" : "transparent",
                  border:     isActive ? "1px solid rgba(168,85,247,0.25)" : "1px solid transparent",
                })}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* ── Right: User info + Clerk UserButton ── */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                Hi,{" "}
                <span style={{ color: "#fff", fontWeight: 600 }}>
                  {user.firstName || user.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                </span>
              </span>
            )}

            {/* Clerk's pre-built avatar button with dropdown */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 border-2 border-purple-500",
                },
              }}
            />

            {/* Manual logout button */}
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-400 bg-white/5 border border-white/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
              style={{ fontFamily: "inherit" }}
            >
              Sign Out
            </button>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {open ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {open && (
        <div
          className="md:hidden px-4 pb-5 pt-2"
          style={{
            background: "rgba(17,24,39,0.98)",
            borderTop: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          {/* User info */}
          {user && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <UserButton afterSignOutUrl="/" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
                  {user.fullName || user.firstName}
                </div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>
                  {user.emailAddresses?.[0]?.emailAddress}
                </div>
              </div>
            </div>
          )}

          {/* Nav links */}
          <div className="space-y-1 mb-3">
            {navLinks.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 10,
                  textDecoration: "none", fontSize: 14,
                  fontWeight: 500, transition: "all 0.2s",
                  color:      isActive ? "#a855f7" : "#d1d5db",
                  background: isActive ? "rgba(168,85,247,0.08)" : "transparent",
                  border:     isActive ? "1px solid rgba(168,85,247,0.2)" : "1px solid transparent",
                })}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer transition-all"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444", fontSize: 14, fontFamily: "inherit",
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}