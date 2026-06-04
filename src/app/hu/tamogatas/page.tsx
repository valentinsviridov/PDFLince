import { SupportPageContent } from "../../../components/SupportPageContent";
import { createSupportMetadata } from "../../(helpers)/locale-metadata";

const LOCALE = "hu" as const;

export const generateMetadata = createSupportMetadata(LOCALE);

export default function HuSupportPage() {
  return <SupportPageContent />;
}
