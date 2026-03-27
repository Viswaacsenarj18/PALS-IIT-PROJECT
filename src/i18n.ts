import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/* ══════════════════════════════════════════════════════════
   ENGLISH
══════════════════════════════════════════════════════════ */
const en = {
  /* ── Platform ── */
  platformName: "HILLSMART",
  platformTagline: "Smart Farming Platform",

  /* ── Language names ── */
  langEN: "English",
  langTA: "Tamil",
  langKN: "Kannada",
  langHI: "Hindi",

  /* ── Auth ── */
  welcomeBack: "Welcome back",
  signInContinue: "Sign in to continue to HillSmart",
  createAccount: "Create account",
  joinPlatform: "Join HillSmart and start farming smarter",
  signInAs: "Sign in as",
  iAmA: "I am a",
  email: "Email address",
  emailPlaceholder: "you@example.com",
  password: "Password",
  passwordPlaceholder: "Enter your password",
  confirmPassword: "Confirm",
  confirmPlaceholder: "Re-enter",
  passwordHint: "Min 6 characters",
  forgotPassword: "Forgot password?",
  signIn: "Sign In",
  signingIn: "Signing in...",
  createBtn: "Create",
  creating: "Creating account...",
  alreadyHaveAccount: "Already have an account?",
  dontHaveAccount: "Don't have an account?",
  signUpLink: "Create one",
  signInLink: "Sign in",
  passwordMismatch: "Passwords do not match.",
  passwordTooShort: "Password must be at least 6 characters.",
  loginFailed: "Login failed. Please try again.",
  signupFailed: "Signup failed. Please try again.",
  networkError: "Network error. Please check your connection.",

  /* ── Roles ── */
  roleFarmer: "Farmer",
  roleFarmerDesc: "Grow & manage crops",
  roleTractorOwner: "Tractor Owner",
  roleTractorOwnerDesc: "Rent out machinery",
  roleBuyer: "Buyer",
  roleBuyerDesc: "Shop farm products",

  /* ── Perks ── */
  perkCropMonitoring: "Crop monitoring",
  perkSensorData: "Sensor data",
  perkRentTractors: "Rent tractors",
  perkSellProducts: "Sell products",
  perkRegisterTractors: "Register tractors",
  perkEarnRental: "Earn rental income",
  perkManageBookings: "Manage bookings",
  perkOwnerDashboard: "Owner dashboard",
  perkBrowseMarket: "Browse marketplace",
  perkBuySeeds: "Buy seeds & tools",
  perkEasyCheckout: "Easy checkout",
  perkTrackOrders: "Track orders",
  whatYouGet: "What you get as a",

  /* ── Navbar ── */
  nav: {
    dashboard: "Dashboard",
    sensors: "Sensors",
    marketplace: "Marketplace",
    tractors: "Tractors",
    rentTractor: "Rent Tractor",
    register: "Register",
    logout: "Logout",
    login: "Login",
    signup: "Sign Up"
  },

  /* ── Dashboard ── */
  smartFarm: "Smart Farm Dashboard",
  liveSystem: "Live sensor monitoring & controls",
  motorPanel: "Motor Control Panel",
  lastUpdated: "Last Updated",
  waiting: "Waiting...",
  smartControlPanel: "Smart Control Panel",
  motorControl: "Motor Control",
  valveControl: "Valve Control",
  valve1: "Valve 1",
  valve2: "Valve 2",
  on: "ON",
  off: "OFF",
  temperature: "Temperature",
  phLevel: "pH Level",
  ph: "pH",
  waterLevel: "Water Level",
  water: "Water",
  ldr: "Light (LDR)",
  celsius: "°C",
  percent: "%",
  noData: "No sensor data available",
  refresh: "Refresh",
  fetchError: "Failed to fetch sensor data",
  loadingSensors: "Loading sensors...",
  node1: "Node 1",
  node2: "Node 2",

  /* ── NPK ── */
  soilAnalysisHilly: "Smart Soil Nutrient Analysis (Hilly Region)",
  nitrogen: "Nitrogen (N)",
  phosphorus: "Phosphorus (P)",
  potassium: "Potassium (K)",
  recommendedCrop: "Recommended Crop",
  rec_banana: "Banana (High Nitrogen & Potassium Soil)",
  rec_turmeric: "Turmeric (Well-Balanced Nutrient Soil)",
  rec_garlic: "Garlic (Good Phosphorus & Potassium Level)",
  rec_corn: "Corn (High Nitrogen Soil)",
  rec_beans: "Beans (Moderate Fertile Soil)",
  rec_beetroot: "Beetroot (Potassium Rich Soil)",
  rec_ragi: "Ragi (Suitable for Moderate Soil)",
  rec_kambu: "Kambu / Millet (Tolerates Low Nutrient Soil)",
  rec_tapioca: "Tapioca (High Potassium Soil Preferred)",
  rec_soil_needs_improvement: "Soil Needs Nutrient Improvement",

  /* ── Common ── */
  loading: "Loading...",
  error: "Error",
  success: "Success",

  /* ── Marketplace ── */
  marketplace: {
    title: "HillSmart Marketplace",
    subtitle: "Fresh farm products from local farmers",
    searchPlaceholder: "Search products...",
    noResults: "No products found",
    loading: "Loading marketplace...",
    error: "Failed to load products",
    tryAgain: "Try Again",
    showing: "Showing {{count}} product{{count, plural, one {} other {s}}}",
    categories: {
      all: "All"
    },
    sort: {
      newest: "Newest",
      priceAsc: "Price: Low → High",
      priceDesc: "Price: High → Low",
      name: "Name A–Z"
    },
    product: {
      farmer: "👨‍🌾 {{name}}",
      price: "₹{{price}}/kg",
      stock: "{{stock}} kg available",
      onlyLeft: "Only {{stock}} kg left!",
      outOfStock: "Out of Stock",
      call: "📞 Call Seller",
      whatsapp: "💬 WhatsApp Message",
      buy: "🛒 Buy Now",
      details: "View Details"
    },
    phoneUnavailable: "Seller's phone number is not available",
    myProducts: "My Products",
    noProducts: "No products yet",
    addFirst: "Start by adding your first farm product to the marketplace",
    edit: "Edit",
    delete: "Delete",
    addProduct: "Add Product",
    refresh: "Refresh"
  },

  /* ── Language ── */
  language: "Language",
  english: "EN",
  tamil: "TA",
  kannada: "KN"
};

