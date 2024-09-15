import { LocaleDefaults } from "../locale/defaults";
import { DEFAULT_LANG } from "./config";
import { Locale } from "../brz-core/locale/locale.types";

export type ScriptLocale<T extends keyof typeof LocaleDefaults> = Locale<
  T,
  (typeof LocaleDefaults)[T]["variables"]
>;

export const t = <T extends keyof typeof LocaleDefaults>(
  phase: T,
  vars?: ScriptLocale<T>["variables"]
): string => {
  const locale = locales[DEFAULT_LANG];

  let phrase: string = locale[phase];

  if (!vars) return phrase;

  for (const varName of Object.keys(vars)) {
    phrase = phrase.replace(`%${varName}%`, vars[varName as keyof typeof vars]);
  }

  return phrase;
};

const locales = {
  "pt-br": Object.values(LocaleDefaults).reduce((acc, curr, index) => {
    if (typeof curr === "string") {
      acc[Object.keys(LocaleDefaults)[index]] = curr;
    } else {
      acc[Object.keys(LocaleDefaults)[index]] = curr.label;
    }

    return acc;
  }, {} as any),
};
