import { HomePageContent } from "../../components/HomePageContent";
import { getDictionary } from "../../i18n/get-dictionary";
import { createHomeMetadata } from "../(helpers)/locale-metadata";

const LOCALE = "ro" as const;

export const generateMetadata = createHomeMetadata(LOCALE);

export default function RoHomePage() {
  const dictionary = getDictionary(LOCALE);
  return <HomePageContent dictionary={dictionary} />;
}
