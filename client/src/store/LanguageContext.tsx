import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Lang = 'ar' | 'en';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
}

// UI translations
const translations: Record<string, Record<Lang, string>> = {
  // Header / Announcement
  'header.freeShippingBanner': {
    ar: 'توصيل مجاني للطلبات بقيمة 100 د.إ أو أكثر - بكل حب، صُنع محلياً ←',
    en: 'Free delivery for orders of 100 AED or more - Made with Love, Locally ←',
  },
  'header.dairy': { ar: 'الحليب', en: 'Milk' },
  'header.yoghurtLaban': { ar: 'الزبادي واللبن', en: 'Yoghurt & Laban' },
  'header.cheese': { ar: 'الأجبان', en: 'Cheese' },
  'header.juices': { ar: 'العصائر', en: 'Juices' },
  'header.poultryEggs': { ar: 'الدواجن والبيض', en: 'Poultry & Eggs' },
  'header.newArrivals': { ar: 'وصل حديثاً', en: 'New Arrivals' },
  'header.offers': { ar: 'عروض', en: 'Offers' },
  'header.allProducts': { ar: 'جميع المنتجات', en: 'All Products' },
  'header.searchPlaceholder': { ar: 'ابحث عن منتجات...', en: 'Search products...' },
  'header.search': { ar: 'بحث', en: 'Search' },
  'header.noResults': { ar: 'لا توجد نتائج', en: 'No results' },
  'header.shopDairy': { ar: 'تسوق الحليب', en: 'Shop Milk' },
  'header.shopYoghurt': { ar: 'تسوق الزبادي واللبن', en: 'Shop Yoghurt & Laban' },
  'header.logoName': { ar: 'مزارع\nالعين', en: 'Al Ain\nFarms' },
  'header.logoTagline': { ar: 'بكل حب، صُنع محلياً', en: 'Made with Love, Locally' },
  // Keep old keys for backward compatibility
  'header.frozenFoods': { ar: 'الحليب', en: 'Milk' },
  'header.chilledDry': { ar: 'الزبادي واللبن', en: 'Yoghurt & Laban' },
  'header.boxes': { ar: 'جميع المنتجات', en: 'All Products' },
  'header.shopFrozen': { ar: 'تسوق الحليب', en: 'Shop Milk' },
  'header.shopChilledDry': { ar: 'تسوق الزبادي واللبن', en: 'Shop Yoghurt & Laban' },

  // Product Card
  'product.new': { ar: 'جديد', en: 'New' },
  'product.specialOffer': { ar: 'عرض خاص', en: 'Special Offer' },
  'product.from': { ar: 'من', en: 'From' },
  'product.discountInCart': { ar: 'خصم في السلة', en: 'Discount in Cart' },

  // Quick Add Modal
  'quickAdd.packageType': { ar: 'الحجم', en: 'Size' },
  'quickAdd.addToCart': { ar: 'أضف للسلة', en: 'Add to Cart' },
  'quickAdd.added': { ar: '✓ تمت الإضافة', en: '✓ Added' },
  'quickAdd.viewDetails': { ar: 'عرض التفاصيل الكاملة', en: 'View Full Details' },

  // Variant labels
  'variant.piece': { ar: 'قطعة واحدة', en: 'Piece' },
  'variant.carton': { ar: 'كرتونة', en: 'Carton' },

  // Cart Drawer
  'cart.myCart': { ar: 'سلتي', en: 'My Cart' },
  'cart.empty': { ar: 'سلتك فارغة', en: 'Your cart is empty' },
  'cart.congratsFreeShipping': { ar: 'مبروك! أنت مؤهل للحصول على توصيل مجاني!', en: 'Congratulations! You qualify for free delivery!' },
  'cart.remainingForFreeShipping': { ar: 'أنت على بعد {amount} د.إ للحصول على توصيل مجاني!', en: 'You are {amount} AED away from free delivery!' },
  'cart.packageType': { ar: 'الحجم:', en: 'Size:' },
  'cart.addNote': { ar: 'أضف ملاحظة على الطلب', en: 'Add a note to your order' },
  'cart.total': { ar: 'اجمالي', en: 'Total' },
  'cart.deliveryNote': { ar: 'رسوم التوصيل محسوبة على صفحة الشراء.', en: 'Delivery fees calculated at checkout.' },
  'cart.catchWeightNote': {
    ar: 'سعر الحبة {price} د.إ.',
    en: 'Price per piece {price} AED.',
  },

  // Product Page
  'productPage.home': { ar: 'الصفحة الرئيسية', en: 'Home' },
  'productPage.description': { ar: 'الوصف', en: 'Description' },
  'productPage.quantity': { ar: 'الكمية', en: 'Quantity' },
  'productPage.addToCart': { ar: 'أضف للسلة', en: 'Add to Cart' },
  'productPage.relatedProducts': { ar: 'منتجات مشابهة', en: 'Related Products' },
  'productPage.notFound': { ar: 'المنتج غير موجود', en: 'Product not found' },
  'productPage.backToHome': { ar: 'العودة للرئيسية', en: 'Back to Home' },
  'productPage.packageType': { ar: 'الحجم', en: 'Size' },

  // Collection Page
  'collection.home': { ar: 'الرئيسية', en: 'Home' },
  'collection.products': { ar: 'منتج', en: 'products' },
  'collection.defaultSort': { ar: 'الترتيب الافتراضي', en: 'Default Sort' },
  'collection.priceAsc': { ar: 'السعر: من الأقل للأعلى', en: 'Price: Low to High' },
  'collection.priceDesc': { ar: 'السعر: من الأعلى للأقل', en: 'Price: High to Low' },
  'collection.nameAsc': { ar: 'الاسم: أ - ي', en: 'Name: A - Z' },
  'collection.nameDesc': { ar: 'الاسم: ي - أ', en: 'Name: Z - A' },
  'collection.noProducts': { ar: 'لا توجد منتجات في هذا التصنيف', en: 'No products in this category' },
  'collection.backToHome': { ar: 'العودة للرئيسية', en: 'Back to Home' },
  'collection.previous': { ar: 'السابق', en: 'Previous' },
  'collection.next': { ar: 'التالي', en: 'Next' },
  'collection.allProducts': { ar: 'جميع المنتجات', en: 'All Products' },
  'collection.newArrivals': { ar: 'وصل حديثاً', en: 'New Arrivals' },
  'collection.offers': { ar: 'عروض', en: 'Offers' },
  'collection.boxes': { ar: 'جميع المنتجات', en: 'All Products' },
  'collection.bestSellers': { ar: 'الأكثر مبيعاً', en: 'Best Sellers' },

  // Store Page
  'store.newArrivals': { ar: 'وصل حديثاً', en: 'New Arrivals' },
  'store.bestSellers': { ar: 'الأكثر مبيعاً', en: 'Best Sellers' },
  'store.mostVisited': { ar: 'الأكثر زيارة', en: 'Most Visited' },
  'store.specialOffers': { ar: 'عروض خاصة', en: 'Special Offers' },
  'store.viewAll': { ar: 'عرض الكل', en: 'View All' },
  'store.loading': { ar: 'جاري تحميل المتجر...', en: 'Loading store...' },

  // Category Cards
  'cat.milk': { ar: 'الحليب الطازج', en: 'Fresh Milk' },
  'cat.flavored': { ar: 'حليب منكه', en: 'Flavored Milk' },
  'cat.yoghurt': { ar: 'الزبادي', en: 'Yoghurt' },
  'cat.laban': { ar: 'اللبن', en: 'Laban' },
  'cat.cheese': { ar: 'الأجبان', en: 'Cheese' },
  'cat.juice': { ar: 'العصائر', en: 'Juices' },
  'cat.poultry': { ar: 'الدواجن', en: 'Poultry' },
  'cat.eggs': { ar: 'البيض', en: 'Eggs' },
  // Keep old keys
  'cat.fries': { ar: 'حليب منكه', en: 'Flavored Milk' },
  'cat.beef': { ar: 'الزبادي', en: 'Yoghurt' },
  'cat.seafood': { ar: 'اللبن', en: 'Laban' },
  'cat.vegetables': { ar: 'العصائر', en: 'Juices' },
  'cat.dairy': { ar: 'الأجبان', en: 'Cheese' },

  // Search Page
  'search.resultsFor': { ar: 'نتائج البحث عن', en: 'Search results for' },
  'search.results': { ar: 'نتيجة', en: 'results' },
  'search.noResults': { ar: 'لم يتم العثور على نتائج', en: 'No results found' },
  'search.tryDifferent': { ar: 'حاول البحث بكلمات مختلفة', en: 'Try searching with different keywords' },

  // Footer
  'footer.brandName': { ar: 'مزارع العين', en: 'Al Ain Farms' },
  'footer.about': {
    ar: 'تم إنشاء مزارع العين للإنتاج الحيواني في عام 1981. أكبر شركة ألبان متكاملة في دولة الإمارات العربية المتحدة. نوفر لك أجود منتجات الألبان والعصائر والدواجن الطازجة.',
    en: 'Al Ain Farms was established in 1981. The largest integrated dairy company in the UAE. We provide you with the finest dairy products, juices, and fresh poultry.',
  },
  'footer.customerSupport': { ar: 'دعم العملاء', en: 'Customer Support' },
  'footer.contactUs': { ar: 'تواصل معنا', en: 'Contact Us' },
  'footer.faq': { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  'footer.storeInfo': { ar: 'معلومات عن المتجر', en: 'Store Info' },
  'footer.aboutUs': { ar: 'نبذة عنا', en: 'About Us' },
  'footer.policies': { ar: 'السياسات', en: 'Policies' },
  'footer.returnPolicy': { ar: 'سياسة الاستبدال والاسترجاع', en: 'Return & Exchange Policy' },
  'footer.deliveryTerms': { ar: 'شروط التوصيل', en: 'Delivery Terms' },
  'footer.privacyPolicy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  'footer.termsConditions': { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
  'footer.contactTitle': { ar: 'تواصل معنا', en: 'Contact Us' },
  'footer.paymentMethods': { ar: 'طرق الدفع:', en: 'Payment Methods:' },
  'footer.copyright': { ar: '© {year} مزارع العين. جميع الحقوق محفوظة.', en: '© {year} Al Ain Farms. All rights reserved.' },

  // Origins
  'origin.uae': { ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates' },

  // About Section
  'about.label': { ar: 'معلومات عنا', en: 'About Us' },
  'about.title': { ar: 'نحن', en: 'We are' },
  'about.titleHighlight': { ar: 'مزارع العين', en: 'Al Ain Farms' },
  'about.text': {
    ar: 'تم إنشاء مزارع العين للإنتاج الحيواني في عام 1981 على يد الأب المؤسس المغفور له الشيخ زايد بن سلطان آل نهيان. لتصبح أول شركة ألبان تأسست في دولة الإمارات العربية المتحدة. وبعد 40 عاماً من النجاح، أصبحنا اليوم أكبر شركة ألبان متكاملة في البلاد، وتدير الشركة أربعة مزارع، صناعة الألبان، العصائر، إنتاج حليب النوق، وقسم الدواجن لإنتاج الدجاج الطازج والبيض.',
    en: 'Al Ain Farms for Animal Production was established in 1981 by the late founding father Sheikh Zayed bin Sultan Al Nahyan. It became the first dairy company established in the United Arab Emirates. After 40 years of success, we are today the largest integrated dairy company in the country, operating four farms: dairy, juices, camel milk production, and a poultry division for fresh chicken and eggs.',
  },
  'about.feature1Title': { ar: 'منتجات الألبان', en: 'Dairy Products' },
  'about.feature1Desc': {
    ar: 'تم تجهيز مزارع العين بأفضل التقنيات العالمية للتغذية والحلب والمعالجة وهي واحدة من أكثر المزارع تطوراً في الشرق الأوسط.',
    en: 'Al Ain Farms is equipped with the best global technologies for feeding, milking and processing, making it one of the most advanced farms in the Middle East.',
  },
  'about.feature2Title': { ar: 'منتجات الطبيعة النقية', en: 'Pure Nature Products' },
  'about.feature2Desc': {
    ar: 'كونها أول شركة ألبان في الإمارات العربية المتحدة، قامت مزارع العين بدور محوري في ضمان أفضل المنتجات الغذائية لشعب البلاد.',
    en: 'Being the first dairy company in the UAE, Al Ain Farms has played a pivotal role in ensuring the best food products for the people of the country.',
  },
  'about.feature3Title': { ar: 'حليب النوق', en: 'Camel Milk' },
  'about.feature3Desc': {
    ar: 'نشعر بالحب، نحافظ على تراث الشيخ زايد من خلال شركة الألبان المحلية الوحيدة التي تنتج حليب النوق.',
    en: 'We feel the love, preserving Sheikh Zayed\'s heritage through the only local dairy company that produces camel milk.',
  },
  'about.feature4Title': { ar: 'فقط أفضل جودة', en: 'Only Best Quality' },
  'about.feature4Desc': {
    ar: 'في صميم تركيز الجودة لدينا هو العميل. جميع مبادراتنا في الحفاظ على الجودة وتحسينها تؤدي إلى فوائد لعملائنا الكرام.',
    en: 'At the core of our quality focus is the customer. All our initiatives in maintaining and improving quality lead to benefits for our valued customers.',
  },
  'about.allProducts': { ar: 'جميع منتجاتنا', en: 'All Our Products' },
  'about.madeLocally': { ar: 'صنعت محلياً في دولة الإمارات العربية المتحدة', en: 'Made Locally in the United Arab Emirates' },

  // Video Section
  'video.camel': { ar: 'الإبل', en: 'Camels' },
  'video.poultry': { ar: 'الدواجن', en: 'Poultry' },
  'video.cow': { ar: 'الأبقار', en: 'Cows' },
  'video.pet': { ar: 'عبوات PET', en: 'PET Bottles' },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('alainfarms-lang');
      return (saved === 'en' || saved === 'ar') ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });

  useEffect(() => {
    localStorage.setItem('alainfarms-lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState(prev => prev === 'ar' ? 'en' : 'ar');
  }, []);

  const t = useCallback((key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry['ar'] || key;
  }, [lang]);

  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRTL, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