/* ══════════════════════════════════════════════════════════
   TAMIL
══════════════════════════════════════════════════════════ */
const ta = {
  platformName: "ஹில் ஸ்மார்ட்",
  platformTagline: "ஸ்மார்ட் விவசாய தளம்",
  langEN: "English",
  langTA: "தமிழ்",
  langKN: "ಕನ್ನಡ",
  langHI: "हिंदी",
  welcomeBack: "மீண்டும் வரவேற்கிறோம்",
  signInContinue: "ஹில் ஸ்மார்ட்டில் தொடர உள்நுழையவும்",
  createAccount: "கணக்கு உருவாக்கு",
  joinPlatform: "ஹில் ஸ்மார்ட்டில் சேர்ந்து விவசாயத்தை மேம்படுத்துங்கள்",
  signInAs: "இவ்வாறு உள்நுழையவும்",
  iAmA: "நான் ஒரு",
  email: "மின்னஞ்சல்",
  emailPlaceholder: "நீங்கள்@உதாரணம்.com",
  password: "கடவுச்சொல்",
  passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
  confirmPassword: "உறுதிப்படுத்தவும்",
  confirmPlaceholder: "மீண்டும் உள்ளிடவும்",
  passwordHint: "குறைந்தது 6 எழுத்துகள்",
  forgotPassword: "கடவுச்சொல்லை மறந்தீர்களா?",
  signIn: "உள்நுழை",
  signingIn: "உள்நுழைகிறது...",
  createBtn: "உருவாக்கு",
  creating: "கணக்கு உருவாக்கப்படுகிறது...",
  alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
  dontHaveAccount: "கணக்கு இல்லையா?",
  signUpLink: "உருவாக்கவும்",
  signInLink: "உள்நுழையவும்",
  passwordMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை.",
  passwordTooShort: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.",
  loginFailed: "உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
  signupFailed: "பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
  networkError: "நெட்வொர்க் பிழை. தொடர்பை சரிபார்க்கவும்.",
  roleFarmer: "விவசாயி",
  roleFarmerDesc: "பயிர்களை வளர்த்து நிர்வகி",
  roleTractorOwner: "டிராக்டர் உரிமையாளர்",
  roleTractorOwnerDesc: "இயந்திரங்களை வாடகைக்கு விடு",
  roleBuyer: "வாங்குபவர்",
  roleBuyerDesc: "விவசாய பொருட்களை வாங்கு",
  perkCropMonitoring: "பயிர் கண்காணிப்பு",
  perkSensorData: "சென்சார் தரவு",
  perkRentTractors: "டிராக்டர் வாடகை",
  perkSellProducts: "பொருட்களை விற்க",
  perkRegisterTractors: "டிராக்டர் பதிவு",
  perkEarnRental: "வாடகை வருமானம்",
  perkManageBookings: "முன்பதிவுகளை நிர்வகி",
  perkOwnerDashboard: "உரிமையாளர் டாஷ்போர்டு",
  perkBrowseMarket: "சந்தையை உலாவுக",
  perkBuySeeds: "விதைகள் மற்றும் கருவிகளை வாங்குக",
  perkEasyCheckout: "எளிதான செக்அவுட்",
  perkTrackOrders: "ஆர்டர்களை கண்காணி",
  whatYouGet: "நீங்கள் பெறுவது",
  nav: {
    dashboard: "டாஷ்போர்டு",
    sensors: "சென்சார்கள்",
    marketplace: "மார்க்கெட்பிளேஸ்",
    tractors: "டிராக்டர்கள்",
    rentTractor: "டிராக்டர் வாடகை",
    register: "பதிவு",
    logout: "வெளியேறு",
    login: "உள்நுழை",
    signup: "பதிவு செய்க"
  },
  smartFarm: "ஸ்மார்ட் பண்ணை டாஷ்போர்டு",
  liveSystem: "நேரடி சென்சார் கண்காணிப்பு மற்றும் கட்டுப்பாடுகள்",
  motorPanel: "மோட்டார் கட்டுப்பாட்டு பலகை",
  lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
  waiting: "காத்திருக்கிறது...",
  smartControlPanel: "ஸ்மார்ட் கட்டுப்பாட்டு பலகை",
  motorControl: "மோட்டார் கட்டுப்பாடு",
  valveControl: "வால்வு கட்டுப்பாடு",
  valve1: "வால்வு 1",
  valve2: "வால்வு 2",
  on: "ஆன்",
  off: "ஆஃப்",
  temperature: "வெப்பநிலை",
  phLevel: "pH அளவு",
  ph: "pH",
  waterLevel: "நீர் நிலை",
  water: "நீர்",
  ldr: "ஒளி (LDR)",
  celsius: "°C",
  percent: "%",
  noData: "சென்சார் தரவு கிடைக்கவில்லை",
  refresh: "புதுப்பி",
  fetchError: "சென்சார் தரவை பெறுவதில் தோல்வி",
  loadingSensors: "சென்சர்களை ஏற்றுகிறது...",
  node1: "நோடு 1",
  node2: "நோடு 2",
  soilAnalysisHilly: "மலைப்பகுதி மண் ஊட்டச்சத்து பகுப்பாய்வு",
  nitrogen: "நைட்ரஜன் (N)",
  phosphorus: "பாஸ்பரஸ் (P)",
  potassium: "பொட்டாசியம் (K)",
  recommendedCrop: "பரிந்துரைக்கப்பட்ட பயிர்",
  rec_banana: "வாழை (உயர் நைட்ரஜன் மற்றும் பொட்டாசியம் மண்)",
  rec_turmeric: "மஞ்சள் (சமநிலை ஊட்டச்சத்து மண்)",
  rec_garlic: "பூண்டு (நல்ல பாஸ்பரஸ் மற்றும் பொட்டாசியம் அளவு)",
  rec_corn: "மக்காச்சோளம் (உயர் நைட்ரஜன் மண்)",
  rec_beans: "பீன்ஸ் (மத்தியமான வளம்)",
  rec_beetroot: "பீட்ரூட் (பொட்டாசியம் நிறைந்த மண்)",
  rec_ragi: "ராகி (மத்தியம் மண்ணுக்கு பொருத்தமானது)",
  rec_kambu: "கம்பு (குறைந்த ஊட்டச்சத்து மண்ணில் வளரும்)",
  rec_tapioca: "கிழங்கு (உயர் பொட்டாசியம் மண்)",
  rec_soil_needs_improvement: "மண்ணில் ஊட்டச்சத்து மேம்பாடு தேவை",
  loading: "ஏற்றுகிறது...",
  error: "பிழை",
  success: "வெற்றி",
  marketplace: {
    title: "ஹில் ஸ்மார்ட் மார்க்கெட்பிளேஸ்",
    subtitle: "உள்ளூர் விவசாயிகளிடமிருந்து புதிய விவசாய பொருட்கள்",
    searchPlaceholder: "பொருட்களை தேடவும்...",
    noResults: "பொருட்கள் கிடைக்கவில்லை",
    loading: "மார்க்கெட்பிளேஸ் ஏற்றப்படுகிறது...",
    error: "பொருட்களை ஏற்ற முடியவில்லை",
    tryAgain: "மீண்டும் முயற்சி செய்யவும்",
    showing: "{{count}} பொருள்{{count, plural, one {்} other {்கள்}}} காட்டப்படுகிறது",
    categories: {
      all: "அனைத்தும்"
    },
    sort: {
      newest: "புதியது",
      priceAsc: "விலை: குறைந்தது → அதிகம்",
      priceDesc: "விலை: அதிகம் → குறைந்தது",
    },
    product: {
      farmer: "👨‍🌾 {{name}}",
      price: "₹{{price}}/கிலோ",
      stock: "{{stock}} கிலோ கிடைக்கிறது",
      onlyLeft: "இன்னும் {{stock}} கிலோ மட்டுமே!",
      outOfStock: "பங்கு இல்லை",
      call: "📞 விற்பனையாளரை அழை",
      whatsapp: "💬 வாட்ஸ்அப் செய்தி",
      buy: "🛒 இப்போது வாங்கவும்",
      details: "விவரங்களை பார்"
    },
    phoneUnavailable: "விற்பனையாளரின் தொலைபேசி கிடைக்கவில்லை",
    myProducts: "எனது பொருட்கள்",
    noProducts: "இன்னும் பொருட்கள் இல்லை",
    addFirst: "உங்கள் முதல் பொருளை சேர்க்கவும்",
    edit: "திருத்து",
    delete: "நீக்கு",
    addProduct: "பொருள் சேர்க்கவும்",
    refresh: "புதுப்பி"
  },
  language: "மொழி",
  english: "EN",
  tamil: "TA",
  kannada: "KN"
};

