import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Users, Brain, Mic, Scan, Clipboard, ExternalLink, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/react';

const stats = [
  { label: "Active Users", value: "50+" },
  { label: "Cities Covered", value: "5+" },
  { label: "Matches Made", value: "20+" },
  { label: "Verified Profiles", value: "50+" },
];

const features = [
  {
    icon: "🧠",
    title: "Smart Matching",
    desc: "AI-driven compatibility scores based on lifestyle, budget, and habits.",
  },
  {
    icon: "🔒",
    title: "Verified Profiles",
    desc: "Multi-step identity verification to ensure every profile is authentic.",
  },
  {
    icon: "💬",
    title: "Secure Messaging",
    desc: "End-to-end encrypted in-app chat before you share any personal details.",
  },
  {
    icon: "🏠",
    title: "Flat Listings",
    desc: "Browse and post detailed flat listings with photos, amenities, and pricing.",
  },
  {
    icon: "🔍",
    title: "Advanced Filters",
    desc: "Filter by city, rent, gender, occupation, and over 20 lifestyle tags.",
  },
  {
    icon: "💳",
    title: "Sponsor & Promote",
    desc: "Boost your listing visibility with flexible sponsored placement plans.",
  },
];
 
const testimonials = [
  {
    name: "Priya Sharma",
    city: "Bangalore",
    text: "Found my perfect flatmate in under a week. The lifestyle match was spot-on!",
    avatar: "PS",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    city: "Mumbai",
    text: "The verification system gave me so much confidence. Felt safe from the first message.",
    avatar: "RM",
    rating: 5,
  },
  {
    name: "Ananya Iyer",
    city: "Delhi",
    text: "Listed my flat and had 10+ verified inquiries in 3 days. Incredible platform!",
    avatar: "AI",
    rating: 5,
  },
];

