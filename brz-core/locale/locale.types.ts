export type Locale<LocaleLabel, LocaleVar> = {
  label: LocaleLabel;
  variables: {
    [key in keyof LocaleVar]: string;
  };
};
