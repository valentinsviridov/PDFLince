import fs from 'node:fs';
import path from 'node:path';

const SITEMAP_PATH = process.argv[2] || './out/sitemap.xml';
const HOST = 'pdflince.com';
const KEY = '7a258aaa2a9b472bb6e97935fe5e82ca';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function pingIndexNow() {
  try {
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.error(`Sitemap not found at ${SITEMAP_PATH}`);
      process.exit(1);
    }

    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    const urlRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
    const urls = [];
    let match;

    while ((match = urlRegex.exec(sitemapContent)) !== null) {
      urls.push(match[1]);
    }

    if (urls.length === 0) {
      console.error('No URLs found in sitemap');
      process.exit(1);
    }

    console.log(`Submitting ${urls.length} URLs to IndexNow...`);

    if (process.env.DRY_RUN === 'true') {
      console.log('--- DRY RUN MODE ---');
      console.log('URLs to be submitted:', urls);
      console.log('--------------------');
      return;
    }

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    if (response.ok) {
      console.log('✅ IndexNow submission successful');
    } else {
      const errorText = await response.text();
      console.error(`❌ IndexNow submission failed (${response.status}):`, errorText);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during IndexNow ping:', error);
    process.exit(1);
  }
}

pingIndexNow();
