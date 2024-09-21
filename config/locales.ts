import { LocaleDefaults } from "../locale/defaults";
import { Locale } from "../brz-core/locale/locale.types";
import { BrazilianPortuguese } from "../locale/pt-br";

declare const SETTINGS: any;

export type ScriptLocale<T extends keyof typeof LocaleDefaults> = Locale<
  T,
  (typeof LocaleDefaults)[T]["variables"]
>;

export const t = <T extends keyof typeof LocaleDefaults>(
  phase: T,
  vars?: ScriptLocale<T>["variables"]
): string => {
  const locale = locales[SETTINGS.DEFAULT_LANG as keyof typeof locales];

  let phrase: string = locale[phase];

  if (!vars) return phrase;

  for (const varName of Object.keys(vars)) {
    phrase = phrase.replace(`%${varName}%`, vars[varName as keyof typeof vars]);
  }

  return phrase;
};

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