const LandingPage = () => {

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  // const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoOpen, setDemoOpen] = useState(false);

  const {openSignIn, openSignUp} = useClerk();
  const {user} = useUser();
  
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     localStorage.removeItem('user'); // Remove user data from localStorage
  //     setUser(null); // Update the state
  //     toast.success("You have been logged out!");
  //   } catch (error) {
  //     toast.error("Failed to log out. Please try again.");
  //     console.log("Error logging out:", error.message);
  //   }
  // };
  
  // const scrollToTestimonials = () => {
  //   const testimonialSection = document.getElementById('testimonials');
  //   if (testimonialSection) {
  //     testimonialSection.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };


  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   // console.log(storedUser);
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 ">
      {/* Navigation */}
      <div className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-3xl tracking-tight drop-shadow-sm">
                  CoNest
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>

          {/* <button
            onClick={() => setDemoOpen(true)}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5"
          >
            <ExternalLink className="h-4 w-4" />
            Get a Demo now!
          </button> */}


              <a className="text-sm text-gray-400 hover:text-white" href="#features">Features</a>
              <a className="text-sm text-gray-400 hover:text-white" href="#Testimonials">Testimonials</a>

              {user ? (
                <button
                  //onClick={handleLogout}
                  className="border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-2 rounded-lg hover:bg-purple-600 transition-all"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={ e => openSignIn()}
                    //onClick={() => setLoginOpen(true)}
                    className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all px-6 py-2 rounded-lg"
                  >
                    Log In
                  </button>
                  <button
                    //onClick={() => setSignupOpen(true)}
                    onClick={ e => openSignUp()}
                    className="ml-4 border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-2 rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Signup
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/20 backdrop-blur-sm rounded-lg mt-2">
                <a
                  href="https://github.com/ArshTiwari2004/Recap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub
                  </div>
                </a>

                <a
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium"
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>


                <button
                  onClick={() => {
                    scrollToTestimonials();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                >
                  Testimonials
                </button>

                {/* Mobile Auth Buttons */}
                <div className="pt-4 pb-3 border-t border-gray-700">
                  {user ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-3 rounded-lg hover:bg-purple-600 transition-all text-center"
                    >
                      Logout
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setLoginOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all px-6 py-3 rounded-lg text-center"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setSignupOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-3 rounded-lg hover:bg-purple-600 transition-all text-center"
                      >
                        Signup
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white">
                Find Your
                <span className="  block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Perfect Flatmate.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                ~ CodeNest intelligently matches you with compatible flatmates based on lifestyle, budget, and habits — making shared living genuinely enjoyable.
              </p>
              <div className="flex justify-center">
                {user ? (
                  <button
                    onClick={() => navigate('/main-dashboard')}
                    className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                  >
                    <span className="flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                ) : (
                  <div className='flex flex-col items-center'>
                  <div className="flex gap-4">
                    <button
                    onClick={() => setSignupOpen(true)}
                    className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      Find a flatmate
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                  onClick={() => setSignupOpen(true)}
                  className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    List your flat
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                </div>  
                <p className="text-xl text-gray-500 mt-4">No credit card required · Free to get started</p>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        <section>
      <div className="absolute left-8 top-1/3 hidden xl:block animate-bounce" style={{ animationDuration: "3s" }}>
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-4 w-59">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-bold">KS</div>
              <div>
                <div className="text-sm text-white font-semibold">Kavya S.</div>
                <div className="text-[11px] text-gray-300">94% Match ✨</div>
              </div>
            </div>
            <div className="text-[12px] text-gray-300">₹12,000/mo · Delhi</div>
          </div>
        </div>
        <div className="absolute right-8 bottom-1/3 hidden xl:block animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-4 w-59">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#10B981]">●</span>
              <span className="text-sm text-white font-medium">New Match!</span>
            </div>
            <div className="text-[12px] text-gray-300">Arjun wants to connect with you</div>
          </div>
        </div>
      </section>
 
      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black text-white font-display mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
 
      {/* Features */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-white font-black font-display mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Built for the modern urban renter — safe, smart, and effortless.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-purple-500/40 hover:bg-white/5 transition-all duration-300 cursor-default">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg text-white font-bold mb-2 group-hover:text-purple-500 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.05), transparent 70%)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* How it Works */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #6366F1, transparent 60%)" }} />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl text-white font-black font-display mb-16">3 Steps to Your New Home</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px border-t border-dashed border-white/10" />
            {[
              { step: "01", title: "Create Profile", desc: "Sign up and tell us about your lifestyle, budget, and preferences." },
              { step: "02", title: "Get Matched", desc: "Our algorithm finds compatible flatmates and flat listings for you instantly." },
              { step: "03", title: "Connect & Move", desc: "Chat securely, schedule viewings, and finalize your perfect living arrangement." },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 border border-purple-500/30 flex items-center justify-center text-purple-500 font-black text-lg font-display mb-4">{s.step}</div>
                <h3 className="text-lg text-white font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Testimonials */}
      <section className="py-24 px-6" id="Testimonials">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-white font-display text-center mb-12">Happy Nestmates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/4 border border-white/8">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <span key={j} className="text-purple-500 text-sm">★</span>)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                  <div>
                    <div className="text-sm text-white font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1E1B4B, #312E81)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(245,158,11,0.15), transparent 60%)" }} />
          <h2 className="text-4xl md:text-5xl text-white font-black font-display mb-4 relative">Ready to Find Your Nest?</h2>
          <p className="text-gray-300 mb-8 relative">Join 50+ users who found their ideal living situation on CodeNest.</p>
          <button 
            //onClick={() => navigate("auth", { authMode: "register" })}
            onClick={ e => openSignUp()}
            className="relative bg-gradient-to-r from-purple-400 to-purple-500 text-[#0A0F1E] font-bold text-lg px-10 py-4 rounded-full hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200">
            Create Free Account →
          </button>
        </div>
      </section>
 
      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 text-center text-sm text-gray-600">
        <div className="font-black text-white font-display text-xl mb-3">Co<span className=" font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">Nest</span></div>
        <p>© 2026 CoNest · Privacy · Terms · Contact</p>
      </footer>
    </div>

  );
};


export default LandingPage;

