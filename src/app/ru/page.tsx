import { HomePageContent } from "../../components/HomePageContent";
import { getDictionary } from "../../i18n/get-dictionary";
import { createHomeMetadata } from "../(helpers)/locale-metadata";

const LOCALE = "ru" as const;

export const generateMetadata = createHomeMetadata(LOCALE);

export default function RuHomePage() {
  const dictionary = getDictionary(LOCALE);
  return <HomePageContent dictionary={dictionary} />;
}
