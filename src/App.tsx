import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Shirt, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  Phone, 
  PhoneCall, 
  MessageSquare, 
  Sparkles, 
  Scale, 
  DollarSign, 
  Store, 
  Heart, 
  ShoppingCart,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Standard compiled paths for precision and Zero-flickering loader safety.
const BANNER_IMG = "/src/assets/images/sakhawat_hero_banner_1781235618015.jpg";
const SHIRT_IMG = "/src/assets/images/casual_shirt_premium_1781235635824.jpg";
const TSHIRT_IMG = "/src/assets/images/trendy_cotton_tshirt_1781235647264.jpg";
const PUNJABI_IMG = "/src/assets/images/exclusive_punjabi_1781235661165.jpg";

interface OrderForm {
  name: string;
  phone: string;
  address: string;
  productType: string;
  size: string;
  quantity: number;
  deliveryArea: string;
  notes: string;
}

export default function App() {
  // Navigation states
  const [activeSection, setActiveSection] = useState("hero");

  // Selection states for dynamic interactive showcase
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("L");
  
  // Interactive Live Price Calculator states
  const [calcProduct, setCalcProduct] = useState<string>("Premium Casual Shirt");
  const [calcSize, setCalcSize] = useState<string>("L");
  const [calcQty, setCalcQty] = useState<number>(1);
  const [calcArea, setCalcArea] = useState<string>("rajshahi");

  // Feedback State
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<OrderForm | null>(null);
  const [orderId, setOrderId] = useState<string>("");

  // Easy form state
  const [form, setForm] = useState<OrderForm>({
    name: "",
    phone: "",
    address: "",
    productType: "Premium Casual Shirt",
    size: "L",
    quantity: 1,
    deliveryArea: "rajshahi",
    notes: "",
  });

  const productsData = [
    {
      id: 0,
      name: "প্রিমিয়াম ক্যাজুয়াল শার্ট",
      enName: "Premium Casual Shirt",
      price: 1250,
      originalPrice: 1850,
      image: SHIRT_IMG,
      category: "Casual Wear",
      description: "১০০% কটন প্রিমিয়াম এক্সপোর্টেড ম্যাটেরিয়াল। ডাবল-নিডল নিখুঁত স্টিচিং ফিনিশিং ও ট্রেন্ডি ডিজাইনের সমন্বয়, যা আপনাকে দিবে চরম আরাম এবং স্মার্ট ক্যাজুয়াল ক্যাভালিয়ার লুক।",
      specs: ["১০০% এক্সপোর্ট কোয়ালিটি ফাইন টুইল কটন", "নিখুঁত ডাবল-স্টিচ ফিনিশিং", "রঙ এবং কাপড়ের গুণগত মানের শতভাগ গ্যারান্টি", "আরামদায়ক রেগুলার ট্র্যাডিশনাল ফিট"],
      sizes: ["M", "L", "XL", "XXL"]
    },
    {
      id: 1,
      name: "ট্রেন্ডি কটন টি-শার্ট",
      enName: "Trendy Cotton T-Shirt",
      price: 490,
      originalPrice: 750,
      image: TSHIRT_IMG,
      category: "Everyday Basic",
      description: "১৮০+ জিএসএম প্রিমিয়াম কম্বড কটন দিয়ে তৈরি অত্যন্ত আরামদায়ক ও ট্রেন্ডি টি-শার্ট। পরিবেশবান্ধব কালার ডাইং প্রযুক্তি ব্যবহারে তৈরি দীর্ঘস্থায়ী ও আকর্ষণীয় দৈনিক ফ্যাশন সঙ্গী।",
      specs: ["১৮০+ GSM প্রিমিয়াম কম্বড কটন ফেব্রিক", "বায়ো-ওয়াশড এবং রিয়্যাক্টিভ ডাইং শতভাগ পরিবেশবান্ধব কালার", "সংকোচনমুক্ত প্রি-শ্রাঙ্ক টেক্সচার", "ডাবল-নিডল কলার হেম ফিনিশ"],
      sizes: ["M", "L", "XL"]
    },
    {
      id: 2,
      name: "এক্সক্লুসিভ রিচ কারুকাজ পাঞ্জাবি",
      enName: "Exclusive Punjabi",
      price: 1850,
      originalPrice: 2650,
      image: PUNJABI_IMG,
      category: "Tradition & Festive",
      description: "আভিজাত্য ও ঐতিহ্যের অপরূপ মেলবন্ধনে তৈরি বিশেষ পাঞ্জাবি। কলার ও প্লেকেটে প্রিমিয়াম সুনিপুণ হাতের সূচিকর্ম ও সেলাইয়ের নিখুঁত আভিজাত্য আপনার উৎসবের আনন্দকে বাড়িয়ে দেবে শতগুণ।",
      specs: ["প্রিমিয়াম লাক্সারি ফাইন লিনেন কটন ফেব্রিক", "নিখুঁত কলার ও প্লেকেট হ্যান্ডসাম এমব্রয়ডারি স্টিচিং", "লাক্সারি কাস্টমাইজড ম্যাচিং বোতাম স্লাইডস", "উন্নত ফিটিং পারফেকশনিস্ট কাটিং ডিজাইন"],
      sizes: ["M", "L", "XL", "XXL"]
    }
  ];

  // Helper values for Calculator & Form
  const getProductPrice = (pName: string) => {
    const prd = productsData.find(p => p.enName === pName || p.name === pName);
    return prd ? prd.price : 1000;
  };

  const getDeliveryCost = (area: string) => {
    switch (area) {
      case "rajshahi":
        return 0; // রাজশাহী শহর ও নবাবগঞ্জ ফ্রি হোম ডেলিভারি
      case "nawabganj":
        return 0; // নবাবগঞ্জ ও রাজশাহী ফ্রি হোম ডেলিভারি
      case "outside":
      default:
        return 120; // দেশব্যাপী অন্যান্য জেলা ১২০ টাকা
    }
  };

  const getAreaLabel = (area: string) => {
    switch (area) {
      case "rajshahi": return "রাজশাহী শহর (ফ্রি ডেলিভারি)";
      case "nawabganj": return "নবাবগঞ্জ (ফ্রি ডেলিভারি)";
      case "outside": return "সারা বাংলাদেশ ক্যাশ অন ডেলিভারি (১২০ টাকা)";
    }
  };

  // Sync selection across tab and quick order/calculator
  const handleProductSelect = (index: number) => {
    setSelectedProduct(index);
    // Auto fill calculator and form config
    const targetPrd = productsData[index];
    setCalcProduct(targetPrd.enName);
    setSelectedSize(targetPrd.sizes[0]);
    setCalcSize(targetPrd.sizes[0]);
    setForm(prev => ({
      ...prev,
      productType: targetPrd.name,
      size: targetPrd.sizes[0]
    }));
  };

  const handleQuickOrderClick = (prdIndex: number) => {
    handleProductSelect(prdIndex);
    const orderSection = document.getElementById("order-form-container");
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    setForm(prev => ({ ...prev, quantity: val }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("দয়া করে নাম, ফোন নম্বর এবং আপনার সম্পূর্ণ ঠিকানা প্রদান করুন।");
      return;
    }
    
    setIsSubmitting(true);

    // Simulate reliable system booking sequence
    setTimeout(() => {
      const generatedId = "SF-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      setLastOrderDetails({ ...form });
      setOrderSubmitted(true);
      setIsSubmitting(false);

      // Scroll smoothly to success block
      setTimeout(() => {
        const successBox = document.getElementById("order-success-view");
        if (successBox) {
          successBox.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }, 1200);
  };

  const handleResetOrder = () => {
    setOrderSubmitted(false);
    setForm({
      name: "",
      phone: "",
      address: "",
      productType: "Premium Casual Shirt",
      size: "L",
      quantity: 1,
      deliveryArea: "rajshahi",
      notes: "",
    });
  };

  // Auto scroll highlight handler
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "products", "calculator", "usp", "trust", "order-form-container"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calculatedBasePrice = getProductPrice(calcProduct) * calcQty;
  const calculatedDelivery = getDeliveryCost(calcArea);
  const calculatedTotal = calculatedBasePrice + calculatedDelivery;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 bg-slate-50 text-slate-800">
      
      {/* PROFESSIONAL POLISH GLASS BORDER HEAD */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-amber-500 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="#hero" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center p-2 shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-colors">
              <Sparkles className="w-6 h-6 text-slate-900 animate-pulse" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display block">সাখাওয়াত ফ্যাশন</span>
              <span className="text-[10px] sm:text-xs text-amber-500 font-bold tracking-wider block uppercase">Sakhawat Fashion</span>
            </div>
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#about" 
              className={`text-sm font-semibold transition-colors hover:text-amber-400 ${activeSection === 'about' ? 'text-amber-400 border-b-2 border-amber-500 pb-1' : 'text-slate-300'}`}
            >
              আমাদের কথা
            </a>
            <a 
              href="#products" 
              className={`text-sm font-semibold transition-colors hover:text-amber-400 ${activeSection === 'products' ? 'text-amber-400 border-b-2 border-amber-500 pb-1' : 'text-slate-300'}`}
            >
              পোশাকসমূহ
            </a>
            <a 
              href="#calculator" 
              className={`text-sm font-semibold transition-colors hover:text-amber-400 ${activeSection === 'calculator' ? 'text-amber-400 border-b-2 border-amber-500 pb-1' : 'text-slate-300'}`}
            >
              ক্যালকুলেটর
            </a>
            <a 
              href="#usp" 
              className={`text-sm font-semibold transition-colors hover:text-amber-400 ${activeSection === 'usp' ? 'text-amber-400 border-b-2 border-amber-500 pb-1' : 'text-slate-300'}`}
            >
              কেন আমরা সেরা
            </a>
            <a 
              href="#order-form-container" 
              className={`text-sm font-semibold transition-colors hover:text-amber-400 ${activeSection === 'order-form-container' ? 'text-amber-400 border-b-2 border-amber-500 pb-1' : 'text-slate-300'}`}
            >
              অর্ডার করুন
            </a>
          </nav>

          {/* HEADER CTA */}
          <div className="flex items-center space-x-3">
            <a 
              href="tel:+8801700000000" 
              className="hidden lg:flex items-center space-x-2 text-slate-300 hover:text-amber-400 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm"
              id="nav-call-btn"
            >
              <Phone className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>কল করুন</span>
            </a>
            <a 
              href="#order-form-container" 
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-5 rounded-full text-sm tracking-wide transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
              id="nav-cta-order"
            >
              অর্ডার দিন
            </a>
          </div>
        </div>
      </header>

      {/* ALERT STRIP FOR AREA FREE COURIER */}
      <div className="bg-slate-950 text-amber-400 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold border-b border-slate-800 shadow-inner">
        <span className="inline-flex items-center gap-1.5">
          <Truck className="w-4 h-3.5 animate-pulse text-amber-500" />
          রাজশাহী ও নবাবগঞ্জ এলাকায় সম্পূর্ণ <strong className="text-white underline decoration-amber-500 decoration-2">ফ্রি হোম ডেলিভারি</strong> এবং দেশজুড়ে ক্যাশ অন ডেলিভারি সুবিধা!
        </span>
      </div>

      <main className="flex-grow">
        
        {/* SECTION 1: HERO CONTAINER */}
        <section id="hero" className="relative py-12 md:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left text column */}
              <motion.div 
                className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full text-amber-950 text-xs sm:text-sm font-semibold max-w-max">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500 animate-spin" />
                  <span>আভিজাত্যের আধুনিক রূপান্তর — সাখাওয়াত ফ্যাশন</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight font-display" id="hero-main-title">
                    আভিজাত্য ও বিশ্বাসের মেলবন্ধনে সাজুক আপনার প্রতিদিন!
                  </h1>
                  <p className="text-amber-600 text-lg sm:text-xl font-bold tracking-wide italic leading-relaxed">
                    "উদারতায় বিশ্বাস, ফ্যাশনে আভিজাত্য।"
                  </p>
                </div>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  সাখাওয়াত ফ্যাশন সম্পূর্ণ ভার্চুয়াল অনলাইন মডেলের মাধ্যমে সরাসরি শ্রেষ্ঠ পাইকারি উৎস থেকে কাপড় সংগ্রহ করে আমাদের নিজস্ব কারখানায় নিখুঁত সেলাইয়ে কাস্টমারদের কাছে সরবরাহ করে। কোনো ঐতিহ্যবাহী বিলাসবহুল শোরুমের ভাড়া বা অন্যান্য মধ্যস্থতাকারীদের অপচয় নেই, যার দরুন প্রিমিয়াম ও রাজকীয় পাঞ্জাবি, শার্ট ও টি-শার্ট পাচ্ছেন দেশের সবচেয়ে জুড়ে সততা ও সাশ্রয়ী মূল্যে।
                </p>

                {/* Live indicators area to represent genuine non-tech larp real customer trust */}
                <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 max-w-xl">
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold text-slate-900">১০০% কটন</span>
                    <span className="block text-xs text-slate-500">প্রিমিয়াম ফেব্রিকস</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold text-slate-900">০ টাকা</span>
                    <span className="block text-xs text-slate-500">রাজশাহী ডেলিভারি</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold text-slate-900">ক্যাশ অন</span>
                    <span className="block text-xs text-slate-500">দেশব্যাপী ডেলিভারি</span>
                  </div>
                </div>

                {/* Direct action CTA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a 
                    href="#products" 
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-8 rounded-full text-center transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>কালেকশন দেখুন</span>
                  </a>
                  <a 
                    href="#order-form-container" 
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-full text-center transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>সরাসরি অর্ডার দিন</span>
                    <ChevronRight className="w-4 h-4 text-amber-500" />
                  </a>
                </div>
              </motion.div>

              {/* Right Visual banner column */}
              <motion.div 
                className="lg:col-span-5 relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white premium-glow">
                  <img 
                    src={BANNER_IMG} 
                    alt="সাখাওয়াত ফ্যাশন পাঞ্জাবি ও শার্ট লাক্সারি কালেকশন" 
                    className="w-full h-full object-cover aspect-[4/3] sm:aspect-[16/9] lg:aspect-[3/4]"
                    referrerPolicy="no-referrer"
                    id="hero-banner-image"
                  />
                  
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">চলতি সপ্তাহের এক্সক্লুসিভ অফার</p>
                      <h4 className="text-sm font-semibold text-slate-200">সরাসরি রাজশাহী ও নবাবগঞ্জ সোর্স</h4>
                    </div>
                    <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full">৩টি নতুন ডিজাইন</span>
                  </div>
                </div>

                {/* Small supportive background decorative leaf accents for organic feel */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-amber-500/10 rounded-full blur-xl -z-10"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/15 rounded-full blur-2xl -z-10 animate-pulse"></div>
              </motion.div>

            </div>
          </div>
        </section>


        {/* SECTION 2: ABOUT BRAND & BUSINESS MODEL STORY */}
        <section id="about" className="py-16 sm:py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-amber-600 font-bold tracking-wider uppercase text-xs sm:text-sm">ব্র্যান্ডের মূল সুর</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-display">আমাদের অনবদ্য গল্প ও পবিত্র দর্শন</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Text content - Arabic word meaning and integrity statement */}
              <div className="space-y-6 text-slate-600 text-base sm:text-lg leading-relaxed">
                <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-2xl border-l-4 border-emerald-600 shadow-sm relative">
                  <div className="absolute top-4 right-4 text-emerald-200/50 text-7xl font-serif font-black select-none pointer-events-none">“</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-display flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>'ساخاوات' (সাখাওয়াত) নামের অন্তর্নিহিত বার্তা</span>
                  </h3>
                  <p className="text-slate-700 font-medium">
                    আরবি শব্দ <strong>‘সাখাওয়াত’ (Sakhawat)</strong>-এর অর্থ হলো <strong>'উদারতা', 'মহত্ত্ব'</strong> এবং <strong>'উদারচিত্ততা'</strong>। সাখাওয়াত ফ্যাশন কেবল পোশাক কেনাবেচার ব্র্যান্ড নয়, এটি আমাদের নিখাদ সততা ও ক্রেতার প্রতি অপরিসীম মহত্ত্বের এক বাস্তব প্রতিফলন।
                  </p>
                </div>

                <p>
                  আমরা মনে প্রাণে বিশ্বাস করি, ব্যবসায় সততাই একমাত্র সাফল্যের পথ। আজকের যুগে যেখানে অনলাইন কেনাকাটা অনেক সময় কাস্টমারদের মধ্যে আস্থার সংকটের সৃষ্টি করে, সেখানে সাখাওয়াত ফ্যাশন পোশাকের প্রতিটি সুতোয় বুনে রেখেছে সততা আর বিশ্বাসের মেলবন্ধন। আমাদের উদ্দেশ্য কেবল কাপড়ের ব্যবসা করা নয়, বরং আমাদের প্রতিটি কাস্টমারের মনে কাপড়ের নিখুঁত কোয়ালিটি দিয়ে হাসি ফোটানো এবং আস্থা ধরে রাখা।
                </p>

                <p>
                  আমরা কোনো জাঁকজমক চটকদার চ্যাপ্টারে বিশ্বাসী নই। আমাদের প্রতিটি প্রিমিয়াম কলার স্টিচ, বডির নিখুঁত পিন-পয়েন্ট ফিনিশিং এবং দীর্ঘস্থায়ী ফেব্রিক কোয়ালিটি আমাদের কাজের সততার চিরন্তন পরিচয় বহন করে। নবাবগঞ্জ, রাজশাহীতে উৎপন্ন ও দেশজুড়ে পরিবেশিত আমাদের চমৎকার সংকলনে আপনি পাবেন এক খাঁটি বিশ্বস্ত অনুভূতি।
                </p>
              </div>

              {/* Graphical illustration on why direct virtual business saves major costs */}
              <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6 premium-glow">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display flex items-center space-x-2 border-b border-slate-200 pb-3">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  <span>ব্যবসায়িক যুক্তি: কেন শোরুমের অতিরিক্ত খরচের বোঝা আপনি বহন করবেন?</span>
                </h3>

                <p className="text-sm text-slate-500">
                  সাধারণ বড় বড় শোরুমের অতিরিক্ত জাঁকজমক ফুটিয়ে তোলার অপ্রয়োজনীয় খরচের পুরোটাই যুক্ত হয় প্রোডাক্টের মূল দামের সাথে। সাখাওয়াত ফ্যাশন ভার্চুয়াল ও ডাইরেক্ট মডেল অনুসরণ করায় কীভাবে আপনার টাকা বেঁচে যায়, তা নিজে দেখুন:
                </p>

                {/* Structural Overhead Costs comparison */}
                <div className="space-y-4">
                  
                  {/* Traditional Showroom Cost slider view */}
                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex flex-col space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-rose-800 uppercase tracking-wide">
                      <span className="flex items-center space-x-1.5">
                        <Store className="w-4 h-4" />
                        <span>সাধারণ শোরুমের প্রোডাক্ট প্রসেস</span>
                      </span>
                      <span className="bg-rose-200 px-2 py-0.5 rounded text-[10px]">অতিরিক্ত খরচ বেশি (+১০০%)</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 text-[9px] sm:text-xs text-rose-700 text-center font-medium">
                      <div className="bg-rose-100/60 p-2 rounded">উৎপাদন খরচ</div>
                      <div className="bg-rose-100/65 py-2 px-1 rounded font-semibold text-rose-800">+ শোরুম ভাড়ার খরচ</div>
                      <div className="bg-rose-100/65 py-2 px-1 rounded font-semibold text-rose-800">+ ডিলার ও সেলসম্যান বেতন</div>
                      <div className="bg-rose-100/65 py-2 px-1 rounded font-semibold text-rose-800">+ এসি ও প্রসাধন খরচ</div>
                      <div className="bg-rose-900 text-white p-2 rounded">চূড়ান্ত বাড়তি দাম</div>
                    </div>
                  </div>

                  {/* Sakhawat Fashion dynamic Virtual Model */}
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      <span className="flex items-center space-x-1.5 font-display">
                        <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                        <span>সাখাওয়াত ফ্যাশন অনলাইন ডাইরেক্ট মডেল</span>
                      </span>
                      <span className="bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded text-[10px]">উৎপাদন মূল্যে অফার</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs text-emerald-800 text-center font-medium">
                      <div className="bg-emerald-100/80 p-2.5 rounded">সরাসরি খাঁটি সুতা ও কাপড় সোর্সিং</div>
                      <div className="bg-emerald-100/80 p-2.5 rounded">কারখানায় সুনিপুণ কাটিং ও আধুনিক সেলাই</div>
                      <div className="bg-emerald-900 text-white p-2.5 rounded font-display font-semibold">আপনার হাতে সেরা সাশ্রয়ী মূল্য</div>
                    </div>
                  </div>

                </div>

                <div className="bg-emerald-950 text-white p-4 rounded-2xl text-xs sm:text-sm shadow-sm font-medium">
                  <p className="line-clamp-3">
                    <strong>ফলাফল:</strong> সাখাওয়াত ফ্যাশন কোনো বিলাসবহুল লাইটিং বা শোরুমের মধ্যস্বত্বভোগীদের পেছনে অর্থ ক্ষয় করে না। আমাদের প্রতিটি জামা সরাসরি আমাদের সোর্স থেকে কড়া কোয়ালিটি চেকে প্যাক হয়ে আপনার দুয়ারে পৌঁছায়। তাই বাজারে যে কাপড় আপনি ২,৫০০ টাকায় পান, তা আমাদের নিকট ১,২৫০ টাকায় পাওয়া সম্ভব হয়!
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* SECTION 3: PRODUCT LINES GALLERY & PRODUCT CARDS */}
        <section id="products" className="py-16 sm:py-24 bg-[#F2F0E6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs sm:text-sm">নতুন কালেকশন</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-display">আমাদের অনবদ্য প্রোডাক্ট লাইন্স</h2>
              <p className="text-slate-600 mt-3 text-base">
                ছেলেরা প্রতিদিনের স্মার্ট ক্যাজুয়াল থেকে শুরু করে যেকোনো উৎসবে নিজেকে ফুটিয়ে তুলতে পছন্দ করুন আমাদের তিনটি প্রিমিয়াম সংস্করণ। নিচের ক্যাটাগরি স্পর্শ করুন।
              </p>
            </div>

            {/* Product Switcher Tab buttons */}
            <div className="flex justify-center space-x-2 sm:space-x-4 mb-8 sm:mb-12 overflow-x-auto pb-2 scrollbar-none">
              {productsData.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleProductSelect(prod.id)}
                  className={`px-5 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 whitespace-nowrap ${selectedProduct === prod.id ? 'bg-emerald-700 text-white shadow-lg' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'}`}
                >
                  {prod.name}
                </button>
              ))}
            </div>

            {/* Selected Product Interactive Showcase Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl premium-glow">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Left Side: Product Zoom/View Image */}
                <div className="lg:col-span-5 bg-slate-100 relative min-h-[300px] lg:min-h-[450px]">
                  <img 
                    src={productsData[selectedProduct].image} 
                    alt={productsData[selectedProduct].name} 
                    className="w-full h-full object-cover aspect-[4/3] lg:aspect-[3/4] transition-all duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow">
                    {productsData[selectedProduct].category}
                  </div>
                </div>

                {/* Right Side: Specifications and details */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                  
                  <div>
                    {/* Ratings */}
                    <div className="flex items-center space-x-1 mb-2 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                      <span className="text-xs text-slate-500 font-semibold ml-1.5">(৪.৯/৫ স্টার ক্রেতাদের রেটিং)</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                      {productsData[selectedProduct].name}
                    </h3>
                    <p className="text-xs text-emerald-700 font-mono font-bold mt-1 uppercase tracking-widest">{productsData[selectedProduct].enName} Collection</p>
                    
                    {/* Direct Price Breakdown */}
                    <div className="flex items-center space-x-3 mt-4 mb-5">
                      <span className="text-3xl font-black text-slate-900 font-display">৳ {productsData[selectedProduct].price}</span>
                      <span className="text-base text-slate-400 line-through">৳ {productsData[selectedProduct].originalPrice}</span>
                      <span className="bg-rose-100 text-rose-700 text-xs font-extrabold px-2.5 py-1 rounded">
                        {Math.round(((productsData[selectedProduct].originalPrice - productsData[selectedProduct].price) / productsData[selectedProduct].originalPrice) * 100)}% ছাড়
                      </span>
                    </div>

                    <p className="text-slate-600 text-base leading-relaxed mb-6">
                      {productsData[selectedProduct].description}
                    </p>

                    {/* Technical details checkboxes */}
                    <div className="space-y-2.5 border-t border-slate-100 pt-5">
                      <h4 className="text-sm font-bold text-slate-900 tracking-wide uppercase">পোশাক প্রস্তুতের অনন্য গুণাবলী:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                        {productsData[selectedProduct].specs.map((spec, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sizes Selection */}
                    <div className="mt-6 flex flex-col space-y-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">সাইজ পছন্দ করুন:</span>
                      <div className="flex space-x-2.5">
                        {productsData[selectedProduct].sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => {
                              setSelectedSize(sz);
                              // Sync to Calculator & Form
                              setCalcSize(sz);
                              setForm(prev => ({ ...prev, size: sz }));
                            }}
                            className={`w-11 h-11 rounded-lg text-sm font-bold border transition-all flex items-center justify-center ${selectedSize === sz ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-200 border-slate-300'}`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleQuickOrderClick(selectedProduct)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow text-center active:scale-95 flex items-center justify-center space-x-2 flex-grow"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>এই পণ্যটি অর্ডার করুন</span>
                    </button>
                    <a
                      href="#calculator"
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3.5 px-6 rounded-xl transition-all text-center flex items-center justify-center space-x-2 sm:flex-grow-0"
                    >
                      <span>ডেলিভারি খরচ হিসেব করুন</span>
                    </a>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>


        {/* SECTION: INTERACTIVE COST & DELIVERY ESTIMATOR */}
        <section id="calculator" className="py-16 bg-white shrink-0 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs sm:text-sm">স্বচ্ছ হিসাব-নিকাশ</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 font-display">লাইভ ডেলিভারি ও কস্ট ক্যালকুলেটর</h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                অর্ডার চূড়ান্ত করার পূর্বে কাপড়ের সাইজ, সংখ্যা ও আপনার পছন্দের এলাকা সিলেক্ট করে কাপড়ের সঠিক দাম এবং ডেলিভারি খরচ স্বচ্ছভাবে মিলিয়ে নিন। কোনো চোরা খরচ বা লুক্কায়িত সার্ভিস ফি নেই!
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-[#FAF9F5] border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Inputs */}
              <div className="md:col-span-7 space-y-5">
                <h3 className="text-lg font-bold text-slate-900 font-display border-b border-slate-200 pb-2">আপনার পছন্দ সাজান:</h3>
                
                {/* select product */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">১. পোশাকের ধরন পছন্দ করুন:</label>
                  <select 
                    value={calcProduct} 
                    onChange={(e) => {
                      setCalcProduct(e.target.value);
                      const targetIdx = productsData.findIndex(p => p.enName === e.target.value);
                      if(targetIdx !== -1) {
                        setSelectedProduct(targetIdx);
                        setCalcSize(productsData[targetIdx].sizes[0]);
                      }
                    }} 
                    className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    {productsData.map(p => (
                      <option key={p.id} value={p.enName}>{p.name} (৳ {p.price})</option>
                    ))}
                  </select>
                </div>

                {/* select size & quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">২. পোশাকের সাইজ:</label>
                    <select 
                      value={calcSize}
                      onChange={(e) => setCalcSize(e.target.value)}
                      className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                    >
                      {(productsData.find(p => p.enName === calcProduct)?.sizes || ["M", "L", "XL"]).map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">৩. পিস সংখ্যা (পরিমাণ):</label>
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                      <button 
                        type="button" 
                        onClick={() => { if (calcQty > 1) setCalcQty(calcQty - 1); }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="flex-grow text-center text-sm font-bold font-mono">{calcQty}</span>
                      <button 
                        type="button" 
                        onClick={() => setCalcQty(calcQty + 1)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* select area */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">৪. আপনার ডেলিভারি এলাকা:</label>
                  <select 
                    value={calcArea} 
                    onChange={(e) => setCalcArea(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="rajshahi">রাজশাহী শহর (হোম ডেলিভারি — সম্পূর্ণ ফ্রি! )</option>
                    <option value="nawabganj">নবাবগঞ্জ সদর ও উপজেলা এলাকা (হোম ডেলিভারি — সম্পূর্ণ ফ্রি! )</option>
                    <option value="outside">দেশব্যাপী অন্যান্য জেলা (ক্যাশ অন ডেলিভারি — ১২০ টাকা )</option>
                  </select>
                </div>

              </div>

              {/* Invoice breakdown card */}
              <div className="md:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-bold tracking-widest text-[#f59e0b] uppercase">অর্ডার বিবরণী খসড়া</h4>
                    <span className="text-[10px] text-amber-300 font-mono">ESTIMATED BILL BREAKDOWN</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-amber-200 max-w-[160px] line-clamp-1">{productsData.find(p => p.enName === calcProduct)?.name}</span>
                      <span className="font-mono">৳ {getProductPrice(calcProduct)} x {calcQty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200">সাইজ রেফারেন্স</span>
                      <span className="font-mono bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-xs">{calcSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200">উপমোট দাম</span>
                      <span className="font-mono">৳ {calculatedBasePrice}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                      <span className="text-amber-300 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        ডেলিভারি খরচ:
                      </span>
                      <span className="font-semibold text-amber-100 italic">
                        {calculatedDelivery === 0 ? "ফ্রি ডেলিভারি" : `৳ ${calculatedDelivery}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 mt-2">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-base font-bold text-white font-display">সর্বমোট পরিশোধযোগ্য:</span>
                    <span className="text-3xl font-black text-amber-400 font-mono">৳ {calculatedTotal}</span>
                  </div>

                  <a 
                    href="#order-form-container"
                    onClick={() => {
                      // Apply changes to order form
                      setForm(prev => ({
                        ...prev,
                        productType: productsData.find(p => p.enName === calcProduct)?.name || "Premium Casual Shirt",
                        size: calcSize,
                        quantity: calcQty,
                        deliveryArea: calcArea
                      }));
                    }}
                    className="block bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-center py-3 rounded-xl text-sm tracking-wide transition-colors shadow-sm cursor-pointer"
                  >
                    সংরক্ষণ করে অর্ডার লিখুন
                  </a>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: USP (কেন আমরা সেরা?) */}
        <section id="usp" className="py-16 sm:py-24 bg-[#F2F0E6] shrink-0 border-t border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-amber-600 font-bold uppercase tracking-wider text-xs sm:text-sm">কেন সাখাওয়াত ফ্যাশন অনন্য?</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 font-display">বাজারের সেরা ৪টি অনন্য শক্তিশালী সুবিধা</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              
              {/* USP 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 block">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center p-2 mb-5">
                  <ShieldCheck className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">১০০% কোয়ালিটি গ্যারান্টি</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  সুতা ছাঁটাই থেকে ফিনিশিং ফোল্ড—আমাদের নিজস্ব কারিগর নিখুঁত মান নিয়ন্ত্রণ করেন। ফেব্রিক টেক্সচার এতটুকু খারাপ প্রমাণিত হলে সম্পূর্ণ ফেরত।
                </p>
              </div>

              {/* USP 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 block">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center p-2 mb-5">
                  <Truck className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">দেশব্যাপী ক্যাশ অন ডেলিভারি</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  অর্ডার করার পর অগ্রিম টাকা জমা দেওয়ার ভয় নেই! নবাবগঞ্জের রাজশাহী সদর থেকে সারা দেশের যেকোনো গ্রামে হোম ডেলিভারিতে কাপড় আপনার হাতের নাগালে পৌঁছে দেবো।
                </p>
              </div>

              {/* USP 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 block">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center p-2 mb-5">
                  <ShoppingBag className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">পার্সেল খুলে দেখে চেক করার সুযোগ</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  ডেলিভারিম্যানের সামনে পার্সেল খুলুন। কাপড় ছুয়ে দেখুন, সাইজ ঠিক থাকলে এবং শতভাগ খুশি থাকলেই কেবল কাপড়ের মূল্য পরিশোধ করুন।
                </p>
              </div>

              {/* USP 4 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 block">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center p-2 mb-5">
                  <RefreshCw className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">৭ দিনের সহজ এক্সচেঞ্জ পলিসি</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  কোনো ক্ষুণ্নতা ছাড়াই কাপড় এক্সচেঞ্জ সুবিধা! সাইজের সমস্যা হলে বা শার্ট বদল করতে চাইলে ২৪ ঘণ্টার মাঝে আমরা এক্সচেঞ্জের প্রসেস শুরু করি।
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4: TRUST & TRUST BUILDING OPEN-LETTER */}
        <section id="trust" className="py-16 sm:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-gradient-to-tr from-[#FAF9F5] to-white rounded-3xl border border-slate-200 p-8 sm:p-12 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-100/50 rounded-full blur-3xl -z-10"></div>
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                
                <div className="flex items-center justify-center space-x-2 bg-amber-100 text-amber-950 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>গ্রাহকের আস্থাই আমাদের গৌরব</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight">
                    নিরাপদ ও ভয়হীন অনলাইন কেনাকাটায় আমাদের অবিচল প্রতিশ্রুতি!
                  </h3>
                  <div className="w-12 h-1 bg-amber-500 max-w-max mx-auto md:mx-0 rounded-full"></div>
                </div>

                <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-4xl">
                  <p>
                    আমরা জানি, আমাদের দেশের প্রেক্ষাপটে অনলাইনে কাপড় কিনতে যাওয়ার সময় অনেকে দুশ্চিন্তায় পড়েন। "ছবিতে যা দেখাচ্ছে, বাস্তবে ঠিক সেরকম তো আসবে?", "কালার কি জ্বলে যাবে?", নাকি "ছেঁড়া কাপড় পাঠানো হবে?"—ক্রেতাদের এই সমস্ত ভয় এবং শঙ্কা অত্যন্ত যৌক্তিক এবং বাস্তবমুখী।
                  </p>
                  <p className="font-medium text-slate-800">
                    সাখাওয়াত ফ্যাশন আপনার এই চিন্তাকে সম্পূর্ণ দূর করে দিতে বদ্ধপরিকর। আমাদের কাছে ব্যবসার প্রথম নীতি হলো ক্রেতার নিঃশর্ত আস্থা অর্জন করা। আমাদের পোশাকের রঙ, সেলাই ও দীর্ঘস্থায়িত্বের গুণাগুণ নিয়ে আপনাকে অতিরিক্ত আক্ষেপ করতে হবে না।
                  </p>
                  <p>
                    বিশ্বাস ও আভিজাত্যের স্পর্শ নিয়ে আমাদের পাশে আসার জন্য আপনাকে অকুণ্ঠ ধন্যবাদ। আপনার যেকোনো উদ্বেগ দূর করতে আমাদের কাস্টমার সাপোর্ট সর্বদা প্রস্তুত। সাখাওয়াত ফ্যাশনের প্রতিটি পার্সেল আপনাদের দরজায় সম্মানের সাথে পৌঁছে দেওয়ার দায়িত্ব আমাদের।
                  </p>
                </div>

                {/* Simulated Owner Signature layout */}
                <div className="border-t border-slate-200/80 pt-6 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-bold font-display shadow animate-pulse">
                      সাখাওয়াত
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">সাখাওয়াত ফ্যাশন টিম</p>
                      <p className="text-xs text-slate-500">নবাবগঞ্জ, রাজশাহী, বাংলাদেশ</p>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs sm:text-sm text-slate-500 items-center">
                    <Info className="w-4 h-4 text-amber-500" />
                    <span>কোনো অগ্রিম বিকাশ চার্জ প্রযোজ্য নয়!</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* SECTION 5: REGISTER BOOKING / EASY FORM DESIGN */}
        <section id="order-form-container" className="py-16 sm:py-24 bg-[#F2F0E6] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <span className="text-amber-600 font-bold uppercase tracking-wider text-xs sm:text-sm">দ্রুত ও সহজ অর্ডার প্রসেস</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 font-display">নিরাপদ ডাইরেক্ট অর্ডার ক্যাশ অন ডেলিভারি</h2>
              <p className="text-slate-600 mt-3 text-base">
                পছন্দের পণ্যের নাম, আপনার ঠিকানা ও ফোন নম্বর দিয়ে মাত্র ২০ সেকেন্ডে অর্ডার কনফার্ম করুন। আমাদের প্রতিনিধি কল দিয়ে সাইজ ও কালার শতভাগ নিশ্চিত করে দ্রুত পার্সেল পাঠিয়ে দেবেন।
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Order form instruction info panel */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-inner">
                  <h3 className="text-lg font-bold font-display text-amber-400">অর্ডার প্রসেসিং গাইড</h3>
                  
                  <div className="space-y-4">
                    
                    <div className="flex items-start space-x-3.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-xs font-bold text-white flex items-center justify-center shrink-0 mt-0.5">
                        ১
                      </div>
                      <p className="text-xs text-slate-300">অর্ডার ফর্মটি সঠিকভাবে পূরণ করে নিচের সুবর্ণ ‘অর্ডার নিশ্চিত করুন’ বাটনে ক্লিক করুন।</p>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-xs font-bold text-white flex items-center justify-center shrink-0 mt-0.5">
                        ২
                      </div>
                      <p className="text-xs text-slate-300">অর্ডার সম্পন্ন হবামাত্রই আপনার ফোনে ২৪ ঘণ্টার মাঝে আমাদের সাপোর্ট থেকে কনফার্মেশন কল আসবে।</p>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-xs font-bold text-white flex items-center justify-center shrink-0 mt-0.5">
                        ৩
                      </div>
                      <p className="text-xs text-slate-300">২ থেকে ৪ কর্মদিবসের মাঝে ডেলিভারিম্যান আপনার পরনের কড়া ফিনিশড কাপড় ঘরে নিয়ে আসবে।</p>
                    </div>

                  </div>

                  <div className="bg-slate-850/50 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <span className="font-bold text-amber-400 block flex items-center gap-1.5 text-sm sm:text-base">
                      <PhoneCall className="w-4 h-4 text-amber-500 animate-bounce" />
                      ফোনে অর্ডার করতে চাইলে:
                    </span>
                    <a href="tel:+8801700000000" className="text-white hover:text-amber-300 transition-colors font-black text-lg block tracking-wide">+880 1700-000000</a>
                    <span className="text-slate-400 text-[10px] block font-medium">সকাল ৯টা - রাত ১০টা পর্যন্ত আমাদের টিম আপনার কলের অপেক্ষায় আছে।</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-xs text-slate-500 space-y-2 shadow-sm">
                  <span className="font-bold text-slate-800 block uppercase tracking-wider text-sm flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    সহজ রিটার্ন পলিসি:
                  </span>
                  <p className="leading-relaxed">আমাদের ব্র্যান্ড সততায় বিশ্বাসী। কাপড় পছন্দ না হলে ডেলিভারি ম্যানের সামনেই ফেরত দিয়ে দিন। কোনো জরিমানা বা বাড়তি চার্জ নেওয়া হবে না।</p>
                </div>

              </div>

              {/* Real form / Success container */}
              <div className="lg:col-span-8 bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden">
                
                <AnimatePresence mode="wait">
                  {!orderSubmitted ? (
                    <motion.form 
                      key="order-form-step"
                      onSubmit={handleOrderSubmit}
                      className="p-6 sm:p-10 space-y-6"
                      id="order-submission-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="text-xl font-bold text-slate-900 font-display flex items-center space-x-2 border-b border-slate-100 pb-3">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        <span>অর্ডার শিপিং ফর্ম (ক্যাশ অন ডেলিভারি)</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Name input */}
                        <div className="flex flex-col space-y-1.5Col">
                          <label className="text-sm font-semibold text-slate-700">আপনার নাম <span className="text-rose-500 font-bold">*</span></label>
                          <input 
                            type="text" 
                            name="name"
                            required
                            placeholder="যেমন: সাখাওয়াত খান"
                            value={form.name}
                            onChange={handleFormInputChange}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          />
                        </div>

                        {/* Phone input */}
                        <div className="flex flex-col space-y-1.5Col">
                          <label className="text-sm font-semibold text-slate-700">মোবাইল ফোন নম্বর <span className="text-rose-500 font-bold">*</span></label>
                          <input 
                            type="tel" 
                            name="phone"
                            required
                            placeholder="যেমন: 01712-XXXXXX"
                            value={form.phone}
                            onChange={handleFormInputChange}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          />
                        </div>

                      </div>

                      {/* Select product details to submit */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        <div className="flex flex-col space-y-1.5Col sm:col-span-2">
                          <label className="text-sm font-semibold text-slate-700">পছন্দের পোশাক <span className="text-rose-500 font-bold">*</span></label>
                          <select 
                            name="productType"
                            value={form.productType}
                            onChange={handleFormInputChange}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold"
                          >
                            <option value="Premium Casual Shirt">প্রিমিয়াম ক্যাজুয়াল শার্ট (৳ ১২৫০)</option>
                            <option value="Trendy Cotton T-Shirt">ট্রেন্ডি কটন টি-শার্ট (৳ ৪৯০)</option>
                            <option value="Exclusive Punjabi">এক্সক্লুসিভ রিচ কারুকাজ পাঞ্জাবি (৳ ১৮৫০)</option>
                          </select>
                        </div>

                        <div className="flex flex-col space-y-1.5Col">
                          <label className="text-sm font-semibold text-slate-700">সাইজ <span className="text-rose-500 font-bold">*</span></label>
                          <select 
                            name="size"
                            value={form.size}
                            onChange={handleFormInputChange}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono font-bold"
                          >
                            <option value="M">M (মিডিয়াম)</option>
                            <option value="L">L (লার্জ)</option>
                            <option value="XL">XL (এক্স-লার্জ)</option>
                            <option value="XXL">XXL (ডাবল এক্স-লার্জ)</option>
                          </select>
                        </div>

                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        <div className="flex flex-col space-y-1.5Col">
                          <label className="text-sm font-semibold text-slate-700">ডেলিভারি এলাকা <span className="text-rose-500 font-bold">*</span></label>
                          <select 
                            name="deliveryArea"
                            value={form.deliveryArea}
                            onChange={handleFormInputChange}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          >
                            <option value="rajshahi">রাজশাহী শহর (ফ্রি ডেলিভারি)</option>
                            <option value="nawabganj">নবাবগঞ্জ সদর / উপজেলা (ফ্রি ডেলিভারি)</option>
                            <option value="outside">দেশব্যাপী অন্যান্য জেলা (১২০ টাকা ডেলিভারি চার্জ)</option>
                          </select>
                        </div>

                        <div className="flex flex-col space-y-1.5Col">
                          <label className="text-sm font-semibold text-slate-700">পরিমাণ (পিস)</label>
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button 
                              type="button" 
                              onClick={() => handleQtyChange(form.quantity - 1)}
                              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold select-none cursor-pointer"
                            >
                              -
                            </button>
                            <span className="flex-grow text-center text-sm font-bold font-mono">{form.quantity}</span>
                            <button 
                              type="button" 
                              onClick={() => handleQtyChange(form.quantity + 1)}
                              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold select-none cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Complete address Details */}
                      <div className="flex flex-col space-y-1.5Col">
                        <label className="text-sm font-semibold text-slate-700">আপনার সম্পূর্ণ ঠিকানা <span className="text-rose-500 font-bold">*</span></label>
                        <textarea 
                          name="address"
                          required
                          rows={3}
                          placeholder="যেমন: বাড়ি নং, রোড নং, পাড়া বা মহল্লা, থানা এবং জেলার নাম উল্লেখ করুন..."
                          value={form.address}
                          onChange={handleFormInputChange}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                        />
                      </div>

                      {/* Optional Notes */}
                      <div className="flex flex-col space-y-1.5Col">
                        <label className="text-sm font-semibold text-slate-700">বিশেষ নির্দেশনা (যদি থাকে)</label>
                        <input 
                          type="text" 
                          name="notes"
                          placeholder="রঙের বিশেষ ধরন বা ডেলিভারির সময় নিয়ে নির্দেশনা..."
                          value={form.notes}
                          onChange={handleFormInputChange}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                        />
                      </div>

                      {/* Billing preview */}
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex justify-between items-center text-xs sm:text-sm">
                        <div className="text-slate-700 space-y-0.5">
                          <span className="block font-bold">আইটেম হিসাব: ৳ {getProductPrice(form.productType)} x {form.quantity} পিস</span>
                          <span className="block text-slate-500">ডেলিভারি এলাকা: {getAreaLabel(form.deliveryArea)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 text-[10px] block uppercase tracking-widest">মোট পরিশোধযোগ্য মূল্য:</span>
                          <span className="text-xl sm:text-2xl font-black text-emerald-950 font-display">৳ {(getProductPrice(form.productType) * form.quantity) + getDeliveryCost(form.deliveryArea)}</span>
                        </div>
                      </div>

                      {/* Button Submit area */}
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-xl text-center transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center space-x-2">
                              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>অর্ডার প্রসেস হচ্ছে...</span>
                            </span>
                          ) : (
                            <>
                              <Send className="w-5 h-5 text-emerald-100" />
                              <span className="font-display">অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center text-[11px] text-slate-400">
                        * বোতামটি স্পর্শ করলে কোনো অগ্রিম ফি কাটার ভয় নেই। মূল্য কেবলমাত্র কাপড় হাতে পেয়ে পরিশোধ করবেন।
                      </div>

                    </motion.form>
                  ) : (
                    // SECURE BOOKED TICKET VIEW
                    <motion.div 
                      key="order-success-step"
                      id="order-success-view"
                      className="p-6 sm:p-10 text-center space-y-8"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] font-display">আপনার অর্ডারটি সফলভাবে বুকড হয়েছে!</h3>
                        <p className="text-sm text-slate-500 font-mono">ORDER ID: {orderId}</p>
                      </div>

                      {/* Exact mandated thank you sentence highlighted as requested */}
                      <div className="bg-emerald-950 text-emerald-50 rounded-2xl p-5 border border-emerald-900 shadow-sm max-w-xl mx-auto">
                        <p className="text-sm sm:text-base font-semibold leading-relaxed">
                          "ధన్యవాదాలు! ধন্যবাদান্তে, আপনার সুবিধার জন্য আমরা সবসময় পাশে আছি। আজই অর্ডার করুন।"
                        </p>
                      </div>

                      {/* Ticket recap details */}
                      <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 text-left text-xs sm:text-sm max-w-xl mx-auto space-y-3">
                        <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[10px] border-b border-slate-200 pb-1.5 flex justify-between">
                          <span>অর্ডার মেমো বিবরণী</span>
                          <span className="text-emerald-700">UNPAID - CASH ON DELIVERY</span>
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-y-2 text-slate-600">
                          <div>ক্রেতার নাম:</div>
                          <div className="font-bold text-slate-900 text-right">{lastOrderDetails?.name}</div>

                          <div>যোগাযোগ মোবাইল:</div>
                          <div className="font-mono font-bold text-slate-900 text-right">{lastOrderDetails?.phone}</div>

                          <div>পছন্দের পণ্য:</div>
                          <div className="font-bold text-slate-900 text-right">
                            {productsData.find(p => p.enName === lastOrderDetails?.productType)?.name || lastOrderDetails?.productType}
                          </div>

                          <div>সাইজ ও পরিমাণ:</div>
                          <div className="font-mono font-bold text-slate-900 text-right">{lastOrderDetails?.size} Size x {lastOrderDetails?.quantity} পিস</div>

                          <div>ডেলিভারি ঠিকানা:</div>
                          <div className="font-bold text-slate-900 text-right col-span-2 text-xs leading-relaxed border-t border-dashed border-slate-200 pt-1.5 mt-1">
                            {lastOrderDetails?.address}
                          </div>
                        </div>

                        <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
                          <span>মোট ক্যাশ অন ডেলিভারি বিল:</span>
                          <span className="text-lg font-black text-emerald-800 font-mono">
                            ৳ {lastOrderDetails ? (getProductPrice(lastOrderDetails.productType) * lastOrderDetails.quantity) + getDeliveryCost(lastOrderDetails.deliveryArea) : 0}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 max-w-lg mx-auto">
                        অর্ডার সোর্সিং ঠিকানা: <strong>নবাবগঞ্জ, রাজশাহী, বাংলাদেশ</strong>। আমাদের সাপোর্ট ম্যানেজার খুব দ্রুত আপনার ফোনে কল করে পার্সেল পাঠানোর সময় নিশ্চিত করবেন। ২৪ ঘণ্টার মাঝে কল না পেলে কল করুন অথবা হোয়াটসঅ্যাপে জানান।
                      </div>

                      <div className="pt-4 flex justify-center space-x-3">
                        <button
                          onClick={handleResetOrder}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          আরেকটি নতুন অর্ডার করুন
                        </button>
                        <a
                          href="https://wa.me/8801700000000"
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>হোয়াটসঅ্যাপ কনফার্ম করুন</span>
                        </a>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>

          </div>
        </section>

      </main>

      {/* FOOTER & CREDITS */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
            
            {/* Logo description */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center p-1.5">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-display">সাখাওয়াত ফ্যাশন</span>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                উদারতা আর সততাকে সাথে নিয়ে কাপড়ের সেরা মানের প্রতিশ্রুতি। শোরুমের জাঁকজমক ও বাড়তি ট্যাক্স বাঁচিয়ে আমরা প্রতিটি তরুণের আভিজাত্য নিশ্চিত করি সুদূর নবাবগঞ্জ, রাজশাহী থেকে।
              </p>

              <div className="flex gap-4 pt-2 text-slate-400 text-xs font-mono">
                <span>📍 নবাবগঞ্জ, রাজশাহী (বাংলাদেশ)</span>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3 space-y-3 col-start-7">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">দ্রুত লিংকসমূহ</h4>
              <ul className="space-y-1 text-xs text-slate-300">
                <li><a href="#about" className="hover:text-emerald-500 transition-colors">আমাদের দর্শন</a></li>
                <li><a href="#products" className="hover:text-emerald-500 transition-colors">পোশাকের সংকলন</a></li>
                <li><a href="#calculator" className="hover:text-emerald-500 transition-colors">হিসাব ক্যালকুলেটর</a></li>
                <li><a href="#usp" className="hover:text-emerald-500 transition-colors">কেন আমাদের বিশ্বাস করবেন?</a></li>
              </ul>
            </div>

            {/* Contact channels info */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">অর্ডার ও কাস্টমার সার্ভিস</h4>
              <p className="text-xs text-slate-400">যেকোনো জিজ্ঞাসা, সাইজ নির্বাচন বা সমস্যার সাধারণ সমধানে আমাদের হটলাইনে ফোন দিন:</p>
              <div className="space-y-1.5">
                <a href="tel:+8801700000000" className="flex items-center space-x-2 text-sm font-bold text-white hover:text-emerald-500 transition-all">
                  <Phone className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>+880 1700-000000</span>
                </a>
                <span className="block text-[10px] text-slate-500">প্রতিদিন সকাল ৯টা থেকে রাত ১০টা পর্যন্ত কলার সাপোর্ট উপলব্ধ।</span>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} সাখাওয়াত ফ্যাশন (Sakhawat Fashion). সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="flex space-x-4">
              <span>নবাবগঞ্জ, রাজশাহী, বাংলাদেশ</span>
              <span>&bull;</span>
              <span>শতভাগ সিকিউরড ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