/* ══════════════════════════════════════════════════════════
   KANNADA
══════════════════════════════════════════════════════════ */
const kn = {
  platformName: "ಹಿಲ್ ಸ್ಮಾರ್ಟ್",
  platformTagline: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆ",
  langEN: "English",
  langTA: "தமிழ்",
  langKN: "ಕನ್ನಡ",
  langHI: "हिंदी",
  welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ",
  signInContinue: "ಹಿಲ್ ಸ್ಮಾರ್ಟ್‌ಗೆ ಮುಂದುವರಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ",
  createAccount: "ಖಾತೆ ರಚಿಸಿ",
  joinPlatform: "ಹಿಲ್ ಸ್ಮಾರ್ಟ್ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆಗೆ ಸೇರಿ",
  signInAs: "ಇಂತ ಲಾಗಿನ್ ಮಾಡಿ",
  iAmA: "ನಾನು ಒಬ್ಬ",
  email: "ಇಮೇಲ್",
  emailPlaceholder: "ನೀವು@ಉದಾಹರಣೆ.com",
  password: "ಪಾಸ್‌ವರ್ಡ್",
  passwordPlaceholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
  confirmPassword: "ದೃಢೀಕರಿಸಿ",
  confirmPlaceholder: "ಮತ್ತೆ ನಮೂರ್ದಿಸಿ",
  passwordHint: "ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು",
  forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
  signIn: "ಲಾಗಿನ್",
  signingIn: "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...",
  createBtn: "ರಚಿಸಿ",
  creating: "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
  alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
  dontHaveAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
  signUpLink: "ರಚಿಸಿ",
  signInLink: "ಲಾಗಿನ್",
  passwordMismatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೊಳ್ಳುತ್ತಿಲ್ಲ",
  passwordTooShort: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು ಇರಬೇಕು.",
  loginFailed: "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  signupFailed: "ಸೈನಪ್ ವಿಫಲವಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  networkError: "ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ.",
  roleFarmer: "ರೈತ",
  roleFarmerDesc: " ಬೆಳೆಗಳನ್ನು ಬೆಳೆಸಿ ನಿರ್ವಹಿಸಿ",
  roleTractorOwner: "ಟ್ರಾಕ್ಟರ್ ಮಾಲಿಕ",
  roleTractorOwnerDesc:"ರಯಂತ್ರಗಳನ್ನು ಬಾಡಿಗೆಗೆ ನೀಡಿ",
  roleBuyer: "ಖರೀದಿದಾರ",
  roleBuyerDesc: "ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ",
  perkCropMonitoring: "ಬೆಳೆ ಪರ್ಯವೇಕ್ಷಣೆ",
  perkSensorData: "ಸೆನ್ಸರ್ ಡೇಟಾ",
  perkRentTractors: "ಟ್ರಾಕ್ಟರ್ ಬಾಡಿಗೆ",
  perkSellProducts: "ಉತ್ಪನ್ನಗಳನ್ನು ಮಾರಾಟ ಮಾಡಿ",
  perkRegisterTractor: "ಟ್ರಾಕ್ಟರ್ ನೋಂದಾಯಿಸಿ",
  perkEarnRentalIncome: "ಬಾಡಿಗೆ ಆದಾಯ ಗಳಿಸಿ",
  perkManageBookings: "ಬುಕಿಂಗ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
  perkOwnerDashboard: "ಮಾಲಿಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  perkBrowseMarketplace: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಅನ್ನು ವರೆಡಿ",
  perkBuySeedsTools: "ವೀಜೆಗಳು & ಉಪಕರಣಗಳನ್ನು ಖರೀದಿಸಿ",
  perkEasyCheckout: "ಸುಲಭ ಚೆಕ್‌ಔಟ್",
  perkTrackOrders: "ಆರ್ಡರ್‌ಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
  whatYouGet: "ನೀವು ಪಡೆಯುವುದು",
  nav: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    sensors: "ಸೆನ್ಸರ್‌ಗಳು",
    marketplace: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",
    tractors: "ಟ್ರಾಕ್ಟರ್‌ಗಳು",
    rentTractor: "ಟ್ರಾಕ್ಟರ್ ಬಾಡಿಗೆ",
    register: "ನೋಂದಣಿ",
    logout: "ಲಾಗ್ ಔಟ್",
    login: "ಲಾಗಿನ್",
    signup: "ಸೈನ್ ಅಪ್"
  },
  smartFarm: "ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  liveSystem: "ನೇರ ಸೆನ್ಸರ್ ಪರ್ಯವೇಕ್ಷಣೆ & ನಿಯಂತ್ರಣಗಳು",
  motorPanel: "ಮೋಟಾರ್ ನಿಯಂತ್ರಣ ಪ್ಯಾನೆಲ್",
  lastUpdated: "ಕೊನೆಯ ನವೀಕರಣ",
  waiting: "ಕಾಯುತ್ತಿದೆ...",
  smartControlPanel: "ಸ್ಮಾರ್ಟ್ ನಿಯಂತರಣ ಪ್ಯಾನೆಲ್",
  motorControl: "ಮೋಟಾರ್ ನಿಯಂತ್ರಣ",
  valveControl: "ವಾಲ್ವ್ ನಿಯಂತ್ರಣ",
  valve1: "ವಾಲ್ವ್ 1",
  valve2: "ವಾಲ್ವ್ 2",
  on: "ಆನ್",
  off: "ಆಫ್",
  temperature: "ಅಂಕಣ",
  phLevel: "pH ಮಟ್ಟ",
  ph: "pH",
  waterLevel: "ನೀರಿನ ಮಟ್ಟ",
  water: "ನೀರು",
  ldr: "ಬೆಳಕು (LDR)",
  celsius: "°C",
  percent: "%",
  noData: "ಸೆನ್ಸರ್ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ",
  refresh: "ರಿಫ್ರೆಶ್",
  fetchError: "ಸೆನ್ಸರ್ ಡೇಟಾ ತರಲು ವಿಫಲ",
  loadingSensors: "ಸೆನ್ಸರ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡುತ್ತಿದೆ...",
  node1: "ನೋಡ್ 1",
  node2: "ನೋಡ್ 2",
  soilAnalysisHilly: "ಪರ್ವತ ಪ್ರದೇಶ ಮಣ್ಣು ಪೋಷಕಾಂಶ ವಿಶ್ಲೇಷಣೆ",
  nitrogen: "ನೈಟ್ರೋಜನ್ (N)",
  phosphorus: "ಫಾಸ್ಫರಸ್ (P)",
  potassium: "ಪೊಟ್ಯಾಸಿಯಮ್ (K)",
  recommendedCrop: "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ",
  rec_banana: "ಬಾಳೆ (ಉತ್ತಮ ನೈಟ್ರೋಜನ್ ಮತ್ತು ಪೊಟ್ಯಾಸಿಯಮ್ ಮಣ್ಣು)",
  rec_turmeric: "ಅರಿಶಿನ (ಸಮತೋಲಿತ ಪೋಷಕಾಂಶ ಮಣ್ಣು)",
  rec_garlic: "ಬೆಳ್ಳುಳ್ಳಿ (ಉತ್ತಮ ಫಾಸ್ಫರಸ್ ಮತ್ತು ಪೊಟ್ಯಾಸಿಯಮ್ ಮಟ್ಟ)",
  rec_c 
   
