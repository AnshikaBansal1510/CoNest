import React from 'react'
import { useState } from 'react';

const ListingPage = () => {
  const [form, setForm] = useState({ title: "", city: "", area: "", rent: "", deposit: "", furnished: "Fully", rooms: "1", gender: "Any", desc: "", amenities: [] });
  const [sponsored, setSponsored] = useState(false);
  const [submitted, setSubmitted] = useState(false);
 
  const amenityOptions = ["WiFi", "AC", "Parking", "Gym", "Pool", "24hr Security", "Lift", "Power Backup", "Cook", "Laundry", "Pet Friendly", "Balcony"];
 
  const toggleAmenity = (a) => setForm(prev => ({ ...prev, amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a] }));
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (sponsored) {
      // Trigger Razorpay for sponsorship
      alert("Razorpay payment for sponsorship would trigger here!");
    }
    setSubmitted(true);
  };
 
  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-black font-display mb-2">Listing Posted!</h2>
          <p className="text-gray-400 mb-6">{sponsored ? "Your listing is sponsored and will appear at the top." : "Your listing is now live."}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("dashboard")} className="bg-purple-500 text-[#0A0F1E] font-bold px-6 py-2.5 rounded-full text-sm">Go to Dashboard</button>
            <button onClick={() => { setSubmitted(false); setForm({ title: "", city: "", area: "", rent: "", deposit: "", furnished: "Fully", rooms: "1", gender: "Any", desc: "", amenities: [] }); }} className="bg-white/10 text-white font-medium px-6 py-2.5 rounded-full text-sm hover:bg-white/15">Post Another</button>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-12 bg-black text-white">
  <div className="max-w-2xl mx-auto">
    
    <h1 className="text-4xl font-black font-display mb-2 text-white">
      Post a Listing
    </h1>
    <p className="text-gray-400 text-sm mb-8">
      Fill in the details to attract the right flatmate.
    </p>

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Basic Details */}
      <div className="p-6 rounded-2xl bg-white/4 border border-white/8 space-y-4">
        <h2 className="font-bold text-xs text-purple-400 uppercase tracking-wider">
          Basic Details
        </h2>

        <input
          required
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          placeholder="e.g. Sunny Room in Koramangala"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />

        <div className="grid grid-cols-2 gap-4">
          {[{ k: "city", ph: "City" }, { k: "area", ph: "Area" }, { k: "rent", ph: "Rent ₹" }, { k: "deposit", ph: "Deposit ₹" }].map(f => (
            <input
              key={f.k}
              required
              value={form[f.k]}
              onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
              placeholder={f.ph}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          ))}
        </div>

        {/* Selects */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { k: "furnished", opts: ["Fully", "Semi", "Unfurnished"] },
            { k: "rooms", opts: ["1", "2", "3", "Entire Flat"] },
            { k: "gender", opts: ["Any", "Male", "Female"] }
          ].map(f => (
            <select
              key={f.k}
              value={form[f.k]}
              onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {f.opts.map(o => (
                <option key={o} value={o} className="bg-black">
                  {o}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Description */}
        <textarea
          rows={4}
          value={form.desc}
          onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
          placeholder="Describe the flat..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
        />
      </div>

      {/* Amenities */}
      <div className="p-6 rounded-2xl bg-white/4 border border-white/8">
        <h2 className="font-bold text-xs text-purple-400 uppercase tracking-wider mb-4">
          Amenities
        </h2>

        <div className="flex flex-wrap gap-2">
          {amenityOptions.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                form.amenities.includes(a)
                  ? "bg-purple-500/20 border-purple-500 text-purple-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-purple-400"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Sponsorship */}
      <div
        className={`p-6 rounded-2xl border transition-all cursor-pointer ${
          sponsored
            ? "border-purple-500 bg-purple-500/10"
            : "border-white/10 bg-white/4 hover:border-purple-400"
        }`}
        onClick={() => setSponsored(s => !s)}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="font-bold text-sm flex items-center gap-2">
              🚀 Sponsor Listing
              <span className="text-[10px] bg-purple-500 text-black px-2 py-0.5 rounded-full font-bold">
                ₹299/mo
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Get 5x visibility in search results.
            </p>
          </div>

          <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
            sponsored ? "bg-purple-500 border-purple-500" : "border-gray-600"
          }`}>
            {sponsored && <span className="text-black text-xs font-bold">✓</span>}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base transition-all"
      >
        {sponsored ? "Post & Sponsor →" : "Post Listing →"}
      </button>

    </form>
  </div>
</div>
  );
}

export default ListingPage