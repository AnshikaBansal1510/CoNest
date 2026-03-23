import React, { useState } from "react";


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Rahul Verma", age: "26", city: "Bangalore", occupation: "Software Engineer",
    budget: "15000", bio: "Laid-back, clean, and respectful. Love cooking on weekends.",
    gender: "Male", lifestyle: ["Non-smoker", "Early riser", "Vegetarian"],
  });
  const lifestyleOptions = ["Non-smoker", "Smoker", "Early riser", "Night owl", "Vegetarian", "Non-veg", "Pet lover", "No pets", "WFH", "Office goer", "Gym lover", "Introvert", "Social"];
 
  const toggleLifestyle = (tag) => {
    setForm(prev => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(tag) ? prev.lifestyle.filter(t => t !== tag) : [...prev.lifestyle, tag]
    }));
  };
 
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return(
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-12 bg-black text-white">
  <div className="max-w-3xl mx-auto">

    {/* Header */}
    <div className="flex items-center gap-6 mb-8 p-6 rounded-2xl bg-white/4 border border-white/8">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl font-black">
        RV
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-black font-display text-white">
          {form.name}
        </h1>
        <p className="text-gray-400 text-sm">
          {form.occupation} · {form.city}
        </p>

        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">
            Profile 50% complete
          </span>
          <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-full border border-white/8">
            ⚡ Pro Plan
          </span>
        </div>
      </div>

      <button className="text-xs bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
        Change Photo
      </button>
    </div>

    {/* Tabs */}
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-6 w-fit">
      {["info", "preferences", "verification"].map(t => (
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

    {/* INFO */}
    {activeTab === "info" && (
      <div className="space-y-4 p-6 rounded-2xl bg-white/4 border border-white/8">
        <h2 className="text-lg font-bold text-white">Basic Information</h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Full Name", key: "name", type: "text" },
            { label: "Age", key: "age", type: "number" },
            { label: "City", key: "city", type: "text" },
            { label: "Occupation", key: "occupation", type: "text" },
            { label: "Budget (₹/mo)", key: "budget", type: "number" }
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-gray-400 mb-1.5">
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          ))}

          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`mt-4 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    )}

    {/* PREFERENCES */}
    {activeTab === "preferences" && (
      <div className="space-y-6 p-6 rounded-2xl bg-white/4 border border-white/8">
        <h2 className="text-lg font-bold text-white">
          Lifestyle & Preferences
        </h2>

        {/* Lifestyle */}
        <div>
          <label className="text-sm text-gray-400 mb-3 block">
            Select your lifestyle tags
          </label>

          <div className="flex flex-wrap gap-2">
            {lifestyleOptions.map(tag => (
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

        {/* Gender */}
        <div>
          <label className="text-sm text-gray-400 mb-3 block">
            Gender Preference
          </label>

          <div className="flex gap-3">
            {["Any", "Male", "Female"].map(g => (
              <button
                key={g}
                onClick={() => setForm(p => ({ ...p, gender: g }))}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  form.gender === g
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
          onClick={handleSave}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {saved ? "✓ Saved!" : "Save Preferences"}
        </button>
      </div>
    )}

    {/* VERIFICATION */}
    {activeTab === "verification" && (
      <div className="space-y-4 p-6 rounded-2xl bg-white/4 border border-white/8">
        <h2 className="text-lg font-bold text-white">
          Identity Verification
        </h2>

        <p className="text-sm text-gray-400">
          Verified profiles get 3x more responses.
        </p>

        {[
          { label: "Email Verification", status: "done" },
          { label: "Phone Verification", status: "done" },
          { label: "Aadhaar / Govt ID", status: "pending" },
          { label: "Selfie Verification", status: "pending" },
        ].map((v, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div>
              <div className="text-sm font-medium text-white">
                {v.label}
              </div>
            </div>

            {v.status === "done" ? (
              <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
                ✓ Verified
              </span>
            ) : (
              <button className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full hover:bg-purple-500/20">
                Verify Now
              </button>
            )}
          </div>
        ))}
      </div>
    )}

  </div>
</div>
  )
}

export default ProfilePage