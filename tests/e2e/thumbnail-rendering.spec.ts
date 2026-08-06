import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTestPdfPath = (workerIndex: number) =>
    path.join(__dirname, `thumbnail-render-test-${workerIndex}.pdf`);

/**
 * Create a PDF with highly visible, coloured content that is impossible to
 * mistake for a blank white page.  We draw a large filled rectangle and bold
 * text so that any correct renderer will produce non-white pixels across a
 * significant area of the thumbnail.
 */
test.beforeAll(async ({}, testInfo) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);

    // Large blue rectangle covering most of the page
    page.drawRectangle({
        x: 20,
        y: 20,
        width: 360,
        height: 560,
        color: rgb(0.1, 0.2, 0.8),
    });

    // White text on top for contrast
    page.drawText('THUMBNAIL TEST', {
        x: 60,
        y: 300,
        size: 36,
        color: rgb(1, 1, 1),
    });

    // Second page with a different colour so reorder thumbnails are distinct
    const page2 = pdfDoc.addPage([400, 600]);
    page2.drawRectangle({
        x: 20,
        y: 20,
        width: 360,
        height: 560,
        color: rgb(0.8, 0.2, 0.1),
    });
    page2.drawText('PAGE TWO', {
        x: 80,
        y: 300,
        size: 36,
        color: rgb(1, 1, 1),
    });

    fs.writeFileSync(getTestPdfPath(testInfo.workerIndex), await pdfDoc.save());
});

test.afterAll(({}, testInfo) => {
    const testFile = getTestPdfPath(testInfo.workerIndex);
    if (fs.existsSync(testFile)) {
        try {
            fs.unlinkSync(testFile);
        } catch { }
    }
});

/**
 * Helper: given an <img> element handle, draw it onto an off-screen canvas and
 * return the percentage of pixels that are NOT white (R≥250 && G≥250 && B≥250).
 * A truly rendered PDF page with our coloured rectangle should have a large
 * percentage of non-white pixels; a blank/white thumbnail will have ≈0%.
 */
async function getNonWhitePixelPercent(
    page: import('@playwright/test').Page,
    imgLocator: import('@playwright/test').Locator,
): Promise<number> {
    // Ensure the image is loaded and has non-zero natural dimensions
    await expect(imgLocator).toBeVisible({ timeout: 30_000 });
    await imgLocator.evaluate(
        (img: HTMLImageElement) =>
            new Promise<void>((resolve) => {
                if (img.complete && img.naturalWidth > 0) return resolve();
                img.onload = () => resolve();
                // For data-URL images that are already loaded
                setTimeout(resolve, 2000);
            }),
    );

    return imgLocator.evaluate((img: HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (w === 0 || h === 0) return 0;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let nonWhite = 0;
        const totalPixels = w * h;
        for (let i = 0; i < data.length; i += 4) {
            // A pixel is "non-white" if any of R,G,B is below 250
            if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) {
                nonWhite++;
            }
        }
        return (nonWhite / totalPixels) * 100;
    });
}

test.describe('PDF Thumbnail Rendering', () => {
    test('Crop preview renders visible (non-white) content', async ({ page }, testInfo) => {
        test.setTimeout(120_000);

        await page.goto('/crop', { timeout: 60_000 });

        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(getTestPdfPath(testInfo.workerIndex));

        // Wait for the page selector thumbnails to appear and click the first page
        const thumbnailCards = page.locator(
            '.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-5 > div',
        );
        await expect(thumbnailCards.first()).toBeVisible({ timeout: 30_000 });

        // Verify the PageSelector thumbnail itself is rendered with content
        const selectorImg = thumbnailCards.first().locator('img').first();
        const selectorPercent = await getNonWhitePixelPercent(page, selectorImg);
        console.log(`PageSelector thumbnail non-white pixels: ${selectorPercent.toFixed(1)}%`);
        expect(selectorPercent).toBeGreaterThan(20);

        // Click to open the crop interface
        await thumbnailCards.first().click();

        // Wait for the crop preview image to load
        const cropPreview = page.locator('div.touch-none.select-none img');
        await expect(cropPreview).toBeVisible({ timeout: 30_000 });

        const cropPercent = await getNonWhitePixelPercent(page, cropPreview);
        console.log(`Crop preview non-white pixels: ${cropPercent.toFixed(1)}%`);

        // The test PDF has a large blue rectangle: we expect well over 20% non-white pixels.
        // A blank/white render would give ≈0%.
        expect(cropPercent).toBeGreaterThan(20);
    });

    test('Page reorder thumbnails render visible (non-white) content', async ({ page }, testInfo) => {
        test.setTimeout(120_000);

        await page.goto('/reorder', { timeout: 60_000 });

        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(getTestPdfPath(testInfo.workerIndex));

        // Wait for PageOrderer to finish loading — the "Original: Page 1" label only
        // appears once thumbnails are rendered and loading=false
        const firstPageLabel = page.getByText('Original: Page 1').first();
        await expect(firstPageLabel).toBeVisible({ timeout: 60_000 });

        // Check thumbnail images inside the page-thumbnail grid
        const thumbnailImages = page.locator('.page-thumbnail-grid .page-thumbnail img');
        await expect(thumbnailImages.first()).toBeVisible({ timeout: 30_000 });

        // Verify BOTH page thumbnails render with visible content
        const page1Percent = await getNonWhitePixelPercent(page, thumbnailImages.nth(0));
        const page2Percent = await getNonWhitePixelPercent(page, thumbnailImages.nth(1));
        console.log(`Reorder page 1 non-white pixels: ${page1Percent.toFixed(1)}%`);
        console.log(`Reorder page 2 non-white pixels: ${page2Percent.toFixed(1)}%`);

        expect(page1Percent).toBeGreaterThan(20);
        expect(page2Percent).toBeGreaterThan(20);
    });

    test('Page extraction thumbnails render visible (non-white) content', async ({ page }, testInfo) => {
        test.setTimeout(120_000);

        await page.goto('/extract', { timeout: 60_000 });

        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(getTestPdfPath(testInfo.workerIndex));

        // Wait for PageSelector thumbnails to appear
        const thumbnailCards = page.locator(
            '.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-5 > div',
        );
        await expect(thumbnailCards.first()).toBeVisible({ timeout: 30_000 });
        await expect(thumbnailCards).toHaveCount(2, { timeout: 10_000 });

        // Verify both thumbnails render with visible content
        const img1 = thumbnailCards.nth(0).locator('img').first();
        const img2 = thumbnailCards.nth(1).locator('img').first();

        const percent1 = await getNonWhitePixelPercent(page, img1);
        const percent2 = await getNonWhitePixelPercent(page, img2);
        console.log(`Extract page 1 non-white pixels: ${percent1.toFixed(1)}%`);
        console.log(`Extract page 2 non-white pixels: ${percent2.toFixed(1)}%`);

        expect(percent1).toBeGreaterThan(20);
        expect(percent2).toBeGreaterThan(20);
    });
});
