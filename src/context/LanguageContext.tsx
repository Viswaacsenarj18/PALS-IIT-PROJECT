import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Translation {
  [key: string]: string | Translation;
}

interface Translations {
  en: Translation;
  ta: Translation;
  kn: Translation;
}

const translations: Translations = {
  en: {
    marketplace: {
      title: "HillSmart Marketplace",
      subtitle: "Fresh farm products from local farmers",
      searchPlaceholder: "Search products...",
      noResults: "No products found",
      loading: "Loading...",
      error: "Error loading products",
      tryAgain: "Try Again",
      categories: {
        all: "All",
      },
      sort: {
        newest: "Newest",
        priceAsc: "Price: Low to High",
        priceDesc: "Price: High to Low",
        name: "Name A-Z"
      },
      results: {
        one: "Showing 1 product",
        other: "Showing {{count}} products"
      },
      product: {
        farmer: "👨‍🌾 {{name}}",
        price: "₹{{price}}/kg",
        stock: "Stock: {{stock}} kg",
        available: "{{stock}} kg available",
        onlyLeft: "Only {{stock}} kg left!",
        outOfStock: "Out of Stock",
        call: "📞 Call Seller",
        message: "💬 WhatsApp Message",
        buy: "🛒 Buy Now",
        details: "View Details"
      }
    },
    navbar: {
      marketplace: "Marketplace"
    }
  },
  ta: {
    marketplace: {
      title: "ஹில் ஸ்மார்ட் மார்க்கெட்பிளேஸ்",
      subtitle: "உள்ளூர் விவசாயிகளிடமிருந்து புதிய பொருட்கள்",
      searchPlaceholder: "பொருட்களைத் தேடுக...",
      noResults: "பொருட்கள் இல்லை",
      loading: "ஏற்றுகிறது...",
      error: "பிழை",
      tryAgain: "மீண்டும் முயற்சி",
      categories: {
        all: "அனைத்தும்"
      },
      sort: {
        newest: "புதியது",
        priceAsc: "குறைந்த விலை முதல்",
        priceDesc: "அதிக விலை முதல்",
        name: "பெயர் ஆ-கி"
      },
      results: {
        one: "1 பொருள் காட்டப்படுகிறது",
        other: "{{count}} பொருட்கள் காட்டப்படுகிறது"
      },
      product: {
        farmer: "👨‍🌾 {{name}}",
        price: "₹{{price}}/கிலோ",
        stock: "பங்கு: {{stock}} கிலோ",
        available: "{{stock}} கிலோ கிடைக்கிறது",
        onlyLeft: "இன்னும் {{stock}} கிலோ மட்டுமே!",
        outOfStock: "பங்கு இல்லை",
        call: "📞 விற்பனையாளரை அழை",
        message: "💬 வாட்ஸ்அப் செய்தி",
        buy: "🛒 வாங்கு",
        details: "விவரங்கள் பார்"
      }
    },
    navbar: {
      marketplace: "மார்க்கெட்பிளேஸ்"
    }
  },
  kn: {
    marketplace: {
      title: "ಹಿಲ್ ಸ್ಮಾರ್ಟ್ ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",
      subtitle: "ಸ್ಥಳೀಯ ರೈತರಿಂದ ತಾಜಾ ಉತ್ಪನ್ನಗಳು",
      searchPlaceholder: "ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...",
      noResults: "ಉತ್ಪನ್ನಗಳು ಇಲ್ಲ",
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      error: "ದೋಷ",
      tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
      categories: {
        all: "ಎಲ್ಲಾ"
      },
      sort: {
        newest: "ಹೊಸದು",
        priceAsc: "ಕಡಿಮೆ ಬೆಲೆ ಮೊದಲು",
        priceDesc: "ಹೆಚ್ಚು ಬೆಲೆ ಮೊದಲು",
        name: "ಹೆಸರು ಕ-ಅ"
      },
      results: {
        one: "1 ಉತ್ಪನ್ನ ತೋರಿಸಲಾಗಿದೆ",
        other: "{{count}} ಉತ್ಪನ್ನಗಳು ತೋರಿಸಲಾಗಿದೆ"
      },
      product: {
        farmer: "👨‍🌾 {{name}}",
        price: "₹{{price}}/ಕೆಜಿ",
        stock: "ಸ್ಟಾಕ್: {{stock}} ಕೆಜಿ",
        available: "{{stock}} ಕೆಜಿ ಲಭ್ಯ",
        onlyLeft: "ಕೇವಲ {{stock}} ಕೆಜಿ ಉಳಿದಿದೆ!",
        outOfStock: "ಸ್ಟಾಕ್ ಇಲ್ಲ",
        call: "📞 ಮಾರಾಟಗಾರನ ಕರೆ",
        message: "💬 ವಾಟ್ಸ್‌ಅಪ್ ಸಂದೇಶ",
        buy: "🛒 ಖರೀದಿಸಿ",
        details: "ವಿವರಗಳು"
      }
    },
    navbar: {
      marketplace: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್"
    }
  }
};

interface LanguageContextType {
  t: (key: string, params?: Record<string, any>) => string;
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'ta' | 'kn'>('en');

  const t = (key: string, params: Record<string, any> = {}) => {
    let value = translations[language][key as keyof Translation];
    if (typeof value === 'object') {
      value = translations.en[key as keyof Translation] as string || key;
    }
    return interpolate(value as string, params);
  };

  const interpolate = (str: string, params: Record<string, any>) => {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || match);
  };

  const setLanguage = (lang: 'en' | 'ta' | 'kn') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem('language') as 'en' | 'ta' | 'kn' | null;
    if (saved) {
      setLanguageState(saved);
    }
  }, []);

  const value = {
    t,
    language,
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
};

