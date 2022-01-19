export interface LanguageProps {
  languageId: string;
  locale: string;
  name: string;
  icon: string;
}

const languageData: LanguageProps[] = [
  {
    languageId: 'english',
    locale: 'en',
    name: 'English',
    icon: 'us',
  },
  {
    languageId: 'spanish',
    locale: 'es',
    name: 'Espanõl',
    icon: 'es',
  },
  // {
  //   languageId: 'chinese',
  //   locale: 'zh',
  //   name: 'Chinese',
  //   icon: 'cn',
  // },
  // {
  //   languageId: 'french',
  //   locale: 'fr',
  //   name: 'French',
  //   icon: 'fr',
  // },
  // {
  //   languageId: 'italian',
  //   locale: 'it',
  //   name: 'Italian',
  //   icon: 'it',
  // },
  // {
  //   languageId: 'saudi-arabia',
  //   locale: 'ar',
  //   name: 'Arabic',
  //   icon: 'sa',
  // },
];
export default languageData;
