import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ParkinChat from "@/components/ParkinChat";

/* ───── Logo Component ───── */
function ParkinLogo({ white = false }: { white?: boolean }) {
  return (
    <img src="/images/parkin-logo.png" alt="Parkin" className="h-[50px] w-auto" style={white ? {filter:'brightness(0) invert(1)'} : {}}/>
  );
}

export default function ParkinHome() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"pay"|"later"|"fines">("pay");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);


  const slides = [
    { title:"Variable parking tariff", desc:"On 4 April 2025, we'll roll out a new parking tariff to help you find parking faster, enjoy better access in busy areas, and pay less when demand is low.", italic:true, bg:"/images/banner1_variable_tariff.jpg" },
    { title:"Your Gateway to Easy Parking Solutions!", desc:"Enjoy the ease and flexibility of Parkin's top services. Explore hassle-free options designed to make your parking experience as smooth as possible.", italic:false, bg:"/images/banner2_gateway.jpg" },
  ];

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setCurrentSlide(p => (p+1)%slides.length), 5000);
    return () => clearInterval(t);
  }, [isPaused, slides.length]);

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Inter','Segoe UI',sans-serif"}}>

      {/* ═══════ HEADER ═══════ */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[72px]">
          <a href="/"><ParkinLogo /></a>
          <nav className="hidden lg:flex items-center gap-8">
            {["Home","Individuals","Business","Government","Investors","More"].map((t,i)=>(
              <a key={t} href="#" className={`text-[15px] font-medium ${i===0?"text-[#00565B] border-b-2 border-[#00565B] pb-1":"text-gray-700 hover:text-[#00565B]"} transition-colors`}>{t}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-[#00565B] text-[15px] font-medium">العربية</button>
            <button className="text-[#00565B] text-[15px] font-medium">Download App</button>
            <button className="border-2 border-[#00565B] text-[#00565B] px-6 py-2 rounded-full text-[15px] font-semibold hover:bg-[#00565B] hover:text-white transition-colors">Login</button>
          </div>
        </div>
      </header>

      {/* ═══════ HERO SLIDER ═══════ */}
      <section className="relative w-full overflow-hidden" style={{height:"700px"}}>
        {slides.map((s,i)=>(
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===currentSlide?"opacity-100 z-10":"opacity-0 z-0"}`}>
            {/* High quality image with sharp rendering */}
            <img
              src={s.bg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden' }}
              loading="eager"
            />
            {/* Lighter gradient for better image visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent"/>
            <div className="relative z-20 max-w-[1400px] mx-auto px-6 pt-16">
              <h1 className={`text-[#00565B] max-w-[600px] leading-[1.15] text-[46px] ${s.italic?"italic font-semibold":"font-bold"}`}>{s.title}</h1>
              <p className="text-gray-700 text-[15px] max-w-[550px] mt-5 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}

        {/* Right teal strip */}
        <div className="absolute right-0 top-0 bottom-0 w-[18px] bg-[#00565B] z-20"/>

        {/* Form */}
        <div className="absolute z-30 left-6 lg:left-[calc((100%-1400px)/2+24px)] bottom-[60px] w-[580px]">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex bg-[#00565B]">
              {([["pay","Pay for Parking"],["later","Pay Later"],["fines","Pay Fines"]] as const).map(([id,label])=>(
                <button key={id} onClick={()=>setActiveTab(id)} className={`flex-1 py-3.5 text-[14px] font-semibold transition-all ${activeTab===id?"bg-white text-[#00565B] rounded-t-xl":"text-white"}`}>{label}</button>
              ))}
            </div>
            <div className="p-6">
              {/* Parking Zone */}
              <div className="border border-gray-200 rounded-xl p-3 mb-4">
                <label className="text-[12px] text-gray-500 block mb-1">Parking Zone</label>
                <div className="flex items-center justify-between">
                  <input type="text" placeholder="Enter Your Zone Code" className="bg-transparent text-[14px] text-gray-600 outline-none flex-1"/>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M10 2V4M10 16V18M2 10H4M16 10H18" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
              </div>
              {/* Duration + Now */}
              <div className="flex gap-4 mb-4">
                <div className="border border-gray-200 rounded-xl p-3 flex-1">
                  <label className="text-[12px] text-gray-500 block mb-1">Duration</label>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-400">Select duration</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400"><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </div>
                </div>
                <button className="border border-[#00565B] rounded-xl px-5 flex items-center gap-2 text-[#00565B] text-[14px] font-medium">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#00565B" strokeWidth="1.5" fill="none"/><path d="M9 5V9L12 11" stroke="#00565B" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Now
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 6.5L7.5 4" stroke="#00565B" strokeWidth="1.5"/></svg>
                </button>
              </div>
              {/* Continue + Total */}
              <div className="flex items-center justify-between">
                <button onClick={()=>navigate("/summary-payment")} className="bg-[#00565B] text-white px-8 py-3 rounded-full text-[14px] font-semibold hover:bg-[#004a4f] transition-colors">Continue</button>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-[15px]">Total:</span>
                  <span className="text-[#00565B] text-[28px] font-bold"><span className="text-[18px]">Ð</span> 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider controls */}
        <div className="absolute z-30 bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button onClick={()=>setCurrentSlide(p=>(p-1+slides.length)%slides.length)} className="text-gray-500 hover:text-[#00565B]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg></button>
          <button onClick={()=>setIsPaused(!isPaused)} className="text-gray-500 hover:text-[#00565B]">
            {isPaused?<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>:<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>}
          </button>
          {slides.map((_,i)=><button key={i} onClick={()=>setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i===currentSlide?"bg-[#00565B] w-6":"bg-gray-300"}`}/>)}
          <button onClick={()=>setCurrentSlide(p=>(p+1)%slides.length)} className="text-gray-500 hover:text-[#00565B]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </div>


      </section>

      {/* ═══════ 3 INFO CARDS WITH IMAGES ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {img:"/images/Variableparkingtariff.png",title:"Variable parking tariff",desc:"Check parking rates based on zone codes and peak hours to take advantage of variable tariffs so you can plan smarter and save more."},
            {img:"/images/ParkingZoneGuide.png",title:"Parking Zone Guide",desc:"Discover zone-specific parking details, including fees and operational hours. Optimise your parking choices and stay informed to avoid fines."},
            {img:"/images/ParkinMachines.png",title:"Parkin Machines",desc:"Explore available options and familiarise yourself with how to operate offline parking machines, including the payment processes."},
          ].map((c,i)=>(
            <a key={i} href="#" className="group block">
              <div className="overflow-hidden rounded-2xl mb-5">
                <img src={c.img} alt={c.title} className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
              </div>
              <h3 className="text-[#00565B] text-[20px] font-bold mb-3">{c.title}</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed mb-4">{c.desc}</p>
              <span className="inline-block border border-[#00565B] text-[#00565B] px-6 py-2 rounded-full text-[13px] font-medium hover:bg-[#00565B] hover:text-white transition-colors">Learn More</span>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ DISCOVER STRESS-FREE ═══════ */}
      <section className="bg-[#F0FAF9] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-[#00565B] text-[34px] font-bold text-center mb-16">Discover the Key to Stress-Free Parking!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {icon:"/images/SeamlessExperience.png",title:"Seamless Experience",desc:"Enjoy hassle-free parking with Parkin's intuitive solutions."},
              {icon:"/images/EffortlessTransactions.png",title:"Effortless Transactions",desc:"Easily manage all your parking needs, from booking to subscription, with Parkin user-friendly platform."},
              {icon:"/images/24_7CustomerSupport.png",title:"24/7 Customer Support",desc:"Get reliable assistance round the clock for all your parking needs."},
            ].map((f,i)=>(
              <div key={i}>
                <div className="w-[56px] h-[56px] bg-[#E0F5F3] rounded-xl flex items-center justify-center mb-5">
                  <img src={f.icon} alt="" className="w-7 h-7" style={{ imageRendering: 'crisp-edges' }}/>
                </div>
                <h3 className="text-[#00565B] text-[20px] font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ APP BANNER ═══════ */}
      <section className="relative overflow-hidden" style={{minHeight:'380px'}}>
        <img src="/images/NewFeature.webp" alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
        <div className="absolute inset-0 bg-[#1a1a2e]/75"/>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16 flex items-center h-full" style={{minHeight:'380px'}}>
          <div>
            <h2 className="text-white text-[32px] font-bold mb-4">Get the Parkin App</h2>
            <p className="text-gray-300 text-[16px] mb-8 max-w-[400px]">Download the Parkin app for a seamless parking experience. Pay, manage, and track your parking anytime, anywhere.</p>
            <a href="#" className="inline-block border border-white text-white px-8 py-3 rounded-full text-[14px] font-medium hover:bg-white hover:text-[#1a1a2e] transition-colors">Download App</a>
          </div>
        </div>
      </section>

      {/* ═══════ 4 SERVICE CARDS ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {img:"/images/Parkinfines.jpeg",title:"Pay Parking Fines",desc:"Pay and manage your fines effortlessly with the Parkin platform for a smooth parking experience.",btn:"Learn More"},
            {img:"/images/Image(5).png",title:"Pay for Parking",desc:"Choose your parking type and zone to pay instantly or schedule it later with ease.",btn:"Learn More"},
            {img:"/images/Image.png",title:"Subscribe to a Parking",desc:"Make parking easier with a subscription offering access to designated facilities when needed.",btn:"Learn More"},
            {img:"/images/Image(4).png",title:"Get a Permit",desc:"Access exclusive parking privileges with permits designed for convenience and comfort.",btn:"Coming Soon"},
          ].map((c,i)=>(
            <a key={i} href="#" className="group block overflow-hidden rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
              </div>
              <div className="p-6">
                <h3 className="text-[#00565B] text-[22px] font-bold mb-2">{c.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed mb-4">{c.desc}</p>
                <span className="inline-block border border-[#00565B] text-[#00565B] px-6 py-2 rounded-full text-[13px] font-medium hover:bg-[#00565B] hover:text-white transition-colors">{c.btn}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ PERSONALISED FEATURES ═══════ */}
      <section className="bg-[#F0FAF9] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-[#00565B] text-[34px] font-bold text-center mb-4">Personalised Features for the Ultimate Parking Convenience</h2>
          <p className="text-gray-500 text-[16px] text-center max-w-[700px] mx-auto mb-16 leading-relaxed">Seamlessly tailored to your needs, our innovative features redefine the parking experience, ensuring smooth transactions, streamlined management, and hassle-free payments.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {img:"/images/Image(1).png",title:"Personalised Notifications",desc:"Stay updated with real-time alerts tailored to your parking preferences and activities."},
              {img:"/images/Image(2).png",title:"Multi-Vehicle Management",desc:"Easily manage parking for multiple vehicles from a single account with seamless switching."},
              {img:"/images/Image(3).png",title:"Contactless Payments",desc:"Experience fast and secure contactless payment options for a hassle-free parking experience."},
            ].map((c,i)=>(
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-[300px] object-cover" loading="lazy"/>
                </div>
                <div className="p-6">
                  <h3 className="text-[#00565B] text-[18px] font-bold mb-2">{c.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT US ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 text-center">
        <h2 className="text-[#00565B] text-[34px] font-bold mb-4">Contact Us</h2>
        <p className="text-gray-500 text-[16px] max-w-[600px] mx-auto mb-12">Have questions or need assistance? Our team is here to help you with all your parking needs.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px] mx-auto">
          {[
            {icon:"📞",title:"Call Us",info:"800-PARKIN (727546)"},
            {icon:"📧",title:"Email Us",info:"info@parkin.ae"},
            {icon:"📍",title:"Visit Us",info:"Dubai, UAE"},
          ].map((c,i)=>(
            <div key={i} className="p-6 rounded-2xl border border-gray-100">
              <div className="text-3xl mb-4">{c.icon}</div>
              <h3 className="text-[#00565B] text-[16px] font-bold mb-2">{c.title}</h3>
              <p className="text-gray-500 text-[14px]">{c.info}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative">
        {/* Main footer */}
        <div className="bg-[#f5f7f8] pt-16 pb-12">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Logo */}
              <div>
                <ParkinLogo />
                <p className="text-gray-600 text-[14px] mt-4 mb-6">Easy Parking Effortless Living</p>
                <p className="text-gray-700 font-semibold text-[14px] mb-3">Get the App</p>
                <div className="flex gap-3">
                  <img src="/images/Appstore.svg" alt="App Store" className="h-[40px] cursor-pointer"/>
                  <img src="/images/Googleplay.svg" alt="Google Play" className="h-[40px] cursor-pointer"/>
                </div>
              </div>
              {/* Individuals */}
              <div>
                <h4 className="text-[#00565B] font-bold text-[16px] mb-4">Individuals</h4>
                <ul className="space-y-3">
                  {["Subscribe","Pay For Parking","Pay Fines","Pay Later","Get a Permit"].map(t=><li key={t}><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">{t}</a></li>)}
                </ul>
              </div>
              {/* Investors */}
              <div>
                <h4 className="text-[#00565B] font-bold text-[16px] mb-4">Investors</h4>
                <ul className="space-y-3">
                  {["Company Overview","Share price information","DFM Announcements","Results, Reports, and Presentations","Corporate Governance","Sustainability","Initial Public Offering (IPO)","IR / Media Enquiries"].map(t=><li key={t}><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">{t}</a></li>)}
                </ul>
              </div>
              {/* More */}
              <div>
                <h4 className="text-[#00565B] font-bold text-[16px] mb-4">More</h4>
                <ul className="space-y-3">
                  {["About Parkin","Contact Us","Parkin FAQs","Blog","Partners","News Room","Careers","Privacy Policy","Terms and conditions"].map(t=><li key={t}><a href="#" className="text-gray-600 text-[14px] hover:text-[#00565B] transition-colors">{t}</a></li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="bg-[#00565B] py-4 px-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <p className="text-white text-[13px]">© {new Date().getFullYear()} Parkin All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            </div>
          </div>
        </div>
        {/* Right teal strip */}
        <div className="absolute right-0 top-0 w-[12px] h-full bg-[#00565B]"/>
      </footer>

      {/* ═══════ LIVE CHAT ═══════ */}
      <ParkinChat />
    </div>
  );
}
