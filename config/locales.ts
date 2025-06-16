import { LocaleDefaults } from "../locale/defaults";
import { Locale } from "@brz-fivem-sdk/common/locale.types";

declare const SETTINGS: any;
declare const LOCALE_OVERRIDES: any;

const DEFAULT_LANGUAGE = "en-us";

let SCRIPT_LANGUAGE =
  SETTINGS.LANGUAGE || SETTINGS.DEFAULT_LANG || DEFAULT_LANGUAGE;

export type ScriptLocale<T extends keyof typeof LocaleDefaults> = Locale<
  T,
  (typeof LocaleDefaults)[T]["variables"]
>;

export const t = <T extends keyof typeof LocaleDefaults>(
  langKey: T,
  vars?: ScriptLocale<T>["variables"]
): string => {
  const scriptLanguage = SCRIPT_LANGUAGE as keyof typeof locales;

  const locale = locales[scriptLanguage] || {};

  const overrides = localeOverrides(scriptLanguage);

  let phrase: string = overrides[langKey] || locale[langKey];

  if (!vars) return phrase;

  for (const varName of Object.keys(vars)) {
    phrase = phrase.replace(`%${varName}%`, vars[varName as keyof typeof vars]);
  }

  return phrase;
};

const addLocaleOverrides = (
  lang: string,
  overrides: Record<string, string>
) => {
  LOCALE_OVERRIDES[lang] = {
    ...LOCALE_OVERRIDES[lang],
    ...overrides,
  };
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
};

(() => {
  if (typeof LoadResourceFile == "undefined") {
    console.error(
      "LoadResourceFile is not defined. This script is probably being loaded in a NUI or outside FiveM."
    );
    SCRIPT_LANGUAGE = DEFAULT_LANGUAGE;
    return;
  }

  const localeFilePath = `locale/${SCRIPT_LANGUAGE}.json`;

  const fileContents = LoadResourceFile(
    GetCurrentResourceName(),
    localeFilePath
  );

  if (!fileContents) {
    console.error(
      `Locale file not found: ${localeFilePath}. Please ensure the file exists in the resource directory. Using default locale.`
    );
    SCRIPT_LANGUAGE = DEFAULT_LANGUAGE;
    return;
  }

  const customLocale = JSON.parse(fileContents) as Record<string, string>;

  addLocaleOverrides(SCRIPT_LANGUAGE, customLocale);
})();
