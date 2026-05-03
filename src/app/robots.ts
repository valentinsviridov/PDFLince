import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://pdflince.com";

    // Cast to bypass Next.js restricted Sitemap type since it doesn't officially support 'host' yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const robotsObj: any = {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: "pdflince.com",
    };

    return robotsObj as MetadataRoute.Robots;
}
