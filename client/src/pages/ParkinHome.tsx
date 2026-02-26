import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ParkinChat from "@/components/ParkinChat";

/* ───── Translations ───── */
const t: Record<string, Record<string, string>> = {
  // Header nav
  home: { en: "Home", ar: "الرئيسية" },
  individuals: { en: "Individuals", ar: "الأفراد" },
  business: { en: "Business", ar: "الأعمال" },
  government: { en: "Government", ar: "الحكومة" },
  investors: { en: "Investors", ar: "المستثمرون" },
  more: { en: "More", ar: "المزيد" },

  // Slides
  slide1_title: { en: "Variable parking tariff", ar: "تعرفة مواقف متغيرة" },
  slide1_desc: { en: "On 4 April 2025, we'll roll out a new parking tariff to help you find parking faster, enjoy better access in busy areas, and pay less when demand is low.", ar: "في 4 أبريل 2025، سنطلق تعرفة مواقف جديدة لمساعدتك في إيجاد موقف أسرع، والاستمتاع بوصول أفضل في المناطق المزدحمة، ودفع أقل عندما يكون الطلب منخفضاً." },
  slide2_title: { en: "Your Gateway to Easy Parking Solutions!", ar: "بوابتك لحلول المواقف السهلة!" },
  slide2_desc: { en: "Enjoy the ease and flexibility of Parkin's top services. Explore hassle-free options designed to make your parking experience as smooth as possible.", ar: "استمتع بسهولة ومرونة خدمات باركن المميزة. اكتشف خيارات مصممة لجعل تجربة المواقف سلسة قدر الإمكان." },

  // Form
  pay_parking: { en: "Pay for Parking", ar: "ادفع للمواقف" },
  pay_later: { en: "Pay Later", ar: "ادفع لاحقاً" },
  pay_fines: { en: "Pay Fines", ar: "ادفع المخالفات" },
  parking_zone: { en: "Parking Zone", ar: "منطقة المواقف" },
  enter_zone: { en: "Enter Your Zone Code", ar: "أدخل رمز المنطقة" },
  duration: { en: "Duration", ar: "المدة" },
  select_duration: { en: "Select duration", ar: "اختر المدة" },
  now: { en: "Now", ar: "الآن" },
  continue_btn: { en: "Continue", ar: "متابعة" },
  total: { en: "Total:", ar: "الإجمالي:" },

  // 3 Info Cards
  card1_title: { en: "Variable parking tariff", ar: "تعرفة مواقف متغيرة" },
  card1_desc: { en: "Check parking rates based on zone codes and peak hours to take advantage of variable tariffs so you can plan smarter and save more.", ar: "تحقق من أسعار المواقف بناءً على رموز المناطق وساعات الذروة للاستفادة من التعرفة المتغيرة والتخطيط بذكاء والتوفير أكثر." },
  card2_title: { en: "Parking Zone Guide", ar: "دليل مناطق المواقف" },
  card2_desc: { en: "Discover zone-specific parking details, including fees and operational hours. Optimise your parking choices and stay informed to avoid fines.", ar: "اكتشف تفاصيل المواقف حسب المنطقة، بما في ذلك الرسوم وساعات العمل. حسّن خياراتك وابقَ على اطلاع لتجنب المخالفات." },
  card3_title: { en: "Parkin Machines", ar: "أجهزة باركن" },
  card3_desc: { en: "Explore available options and familiarise yourself with how to operate offline parking machines, including the payment processes.", ar: "استكشف الخيارات المتاحة وتعرف على كيفية تشغيل أجهزة المواقف، بما في ذلك عمليات الدفع." },
  learn_more: { en: "Learn More", ar: "اعرف المزيد" },

  // Discover
  discover_title: { en: "Discover the Key to Stress-Free Parking!", ar: "اكتشف مفتاح المواقف بدون توتر!" },
  seamless_title: { en: "Seamless Experience", ar: "تجربة سلسة" },
  seamless_desc: { en: "Enjoy hassle-free parking with Parkin's intuitive solutions.", ar: "استمتع بمواقف بدون عناء مع حلول باركن الذكية." },
  effortless_title: { en: "Effortless Transactions", ar: "معاملات سهلة" },
  effortless_desc: { en: "Easily manage all your parking needs, from booking to subscription, with Parkin user-friendly platform.", ar: "أدر جميع احتياجات المواقف بسهولة، من الحجز إلى الاشتراك، مع منصة باركن سهلة الاستخدام." },
  support_title: { en: "24/7 Customer Support", ar: "دعم العملاء 24/7" },
  support_desc: { en: "Get reliable assistance round the clock for all your parking needs.", ar: "احصل على مساعدة موثوقة على مدار الساعة لجميع احتياجات المواقف." },

  // New Feature
  new_feature: { en: "New Feature!", ar: "ميزة جديدة!" },
  new_feature_desc: { en: "Take control and manage your subscription with ease from your Parkin dashboard. Renew your card, Update your vehicle details, or modify your subscription terms with just a few clicks.", ar: "تحكم وأدر اشتراكك بسهولة من لوحة تحكم باركن. جدد بطاقتك، حدّث بيانات مركبتك، أو عدّل شروط اشتراكك بنقرات قليلة." },
  check_it_out: { en: "Check it Out", ar: "اكتشف الآن" },

  // 4 Service Cards
  pay_fines_title: { en: "Pay Parking Fines", ar: "ادفع مخالفات المواقف" },
  pay_fines_desc: { en: "Pay and manage your fines effortlessly with the Parkin platform for a smooth parking experience.", ar: "ادفع وأدر مخالفاتك بسهولة مع منصة باركن لتجربة مواقف سلسة." },
  pay_parking_title: { en: "Pay for Parking", ar: "ادفع للمواقف" },
  pay_parking_desc: { en: "Choose your parking type and zone to pay instantly or schedule it later with ease.", ar: "اختر نوع الموقف والمنطقة للدفع فوراً أو جدولته لاحقاً بسهولة." },
  subscribe_title: { en: "Subscribe to a Parking", ar: "اشترك في موقف" },
  subscribe_desc: { en: "Make parking easier with a subscription offering access to designated facilities when needed.", ar: "اجعل المواقف أسهل مع اشتراك يوفر الوصول للمرافق المخصصة عند الحاجة." },
  permit_title: { en: "Get a Permit", ar: "احصل على تصريح" },
  permit_desc: { en: "Access exclusive parking privileges with permits designed for convenience and comfort.", ar: "احصل على امتيازات مواقف حصرية مع تصاريح مصممة للراحة والملاءمة." },
  coming_soon: { en: "Coming Soon", ar: "قريباً" },

  // Personalised
  personal_title: { en: "Personalised Features for the Ultimate Parking Convenience", ar: "ميزات مخصصة لأقصى راحة في المواقف" },
  personal_desc: { en: "Seamlessly tailored to your needs, our innovative features redefine the parking experience, ensuring smooth transactions, streamlined management, and hassle-free payments.", ar: "مصممة بسلاسة حسب احتياجاتك، ميزاتنا المبتكرة تعيد تعريف تجربة المواقف، مع ضمان معاملات سلسة وإدارة مبسطة ومدفوعات بدون عناء." },
  notif_title: { en: "Personalised Notifications", ar: "إشعارات مخصصة" },
  notif_desc: { en: "Stay updated with real-time alerts tailored to your parking preferences and activities.", ar: "ابقَ على اطلاع بتنبيهات فورية مخصصة حسب تفضيلاتك وأنشطتك." },
  multi_title: { en: "Multi-Vehicle Management", ar: "إدارة عدة مركبات" },
  multi_desc: { en: "Easily manage parking for multiple vehicles from a single account with seamless switching.", ar: "أدر مواقف عدة مركبات من حساب واحد مع تبديل سلس." },
  contactless_title: { en: "Contactless Payments", ar: "الدفع بدون تلامس" },
  contactless_desc: { en: "Experience fast and secure contactless payment options for a hassle-free parking experience.", ar: "جرب خيارات الدفع بدون تلامس السريعة والآمنة لتجربة مواقف بدون عناء." },

  // Need Help
  need_help: { en: "Need Help?", ar: "تحتاج مساعدة؟" },
  need_help_desc: { en: "We're here for you! If you have any questions or need assistance, don't hesitate to reach out. Contact our support team for quick and friendly help.", ar: "نحن هنا من أجلك! إذا كان لديك أي أسئلة أو تحتاج مساعدة، لا تتردد في التواصل معنا. تواصل مع فريق الدعم للحصول على مساعدة سريعة وودية." },
  contact_us: { en: "Contact Us", ar: "تواصل معنا" },

  // Submenu items & descriptions
  seasonal_parking: { en: "Seasonal Parking", ar: "المواقف الموسمية" },
  seasonal_parking_d: { en: "Secure your parking spot for the season with flexible plans tailored to your needs.", ar: "احجز موقفك للموسم مع خطط مرنة مصممة حسب احتياجاتك." },
  multi_storey: { en: "Multi-storey Parking", ar: "مواقف متعددة الطوابق" },
  multi_storey_d: { en: "Access convenient multi-storey parking facilities across key locations.", ar: "استخدم مرافق المواقف متعددة الطوابق في المواقع الرئيسية." },
  valet_parking: { en: "Valet Parking", ar: "خدمة صف السيارات" },
  valet_parking_d: { en: "Enjoy premium valet parking services for a hassle-free experience.", ar: "استمتع بخدمة صف السيارات المميزة لتجربة بدون عناء." },
  fleet_mgmt: { en: "Fleet Management", ar: "إدارة الأسطول" },
  fleet_mgmt_d: { en: "Manage your fleet parking needs efficiently with our comprehensive solutions.", ar: "أدر احتياجات مواقف أسطولك بكفاءة مع حلولنا الشاملة." },
  business_solutions: { en: "Business Solutions", ar: "حلول الأعمال" },
  business_solutions_d: { en: "Tailored parking solutions designed to meet your business requirements.", ar: "حلول مواقف مصممة لتلبية متطلبات أعمالك." },
  corporate_parking: { en: "Corporate Parking", ar: "مواقف الشركات" },
  corporate_parking_d: { en: "Dedicated corporate parking programs for your organization.", ar: "برامج مواقف مخصصة لمؤسستك." },
  govt_services: { en: "Government Services", ar: "الخدمات الحكومية" },
  govt_services_d: { en: "Parking services and solutions for government entities.", ar: "خدمات وحلول المواقف للجهات الحكومية." },
  public_parking: { en: "Public Parking", ar: "المواقف العامة" },
  public_parking_d: { en: "Manage and access public parking zones across the city.", ar: "أدر واستخدم مناطق المواقف العامة في أنحاء المدينة." },
  // Submenu descriptions for individuals
  pay_parking_sub_d: { en: "Pay for parking only when your business needs it with this fast, easy, and commitment-free option.", ar: "ادفع للمواقف فقط عند الحاجة مع هذا الخيار السريع والسهل." },
  subscribe_sub_d: { en: "Simplify parking with a subscription that saves costs and ensures a smooth experience for your team, customers, and guests.", ar: "بسّط المواقف مع اشتراك يوفر التكاليف ويضمن تجربة سلسة." },
  pay_fines_sub_d: { en: "Resolve your corporate parking fines swiftly with our simple, convenient payment process.", ar: "سدد مخالفات المواقف بسرعة مع عملية الدفع البسيطة والمريحة." },
  pay_later_sub_d: { en: "Park now and pay later with flexible payment options for your convenience.", ar: "اركن الآن وادفع لاحقاً مع خيارات دفع مرنة لراحتك." },
  get_permit_sub_d: { en: "Claim your FREE parking permit, exclusively for residents in high-density areas and priority groups.", ar: "احصل على تصريح مواقف مجاني، حصرياً لسكان المناطق ذات الكثافة العالية." },
  reserve_sub_d: { en: "Enjoy exclusive reserved parking and a seamless experience for your team, customers, and guests, with added savings on longer plans.", ar: "استمتع بمواقف محجوزة حصرية وتجربة سلسة مع توفير إضافي على الخطط الطويلة." },

  // Footer
  easy_parking: { en: "Easy Parking Effortless Living", ar: "مواقف سهلة حياة مريحة" },
  get_app: { en: "Get the App", ar: "حمّل التطبيق" },
  subscribe: { en: "Subscribe", ar: "اشترك" },
  pay_for_parking_f: { en: "Pay For Parking", ar: "ادفع للمواقف" },
  pay_fines_f: { en: "Pay Fines", ar: "ادفع المخالفات" },
  pay_later_f: { en: "Pay Later", ar: "ادفع لاحقاً" },
  get_permit_f: { en: "Get a Permit", ar: "احصل على تصريح" },
  company_overview: { en: "Company Overview", ar: "نبذة عن الشركة" },
  share_price: { en: "Share price information", ar: "معلومات سعر السهم" },
  dfm: { en: "DFM Announcements", ar: "إعلانات سوق دبي المالي" },
  results_reports: { en: "Results, Reports, and Presentations", ar: "النتائج والتقارير والعروض" },
  governance: { en: "Corporate Governance", ar: "الحوكمة المؤسسية" },
  sustainability: { en: "Sustainability", ar: "الاستدامة" },
  ipo: { en: "Initial Public Offering (IPO)", ar: "الطرح العام الأولي" },
  media: { en: "IR / Media Enquiries", ar: "استفسارات الإعلام" },
  about: { en: "About Parkin", ar: "عن باركن" },
  faqs: { en: "Parkin FAQs", ar: "الأسئلة الشائعة" },
  blog: { en: "Blog", ar: "المدونة" },
  partners: { en: "Partners", ar: "الشركاء" },
  newsroom: { en: "News Room", ar: "غرفة الأخبار" },
  careers: { en: "Careers", ar: "الوظائف" },
  privacy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  terms: { en: "Terms and conditions", ar: "الشروط والأحكام" },
  rights: { en: "Parkin All rights reserved.", ar: "باركن جميع الحقوق محفوظة." },
};

