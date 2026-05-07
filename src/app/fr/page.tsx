import { HomePageContent } from "../../components/HomePageContent";
import { getDictionary } from "../../i18n/get-dictionary";
import { createHomeMetadata } from "../(helpers)/locale-metadata";

const LOCALE = "fr" as const;

export const generateMetadata = createHomeMetadata(LOCALE);

export default function FrHomePage() {
  const dictionary = getDictionary(LOCALE);
  return <HomePageContent dictionary={dictionary} />;
}
