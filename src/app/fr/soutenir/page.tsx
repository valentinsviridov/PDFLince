import { SupportPageContent } from "../../../components/SupportPageContent";
import { createSupportMetadata } from "../../(helpers)/locale-metadata";

const LOCALE = "fr" as const;

export const generateMetadata = createSupportMetadata(LOCALE);

export default function FrSupportPage() {
  return <SupportPageContent />;
}
