import { LocaleDefaults } from "../locale/defaults";
import { Locale } from "@brz-fivem-sdk/common/locale.types";
import { BrazilianPortuguese } from "../locale/pt-br";

declare const SETTINGS: any;
declare const LOCALE_OVERRIDES: any;

export type ScriptLocale<T extends keyof typeof LocaleDefaults> = Locale<
  T,
  (typeof LocaleDefaults)[T]["variables"]
>;

export const t = <T extends keyof typeof LocaleDefaults>(
  langKey: T,
  vars?: ScriptLocale<T>["variables"]
): string => {
  const scriptLanguage = SETTINGS.DEFAULT_LANG as keyof typeof locales;

  const locale = locales[scriptLanguage] || {};

  const overrides = localeOverrides(scriptLanguage);

  let phrase: string = overrides[langKey] || locale[langKey];

  if (!vars) return phrase;

  for (const varName of Object.keys(vars)) {
    phrase = phrase.replace(`%${varName}%`, vars[varName as keyof typeof vars]);
  }

  return phrase;
};

const localeOverrides = (language: string) =>
  LOCALE_OVERRIDES?.[language] ?? {};

const getLocaleVars = (locale: typeof LocaleDefaults) =>
  Object.values(locale).reduce((acc, curr, index) => {
    if (typeof curr === "string") {
      acc[Object.keys(LocaleDefaults)[index]] = curr;
    } else {
      acc[Object.keys(LocaleDefaults)[index]] = curr.label;
    }

    return acc;
  }, {} as any);

const locales = {
  "en-us": getLocaleVars(LocaleDefaults),
  "pt-br": getLocaleVars(BrazilianPortuguese),
};
