import { createLocaleOperationHandlers } from "../../../(helpers)/operation-handlers";

const LOCALE = "hu" as const;

const { generateStaticParams, generateMetadata, OperationPage } = createLocaleOperationHandlers(LOCALE);

export { generateStaticParams, generateMetadata };
export default OperationPage;
