/**
 * i18n Translation Hook — reactive to setting store changes.
 */

import { useCallback } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { TRANSLATIONS, TranslationKey } from './translations';
import { LanguageCode } from '../constants/app';

export const useTranslation = () => {
  const language = useSettingsStore(s => s.language) as LanguageCode;

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const dict = TRANSLATIONS[language] ?? TRANSLATIONS.en;
      return dict[key] ?? fallback ?? TRANSLATIONS.en[key] ?? key;
    },
    [language],
  );

  return { t, language };
};
