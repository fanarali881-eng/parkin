import { useState, useEffect } from "react";

// Parkin Logo SVG Component
function ParkinLogo({ className = "", white = false }: { className?: string; white?: boolean }) {
  const darkColor = white ? "#FFFFFF" : "#00565B";
  const lightColor = "#3ECDC6";
  return (
    <svg className={className} viewBox="0 0 180 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* P icon */}
      <rect x="0" y="5" width="22" height="40" rx="3" fill={darkColor} />
      <rect x="0" y="5" width="35" height="22" rx="3" fill={darkColor} />
      <rect x="18" y="12" width="10" height="8" rx="2" fill={lightColor} />
      <circle cx="12" cy="40" r="6" fill={lightColor} />
      {/* باركن text */}
      <text x="95" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill={darkColor} textAnchor="middle" direction="rtl">باركن</text>
      {/* parkin text */}
      <text x="95" y="42" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill={darkColor} textAnchor="middle">parkin</text>
    </svg>
  );
}

// Decorative star SVG
function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <path d="M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z" fill="#3ECDC6" />
    </svg>
  );
}

// Car icon SVG
function CarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 50" fill="none">
      <rect x="5" y="20" width="70" height="25" rx="12" fill="#3ECDC6" />
      <rect x="15" y="10" width="50" height="20" rx="8" fill="#3ECDC6" />
      <circle cx="22" cy="42" r="6" fill="#00565B" />
      <circle cx="58" cy="42" r="6" fill="#00565B" />
    </svg>
  );
}