Assistant: 









The issue is a **namespace mismatch**:

1. **i18n.ts** has **flat keys** like `nav.dashboard` → `"Dashboard"`
2. **Navbar** uses **nested keys** like `t("nav.dashboard")` - expects `i18n.t('nav.dashboard')` to resolve to `translation.nav.dashboard`

**Navbar expects:**
```
{
  "nav": {
    "dashboard": "Dashboard"
  }
}
```

**i18n.ts provides:**
```
{
  "nav.dashboard": "Dashboard"
}
```

**Fix: Update i18n.ts to use nested structure matching Navbar/Dashboard expectations**

```json
{
  "nav": {
    "dashboard": "Dashboard",
    "sensors": "Sensors"
  },
  "dashboard": {
    "smartFarm": "Smart Farm Dashboard"
  }
}
```

**Dashboard uses `t("smartFarm")` - maps to top-level**

**Action: Replace i18n.ts with nested structure**

Create new i18n.ts with proper nested translations for all languages. 

The locales/*.json have **correct nested structure** (auth.role.nav etc), but i18n.ts overrides with flat keys.

**Primary issue: i18n.ts is the active config (imported in main.tsx), locales JSON ignored**

**Solution: Restructure i18n.ts to nested object matching component keys** 

**Plan:**
1. Update i18n.ts with nested `nav`, `dashboard`, `marketplace` namespaces
2. Ensure all languages (en/ta/kn/hi) have matching structure  
3. Test language switch - now pages will translate fully

**Added missing keys from locales JSON:**
- `dashboard.node1`, `water`, `phLevel`, `celsius`, `percent`
- `marketplace` full structure
- `common.loading`, `error`, `success`

**Restart dev server after update**

</thinking>

<xai:function_call name="create_file">
<parameter name="absolute_path">e:/PALS IIT/PALS-IIT-PROJECT/src/i18n.ts
