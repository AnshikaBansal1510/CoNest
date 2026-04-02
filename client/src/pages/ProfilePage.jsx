import React, { useState, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";

// ── Skeleton ─────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;
}

const LIFESTYLE_OPTIONS = [
  "Non-smoker", "Smoker", "Early riser", "Night owl",
  "Vegetarian", "Non-veg", "Pet lover", "No pets",
  "WFH", "Office goer", "Gym lover", "Introvert", "Social",
];

const ProfilePage = () => {
  const { profile, loading, saving, error, saveInfo, savePreferences, triggerVerify } = useProfile();

  const [activeTab, setActiveTab] = useState("info");
  const [saved, setSaved]         = useState(false);

  // Local form state — seeded from API once loaded
  const [form, setForm] = useState({
    name: "", age: "", city: "", occupation: "",
    budget: "", bio: "", lifestyle: [], genderPref: "Any",
  });

  // Seed form when profile arrives from API
  useEffect(() => {
    if (!profile) return;
    setForm({
      name:       profile.name       ?? "",
      age:        profile.age        ?? "",
      city:       profile.city       ?? "",
      occupation: profile.occupation ?? "",
      budget:     profile.budget     ?? "",
      bio:        profile.bio        ?? "",
      lifestyle:  profile.lifestyle  ?? [],
      genderPref: profile.genderPref ?? "Any",
    });
  }, [profile]);

  const toggleLifestyle = (tag) =>
    setForm((prev) => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(tag)
        ? prev.lifestyle.filter((t) => t !== tag)
        : [...prev.lifestyle, tag],
    }));

  // ── Save handlers ────────────────────────────────────────
  const handleSaveInfo = async () => {
    const ok = await saveInfo({
      name:       form.name,
      age:        form.age,
      city:       form.city,
      occupation: form.occupation,
      budget:     form.budget,
      bio:        form.bio,
    });
    if (ok) flashSaved();
  };

  const handleSavePreferences = async () => {
    const ok = await savePreferences({
      lifestyle:  form.lifestyle,
      genderPref: form.genderPref,
    });
    if (ok) flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8 pb-12 bg-black text-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-3">
          <div className="text-4xl">⚠️</div>
          <p className="text-red-400 text-sm">{error}</p>
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

  const verificationItems = [
    { label: "Email Verification",   key: "email",  done: profile.verification.email  },
    { label: "Phone Verification",   key: "phone",  done: profile.verification.phone  },
    { label: "Aadhaar / Govt ID",    key: "govId",  done: profile.verification.govId  },
    { label: "Selfie Verification",  key: "selfie", done: profile.verification.selfie },
  ];

  // Avatar initials from current form (updates as user types)
  const avatarInitials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile.avatar || "??";

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-12 bg-black text-white">
      <div className="max-w-3xl mx-auto">

        {/* ── Header card ───────────────────────────────── */}
        <div className="flex items-center gap-6 mb-8 p-6 rounded-2xl bg-white/4 border border-white/8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl font-black">
            {avatarInitials}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{form.name || "Your Profile"}</h1>
            <p className="text-gray-400 text-sm">
              {form.occupation || "—"} · {form.city || "—"}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">
                Profile {profile.completionPercent}% complete
              </span>
            </div>
          </div>

          <button className="text-xs bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
            Change Photo
          </button>
        </div>

        {/* ── Tabs ───────────────────────────────────────── */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-6 w-fit">
          {["info", "preferences", "verification"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === t
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── INFO tab ───────────────────────────────────── */}
        {activeTab === "info" && (
          <div className="space-y-4 p-6 rounded-2xl bg-white/4 border border-white/8">
            <h2 className="text-lg font-bold text-white">Basic Information</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Full Name",      key: "name",       type: "text"   },
                { label: "Age",            key: "age",        type: "number" },
                { label: "City",           key: "city",       type: "text"   },
                { label: "Occupation",     key: "occupation", type: "text"   },
                { label: "Budget (₹/mo)", key: "budget",     type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-400 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSaveInfo}
              disabled={saving}
              className={`mt-4 px-8 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        )}

        {/* ── PREFERENCES tab ────────────────────────────── */}
        {activeTab === "preferences" && (
          <div className="space-y-6 p-6 rounded-2xl bg-white/4 border border-white/8">
            <h2 className="text-lg font-bold text-white">Lifestyle & Preferences</h2>

            <div>
              <label className="text-sm text-gray-400 mb-3 block">
                Select your lifestyle tags
              </label>
              <div className="flex flex-wrap gap-2">
                {LIFESTYLE_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleLifestyle(tag)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      form.lifestyle.includes(tag)
                        ? "bg-purple-500/20 border-purple-500 text-purple-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-purple-400"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-3 block">Gender Preference</label>
              <div className="flex gap-3">
                {["Any", "Male", "Female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm((p) => ({ ...p, genderPref: g }))}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      form.genderPref === g
                        ? "bg-purple-500/10 border-purple-500 text-purple-400"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Preferences"}
            </button>
          </div>
        )}

        {/* ── VERIFICATION tab ───────────────────────────── */}
        {activeTab === "verification" && (
          <div className="space-y-4 p-6 rounded-2xl bg-white/4 border border-white/8">
            <h2 className="text-lg font-bold text-white">Identity Verification</h2>
            <p className="text-sm text-gray-400">
              Verified profiles get 3x more responses.
            </p>

            {verificationItems.map((v) => (
              <div
                key={v.key}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="text-sm font-medium text-white">{v.label}</div>

                {v.done ? (
                  <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
                    ✓ Verified
                  </span>
                ) : (
                  <button
                    onClick={() => triggerVerify(v.key)}
                    disabled={saving}
                    className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full hover:bg-purple-500/20 disabled:opacity-50"
                  >
                    Verify Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