// Calendar icon SVG
function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="none">
      <rect x="5" y="12" width="50" height="43" rx="6" fill="#3ECDC6" />
      <rect x="5" y="12" width="50" height="15" rx="6" fill="#00565B" />
      <rect x="15" y="5" width="4" height="14" rx="2" fill="#00565B" />
      <rect x="41" y="5" width="4" height="14" rx="2" fill="#00565B" />
      <path d="M25 38 L30 43 L38 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function ParkinHome() {
  const [activeTab, setActiveTab] = useState<"parking" | "later" | "fines">("parking");
  const [zoneCode, setZoneCode] = useState("");
  const [duration, setDuration] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      title: "Variable parking tariff",
      subtitle: "On 4 April 2025, we'll roll out a new parking tariff to help you find parking faster, enjoy better access in busy areas, and pay less when demand is low.",
      italic: true,
    },
    {
      title: "Your Gateway to Easy Parking Solutions!",
      subtitle: "Enjoy the ease and flexibility of Parkin's top services. Explore hassle-free options designed to make your parking experience smooth and convenient.",
      italic: false,
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const infoCards = [
    {
      title: "Variable parking tariff",
      description: "Check parking rates based on zone codes and peak hours to take advantage of variable tariffs so you can plan smarter and save more.",
      icon: "📊",
    },
    {
      title: "Parking Zone Guide",
      description: "Discover zone-specific parking details, including fees and operational hours. Optimise your parking choices and stay informed to avoid fines.",
      icon: "📍",
    },
    {
      title: "Parkin Machines",
      description: "Explore available options and familiarise yourself with how to operate offline parking machines, including the payment processes.",
      icon: "🅿️",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <ParkinLogo className="h-12 w-auto" />
          </a>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-[#00565B] font-semibold text-[15px] border-b-2 border-[#00565B] pb-1">Home</a>
            <a href="#" className="text-gray-700 font-medium text-[15px] hover:text-[#00565B] transition-colors">Individuals</a>
            <a href="#" className="text-gray-700 font-medium text-[15px] hover:text-[#00565B] transition-colors">Business</a>
            <a href="#" className="text-gray-700 font-medium text-[15px] hover:text-[#00565B] transition-colors">Government</a>
            <a href="#" className="text-gray-700 font-medium text-[15px] hover:text-[#00565B] transition-colors">Investors</a>
            <a href="#" className="text-gray-700 font-medium text-[15px] hover:text-[#00565B] transition-colors">More</a>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            <button className="text-[#00565B] font-medium text-[15px] hover:opacity-80">العربية</button>
            <button className="text-[#00565B] font-medium text-[15px] hover:opacity-80">Download App</button>
            <button className="border-2 border-[#00565B] text-[#00565B] font-semibold px-6 py-2 rounded-full hover:bg-[#00565B] hover:text-white transition-colors text-[15px]">Login</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-[680px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-[#f0f4f5] via-[#e8eef0] to-transparent">
            <img
              src="/images/hero-bg.jpg"
              alt="Parking"
              className="absolute right-0 top-0 h-full w-[65%] object-cover object-left"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
            />
          </div>
        </div>

        {/* Decorative elements */}
        <StarIcon className="absolute top-[20%] right-[35%] w-16 h-16 opacity-80 z-10" />
        <StarIcon className="absolute top-[50%] right-[40%] w-8 h-8 opacity-60 z-10" />
        <CalendarIcon className="absolute top-[10%] right-[15%] w-20 h-20 opacity-70 z-10" />
        <CarIcon className="absolute top-[45%] right-[18%] w-24 h-16 opacity-70 z-10" />

        {/* Content */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-6 pt-16">
          {/* Slide content */}
          <div className="max-w-[550px]">
            <h1 className={`text-[42px] leading-tight font-bold text-[#00565B] mb-4 ${slides[currentSlide].italic ? "italic" : ""}`}>
              {slides[currentSlide].title}
            </h1>
            <p className="text-gray-700 text-[15px] leading-relaxed mb-8">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* Payment Form Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-0 max-w-[580px] mt-4">
            {/* Tabs */}
            <div className="flex rounded-t-2xl overflow-hidden">
              <button
                onClick={() => setActiveTab("parking")}
                className={`flex-1 py-3.5 text-[14px] font-semibold transition-all ${
                  activeTab === "parking"
                    ? "bg-white text-[#00565B] border-2 border-[#00565B] rounded-t-xl"
                    : "bg-[#00565B] text-white"
                }`}
              >
                Pay for Parking
              </button>
              <button
                onClick={() => setActiveTab("later")}
                className={`flex-1 py-3.5 text-[14px] font-semibold transition-all ${
                  activeTab === "later"
                    ? "bg-white text-[#00565B] border-2 border-[#00565B] rounded-t-xl"
                    : "bg-[#00565B] text-white"
                }`}
              >
                Pay Later
              </button>
              <button
                onClick={() => setActiveTab("fines")}
                className={`flex-1 py-3.5 text-[14px] font-semibold transition-all ${
                  activeTab === "fines"
                    ? "bg-white text-[#00565B] border-2 border-[#00565B] rounded-t-xl"
                    : "bg-[#00565B] text-white"
                }`}
              >
                Pay Fines
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              {/* Parking Zone */}
              <div className="mb-4">
                <label className="block text-gray-500 text-[13px] mb-1">Parking Zone</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Your Zone Code"
                    value={zoneCode}
                    onChange={(e) => setZoneCode(e.target.value)}
                    className="w-full border-b border-gray-300 py-2.5 pr-10 text-[15px] text-gray-800 placeholder-gray-400 focus:border-[#00565B] focus:outline-none bg-transparent"
                  />
                  <svg className="absolute right-2 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M12 8v4l2 2" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Duration + Now */}
              <div className="flex gap-4 items-end mb-6">
                <div className="flex-1">
                  <label className="block text-gray-500 text-[13px] mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border-b border-gray-300 py-2.5 text-[15px] text-gray-400 focus:border-[#00565B] focus:outline-none bg-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Select duration</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-[14px] text-gray-600 hover:border-[#00565B] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Now
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Continue + Total */}
              <div className="flex items-center justify-between">
                <button className="bg-[#00565B] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#004a4f] transition-colors text-[15px]">
                  Continue
                </button>
                <div className="text-right">
                  <span className="text-gray-500 text-[14px] mr-3">Total:</span>
                  <span className="text-[#00565B] text-[28px] font-bold">
                    <span className="text-[18px] mr-1">Ð</span>0.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <button onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00565B]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <button onClick={() => setIsPaused(!isPaused)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00565B]">
            {isPaused ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            )}
          </button>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? "bg-[#00565B] w-6" : "bg-gray-300"}`}
            />
          ))}
          <button onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00565B]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Right teal strip */}
        <div className="absolute right-0 top-0 w-3 h-full bg-[#00565B] z-30" />
      </section>

      {/* Info Cards Section */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {infoCards.map((card, i) => (
              <a
                key={i}
                href="#"
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all hover:border-[#3ECDC6]"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-[#00565B] text-xl font-bold mb-3 group-hover:text-[#3ECDC6] transition-colors">{card.title}</h3>
                <p className="text-gray-600 text-[14px] leading-relaxed">{card.description}</p>
                <div className="mt-4 text-[#00565B] font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-8 text-center">
        <p className="text-gray-600 text-[15px] mb-4">Need quick and friendly help?</p>
        <a href="#" className="inline-block bg-[#00565B] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#004a4f] transition-colors">
          Contact Us
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f7f8] pt-16 pb-0 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo column */}
            <div>
              <ParkinLogo className="h-24 w-auto mb-4" />
              <p className="text-gray-600 text-[14px] mb-6">Easy Parking Effortless Living</p>
              <p className="text-gray-700 font-semibold text-[14px] mb-3">Get the App</p>
              <div className="flex gap-2">
                <a href="#" className="border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 hover:border-[#00565B] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div className="text-left">
                    <div className="text-[8px] text-gray-500">Download on the</div>
                    <div className="text-[12px] font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 hover:border-[#00565B] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm.91-.91L19.59 12l-1.87-2.21-2.27 2.27 2.27 2.15zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
                  <div className="text-left">
                    <div className="text-[8px] text-gray-500">GET IT ON</div>
                    <div className="text-[12px] font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Individuals column */}
            <div>
              <h4 className="text-[#00565B] font-bold text-[16px] mb-4">Individuals</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Subscribe</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Pay For Parking</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Pay Fines</a></li>
              </ul>
            </div>

            {/* Investors column */}
            <div>
              <h4 className="text-[#00565B] font-bold text-[16px] mb-4">Investors</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Company Overview</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Share price information</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Dubai Financial Market (DFM) Announcements</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Results, Reports, and Presentations</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Corporate Governance</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Sustainability</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Initial Public Offering (IPO)</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Investor Relations (IR) / Media Enquiries</a></li>
              </ul>
            </div>

            {/* More column */}
            <div>
              <h4 className="text-[#00565B] font-bold text-[16px] mb-4">More</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">About Parkin</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Parkin FAQs</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">News Room</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">Terms and conditions</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-[#00565B] py-4 px-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <p className="text-white text-[13px]">© 2026 Parkin All rights reserved.</p>
            <div className="flex items-center gap-4">
              {/* X (Twitter) */}
              <a href="#" className="text-white hover:text-[#3ECDC6] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-white hover:text-[#3ECDC6] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" className="text-white hover:text-[#3ECDC6] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-white hover:text-[#3ECDC6] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right teal strip */}
        <div className="absolute right-0 top-0 w-3 h-full bg-[#00565B]" />
      </footer>
    </div>
  );
}
