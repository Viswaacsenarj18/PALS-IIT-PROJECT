import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'kn', label: 'ಕನ್ನಡ' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-1">
      {languages.map((language) => (
        <button
          key={language.code}
          className={`px-2 py-1 rounded text-xs font-bold transition-all ${
            i18n.language === language.code
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => changeLanguage(language.code)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

