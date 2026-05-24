import { SupportPageContent } from "../../../components/SupportPageContent";
import { createSupportMetadata } from "../../(helpers)/locale-metadata";

const LOCALE = "ro" as const;

export const generateMetadata = createSupportMetadata(LOCALE);

export default function RoSupportPage() {
  return <SupportPageContent />;
}