/* ───── Logo Component ───── */
function ParkinLogo({ white = false, size = 'h-[50px]' }: { white?: boolean; size?: string }) {
  return (
    <img src="/images/parkin-logo.png" alt="Parkin" className={`${size} w-auto`} style={white ? {filter:'brightness(0) invert(1)'} : {}}/>
  );
}

export default function ParkinHome() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"pay"|"later"|"fines">("pay");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lang, setLang] = useState<"en"|"ar">("en");
  const [openMenu, setOpenMenu] = useState<string|null>(null);

  const L = (key: string) => t[key]?.[lang] || t[key]?.en || key;
  const isAr = lang === "ar";

  const slides = [
    { title: L("slide1_title"), desc: L("slide1_desc"), italic:true, bg:"/images/banner1_variable_tariff.jpg" },
    { title: L("slide2_title"), desc: L("slide2_desc"), italic:false, bg:"/images/banner2_gateway.jpg" },
  ];

  const navMenus: { key: string; label: string; subs: { label: string; desc: string }[] }[] = [
    { key: "home", label: L("home"), subs: [] },
    { key: "individuals", label: L("individuals"), subs: [
      { label: L("pay_for_parking_f"), desc: L("pay_parking_sub_d") },
      { label: L("subscribe"), desc: L("subscribe_sub_d") },
      { label: L("pay_fines_f"), desc: L("pay_fines_sub_d") },
      { label: L("pay_later_f"), desc: L("pay_later_sub_d") },
      { label: L("get_permit_f"), desc: L("get_permit_sub_d") },
      { label: L("seasonal_parking"), desc: L("seasonal_parking_d") },
      { label: L("multi_storey"), desc: L("multi_storey_d") },
      { label: L("valet_parking"), desc: L("valet_parking_d") },
    ]},
    { key: "business", label: L("business"), subs: [
      { label: L("pay_for_parking_f"), desc: L("pay_parking_sub_d") },
      { label: L("subscribe"), desc: L("subscribe_sub_d") },
      { label: "Reserve", desc: L("reserve_sub_d") },
      { label: L("pay_fines_f"), desc: L("pay_fines_sub_d") },
      { label: L("get_permit_f"), desc: L("get_permit_sub_d") },
    ]},
    { key: "government", label: L("government"), subs: [
      { label: L("govt_services"), desc: L("govt_services_d") },
      { label: L("public_parking"), desc: L("public_parking_d") },
      { label: L("fleet_mgmt"), desc: L("fleet_mgmt_d") },
      { label: L("corporate_parking"), desc: L("corporate_parking_d") },
    ]},
    { key: "investors", label: L("investors"), subs: [
      { label: L("company_overview"), desc: "" },
      { label: L("share_price"), desc: "" },
      { label: L("dfm"), desc: "" },
      { label: L("results_reports"), desc: "" },
      { label: L("governance"), desc: "" },
      { label: L("sustainability"), desc: "" },
      { label: L("ipo"), desc: "" },
      { label: L("media"), desc: "" },
    ]},
    { key: "more", label: L("more"), subs: [
      { label: L("about"), desc: "" },
      { label: L("contact_us"), desc: "" },
      { label: L("faqs"), desc: "" },
      { label: L("blog"), desc: "" },
      { label: L("partners"), desc: "" },
      { label: L("newsroom"), desc: "" },
      { label: L("careers"), desc: "" },
    ]},
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setCurrentSlide(p => (p+1)%slides.length), 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Inter','Segoe UI',sans-serif"}} dir={isAr ? "rtl" : "ltr"}>

      {/* ═══════ HEADER ═══════ */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-nowrap items-center h-[72px]">
          <a href="/" className="flex-shrink-0 mr-8"><ParkinLogo /></a>
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center whitespace-nowrap">
            {navMenus.map((menu,i)=>(
              <div key={menu.key} className="relative" onMouseEnter={()=>menu.subs.length>0&&setOpenMenu(menu.key)} onMouseLeave={()=>setOpenMenu(null)}>
                <a href="#" className={`text-[15px] font-medium ${i===0?"text-[#045464] border-b-2 border-[#045464] pb-1":"text-gray-700 hover:text-[#045464]"} transition-colors py-6 inline-block whitespace-nowrap`}>{menu.label}</a>
              </div>
            ))}
          </nav>
          <div className="flex-shrink-0 ml-8">
            <button onClick={()=>setLang(lang==="en"?"ar":"en")} className="text-[#045464] text-[15px] font-medium hover:underline transition whitespace-nowrap">{lang==="en"?"العربية":"English"}</button>
          </div>
        </div>
        {/* ═══ MEGA MENU DROPDOWN ═══ */}
        {openMenu && navMenus.find(m=>m.key===openMenu)?.subs.length! > 0 && (
          <div className="absolute left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-40" onMouseEnter={()=>setOpenMenu(openMenu)} onMouseLeave={()=>setOpenMenu(null)}>
            <div className="max-w-[1400px] mx-auto px-6 py-10">
              {(() => {
                const menu = navMenus.find(m=>m.key===openMenu)!;
                const hasDes = menu.subs.some(s=>s.desc);
                if (hasDes) {
                  return (
                    <div className="grid grid-cols-2 gap-x-16 gap-y-10">
                      {menu.subs.map((sub,idx)=>(
                        <div key={idx}>
                          <a href="#" className="text-[#045464] font-semibold text-[16px] underline underline-offset-4 hover:opacity-80 transition">{sub.label}</a>
                          {sub.desc && <p className="text-gray-600 text-[14px] mt-2 leading-relaxed">{sub.desc}</p>}
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                      {menu.subs.map((sub,idx)=>(
                        <a key={idx} href="#" className="text-[#045464] font-semibold text-[16px] underline underline-offset-4 hover:opacity-80 transition py-1">{sub.label}</a>
                      ))}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </header>

      {/* ═══════ HERO SLIDER ═══════ */}
      <section className="relative w-full overflow-hidden bg-[#045464]" style={{height:"700px"}}>
        {slides.map((s,i)=>(
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===currentSlide?"opacity-100 z-10":"opacity-0 z-0"}`}>
            {/* Image slightly smaller - leaves teal visible on right and bottom */}
            <div className="absolute top-0 left-0" style={{width:'calc(100% - 40px)', height:'calc(100% - 50px)'}}>
              <img src={s.bg} alt="" className="w-full h-full object-cover" style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden' }} loading="eager"/>
              <div className={`absolute inset-0 bg-gradient-to-${isAr?'l':'r'} from-white/80 via-white/40 to-transparent`}/>
              {/* Car image - original from parkin.ae */}
              <img src="/car.webp" alt="" className="absolute bottom-[-5px] right-[25px]" style={{width:'160px', height:'auto', zIndex:5, opacity:0.85}} />
            </div>
            <div className={`relative z-20 max-w-[1400px] mx-auto px-6 pt-16`}>
              <h1 className={`text-[#045464] max-w-[600px] leading-[1.15] text-[46px] ${s.italic?"italic font-semibold":"font-bold"}`}>{s.title}</h1>
              <p className="text-gray-700 text-[15px] max-w-[550px] mt-5 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}

        {/* Right teal strip is now visible as part of bg-[#045464] background */}



        {/* Form */}
        <div className="absolute z-30 bottom-[60px] w-[580px]" style={{left: isAr ? 'auto' : 'calc((100% - 1400px)/2 + 80px)', right: isAr ? 'calc((100% - 1400px)/2 + 80px)' : 'auto'}}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="flex bg-[#045464] rounded-t-2xl p-1.5 gap-1">
              {([['pay',L('pay_parking')],['later',L('pay_later')],['fines',L('pay_fines')]] as const).map(([id,label])=>(
                <button key={id} onClick={()=>setActiveTab(id as any)} className={`flex-1 py-3 text-[14px] font-semibold transition-all rounded-full ${activeTab===id?"bg-white text-[#045464] border-2 border-[#045464]":"text-white"}`}>{label}</button>
              ))}
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-xl p-3 mb-4">
                <label className="text-[12px] text-gray-500 block mb-1">{L("parking_zone")}</label>
                <div className="flex items-center justify-between">
                  <input type="text" placeholder={L("enter_zone")} className="bg-transparent text-[14px] text-gray-600 outline-none flex-1"/>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M10 2V4M10 16V18M2 10H4M16 10H18" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="border border-gray-200 rounded-xl p-3 flex-1">
                  <label className="text-[12px] text-gray-500 block mb-1">{L("duration")}</label>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-400">{L("select_duration")}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400"><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </div>
                </div>
                <button className="border border-[#045464] rounded-full px-4 py-2 flex items-center gap-2 text-[#045464] text-[13px] font-medium">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#045464" strokeWidth="1.5" fill="none"/><path d="M9 5V9L12 11" stroke="#045464" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  {L("now")}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 6.5L7.5 4" stroke="#045464" strokeWidth="1.5"/></svg>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={()=>navigate("/summary-payment")} className="bg-[#045464] text-white px-8 py-3 rounded-full text-[14px] font-semibold hover:bg-[#004a4f] transition-colors">{L("continue_btn")}</button>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-[15px]">{L("total")}</span>
                  <span className="text-[#045464] text-[28px] font-bold"><span className="text-[18px]">Ð</span> 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider controls */}
        <div className="absolute z-30 bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button onClick={()=>setCurrentSlide(p=>(p-1+slides.length)%slides.length)} className="text-gray-500 hover:text-[#045464]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg></button>
          <button onClick={()=>setIsPaused(!isPaused)} className="text-gray-500 hover:text-[#045464]">
            {isPaused?<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>:<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>}
          </button>
          {slides.map((_,i)=><button key={i} onClick={()=>setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i===currentSlide?"bg-[#045464] w-6":"bg-gray-300"}`}/>)}
          <button onClick={()=>setCurrentSlide(p=>(p+1)%slides.length)} className="text-gray-500 hover:text-[#045464]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </div>
      </section>

      {/* ═══════ 3 INFO CARDS WITH IMAGES ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {img:"/images/Variableparkingtariff.png",title:L("card1_title"),desc:L("card1_desc")},
            {img:"/images/ParkingZoneGuide.png",title:L("card2_title"),desc:L("card2_desc")},
            {img:"/images/ParkinMachines.png",title:L("card3_title"),desc:L("card3_desc")},
          ].map((c,i)=>(
            <a key={i} href="#" className="group block">
              <div className="overflow-hidden rounded-2xl mb-5">
                <img src={c.img} alt={c.title} className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
              </div>
              <h3 className="text-[#045464] text-[20px] font-bold mb-3">{c.title}</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed mb-4">{c.desc}</p>
              <span className="inline-block border border-[#045464] text-[#045464] px-6 py-2 rounded-full text-[13px] font-medium hover:bg-[#045464] hover:text-white transition-colors">{L("learn_more")}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ DISCOVER STRESS-FREE ═══════ */}
      <section className="bg-[#F0FAF9] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-[#045464] text-[34px] font-bold text-center mb-16">{L("discover_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {icon:"/images/SeamlessExperience.png",title:L("seamless_title"),desc:L("seamless_desc")},
              {icon:"/images/EffortlessTransactions.png",title:L("effortless_title"),desc:L("effortless_desc")},
              {icon:"/images/24_7CustomerSupport.png",title:L("support_title"),desc:L("support_desc")},
            ].map((f,i)=>(
              <div key={i}>
                <div className="w-[56px] h-[56px] bg-[#E0F5F3] rounded-xl flex items-center justify-center mb-5">
                  <img src={f.icon} alt="" className="w-7 h-7" style={{ imageRendering: 'crisp-edges' }}/>
                </div>
                <h3 className="text-[#045464] text-[20px] font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEW FEATURE BANNER ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="relative overflow-hidden rounded-2xl" style={{minHeight:'380px'}}>
          <img src="/images/NewFeature.webp" alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
          <div className={`absolute inset-0 bg-gradient-to-${isAr?'l':'r'} from-black/60 via-black/40 to-transparent`}/>
          <div className="relative z-10 px-10 py-16 flex items-center h-full" style={{minHeight:'380px'}}>
            <div>
              <h2 className="text-white text-[34px] font-bold mb-4">{L("new_feature")}</h2>
              <p className="text-gray-200 text-[15px] mb-8 max-w-[450px] leading-relaxed">{L("new_feature_desc")}</p>
              <a href="#" className="inline-block border border-white text-white px-8 py-3 rounded-full text-[14px] font-medium hover:bg-white hover:text-[#1a1a2e] transition-colors">{L("check_it_out")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 4 SERVICE CARDS ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {img:"/images/Parkinfines.jpeg",title:L("pay_fines_title"),desc:L("pay_fines_desc"),btn:L("learn_more")},
            {img:"/images/Image(5).png",title:L("pay_parking_title"),desc:L("pay_parking_desc"),btn:L("learn_more")},
            {img:"/images/Image.png",title:L("subscribe_title"),desc:L("subscribe_desc"),btn:L("learn_more")},
            {img:"/images/Image(4).png",title:L("permit_title"),desc:L("permit_desc"),btn:L("coming_soon")},
          ].map((c,i)=>(
            <a key={i} href="#" className="group block overflow-hidden rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
              </div>
              <div className="p-6">
                <h3 className="text-[#045464] text-[22px] font-bold mb-2">{c.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed mb-4">{c.desc}</p>
                <span className="inline-block border border-[#045464] text-[#045464] px-6 py-2 rounded-full text-[13px] font-medium hover:bg-[#045464] hover:text-white transition-colors">{c.btn}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ PERSONALISED FEATURES ═══════ */}
      <section className="bg-[#F0FAF9] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-[#045464] text-[34px] font-bold text-center mb-4">{L("personal_title")}</h2>
          <p className="text-gray-500 text-[16px] text-center max-w-[700px] mx-auto mb-16 leading-relaxed">{L("personal_desc")}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {img:"/images/Image(1).png",title:L("notif_title"),desc:L("notif_desc")},
              {img:"/images/Image(2).png",title:L("multi_title"),desc:L("multi_desc")},
              {img:"/images/Image(3).png",title:L("contactless_title"),desc:L("contactless_desc")},
            ].map((c,i)=>(
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-[300px] object-cover" loading="lazy"/>
                </div>
                <div className="p-6">
                  <h3 className="text-[#045464] text-[18px] font-bold mb-2">{c.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEED HELP ═══════ */}
      <section className="bg-[#F0FAF9] py-20 text-center">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-[#045464] text-[34px] font-bold mb-4">{L("need_help")}</h2>
          <p className="text-gray-500 text-[16px] max-w-[700px] mx-auto mb-8">{L("need_help_desc")}</p>
          <a href="#" className="inline-block bg-[#045464] text-white px-8 py-3 rounded-full text-[14px] font-medium hover:bg-[#004048] transition-colors">{L("contact_us")}</a>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative">
        <div className="bg-[#f5f7f8] pt-16 pb-12">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <ParkinLogo size="h-[120px]" />
                <p className="text-gray-600 text-[14px] mt-4 mb-6">{L("easy_parking")}</p>
                <p className="text-gray-700 font-semibold text-[14px] mb-3">{L("get_app")}</p>
                <div className="flex gap-3">
                  <img src="/images/Appstore.svg" alt="App Store" className="h-[40px] cursor-pointer"/>
                  <img src="/images/Googleplay.svg" alt="Google Play" className="h-[40px] cursor-pointer"/>
                </div>
              </div>
              <div>
                <h4 className="text-[#045464] font-bold text-[16px] mb-4">{L("individuals")}</h4>
                <ul className="space-y-3">
                  {[L("subscribe"),L("pay_for_parking_f"),L("pay_fines_f"),L("pay_later_f"),L("get_permit_f")].map(item=><li key={item}><a href="#" className="text-gray-600 text-[14px] hover:text-[#045464] transition-colors">{item}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-[#045464] font-bold text-[16px] mb-4">{L("investors")}</h4>
                <ul className="space-y-3">
                  {[L("company_overview"),L("share_price"),L("dfm"),L("results_reports"),L("governance"),L("sustainability"),L("ipo"),L("media")].map(item=><li key={item}><a href="#" className="text-gray-600 text-[14px] hover:text-[#045464] transition-colors">{item}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-[#045464] font-bold text-[16px] mb-4">{L("more")}</h4>
                <ul className="space-y-3">
                  {[L("about"),L("contact_us"),L("faqs"),L("blog"),L("partners"),L("newsroom"),L("careers"),L("privacy"),L("terms")].map(item=><li key={item}><a href="#" className="text-gray-600 text-[14px] hover:text-[#045464] transition-colors">{item}</a></li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#045464] py-4 px-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <p className="text-white text-[13px]">© {new Date().getFullYear()} {L("rights")}</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            </div>
          </div>
        </div>
        <div className={`absolute ${isAr?'left':'right'}-0 top-0 w-[12px] h-full bg-[#045464]`}/>
      </footer>

      {/* ═══════ LIVE CHAT ═══════ */}
      <ParkinChat />
    </div>
  );
}
