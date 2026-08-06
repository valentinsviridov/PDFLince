import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFile = path.join(__dirname, 'crop-test.pdf');

test.beforeAll(async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    page.drawText('Crop Test Page', {
        x: 40,
        y: 540,
        size: 20,
    });

    fs.writeFileSync(testFile, await pdfDoc.save());
});

test.afterAll(() => {
    if (fs.existsSync(testFile)) {
        try {
            fs.unlinkSync(testFile);
        } catch (e) { }
    }
});

test('PDF Manual Crop Workflow', async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto('/crop', { timeout: 60_000 });

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    const thumbnailCards = page.locator('.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-5 > div');
    await expect(thumbnailCards.first()).toBeVisible({ timeout: 20_000 });
    await thumbnailCards.first().click();

    await expect(page.getByRole('heading', { name: 'Crop', exact: true })).toBeVisible({ timeout: 30_000 });

    const manualPreview = page.locator('div.touch-none.select-none').last();
    await expect(manualPreview).toBeVisible({ timeout: 30_000 });

    const bounds = await manualPreview.boundingBox();
    expect(bounds).not.toBeNull();

    if (!bounds) {
        throw new Error('Manual crop preview bounds were not available');
    }

    await page.mouse.move(bounds.x + bounds.width * 0.25, bounds.y + bounds.height * 0.25);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width * 0.75, bounds.y + bounds.height * 0.75, { steps: 12 });
    await page.mouse.up();

    const processButton = page.getByRole('button', { name: /^Crop \d+ page/ });
    await expect(processButton).toBeEnabled({ timeout: 20_000 });

    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
    await processButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/cropped_PDFLince\.pdf$/);

    const downloadPath = path.join(__dirname, 'downloaded-cropped.pdf');
    await download.saveAs(downloadPath);

    const pdfBuffer = fs.readFileSync(downloadPath);
    const croppedPdf = await PDFDocument.load(pdfBuffer);
    const croppedPage = croppedPdf.getPage(0);
    const mediaBox = croppedPage.getMediaBox();

    expect(croppedPdf.getPageCount()).toBe(1);
    expect(mediaBox.width).toBeLessThan(400);
    expect(mediaBox.width).toBeGreaterThan(250);
    expect(mediaBox.height).toBeLessThan(600);
    expect(mediaBox.height).toBeGreaterThan(350);

    fs.unlinkSync(downloadPath);
});

test('PDF Crop Workflow on Corrupt PDF', async ({ page }) => {
    test.setTimeout(90_000);
    const corruptPdfPath = path.join(__dirname, 'fixtures', 'cg-brsvie.pdf');

    await page.goto('/crop', { timeout: 60_000 });

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(corruptPdfPath);

    // Wait for file parsing to complete (this tests that our custom traversal unblocks the UI)
    const firstThumbnail = page.locator('.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-5 > div').first();
    await expect(firstThumbnail).toBeVisible({ timeout: 20_000 });
    
    // Select first page
    await firstThumbnail.click();
    await expect(page.getByRole('heading', { name: 'Crop', exact: true })).toBeVisible({ timeout: 30_000 });

    // Enter crop margin
    const topInput = page.locator('input#crop-top');
    await topInput.fill('10');
    
    const processButton = page.getByRole('button', { name: /^Crop \d+ page/ });
    await expect(processButton).toBeEnabled({ timeout: 20_000 });

    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
    await processButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/cropped_PDFLince\.pdf$/);

    const downloadPath = path.join(__dirname, 'downloaded-corrupt-cropped.pdf');
    await download.saveAs(downloadPath);

    const croppedSize = fs.statSync(downloadPath).size;
    expect(croppedSize).toBeGreaterThan(0);

    // Verify the output PDF is no longer corrupt by loading it and reading the page count
    const pdfBuffer = fs.readFileSync(downloadPath);
    const croppedPdf = await PDFDocument.load(pdfBuffer, { throwOnInvalidObject: true });
    expect(croppedPdf.getPageCount()).toBeGreaterThan(0);

    fs.unlinkSync(downloadPath);
});
