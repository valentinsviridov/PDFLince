import { FaqPageContent } from "../../../components/FaqPageContent";
import { getDictionary } from "../../../i18n/get-dictionary";
import { createFaqMetadata } from "../../(helpers)/locale-metadata";

const LOCALE = "hu" as const;

export const generateMetadata = createFaqMetadata(LOCALE);

export default function HuFaqPage() {
  const dictionary = getDictionary(LOCALE);
  return <FaqPageContent dictionary={dictionary} />;
}
