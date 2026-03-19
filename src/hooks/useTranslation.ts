import { useApp } from "@/context/AppContext";
import { translations, TranslationKey } from "@/i18n/translations";

export const useTranslation = () => {
  const { language } = useApp();
  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] ?? translations.en[key];
  };
  return { t, language };
};
