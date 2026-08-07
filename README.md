# PDFLince (Privacy-First)

This project is a privacy-focused fork of the original [GSiesto/PDFLince](https://github.com/GSiesto/PDFLince) project.

## 🎯 Goals of this Fork

1. **Privacy First**: We have removed all third-party tracking and external asset loading. This includes the complete removal of Google Analytics (GA) integration and external Google Fonts. Everything runs locally and completely within the browser.
2. **Easy Deployment**: The application is packaged and distributed as a lightweight Docker image for seamless hosting.

## 🚀 Getting Started

You can pull and run the pre-built Docker image directly from the GitHub Container Registry (GHCR):

```bash
docker run -d -p 3000:3000 ghcr.io/valentinsviridov/pdflince:latest
```

The application will be available locally at `http://localhost:3000`.

---

## 🏗 Architecture & Onboarding Guide

Welcome to the **PDFLince** project! This document provides a comprehensive overview of the application's architecture, development tools, core dependencies, and current limitations. It is designed to quickly onboard developers, software architects, and security assessment professionals.

### 1. Global Architecture Overview

PDFLince is a **Privacy-First, Client-Side PDF Toolkit**. The primary architectural mandate is that **all PDF processing happens 100% locally within the user's browser**. No PDF data is ever transmitted to a remote server.

#### 1.1. High-Level Topology
- **Framework**: Next.js 14+ (App Router) using React 19.
- **Hosting/Deployment**: The application is built as a completely static site (`next build` -> static export into `out/`). It can be hosted on any static web server.
- **Execution Model**:
  - The UI runs on the main browser thread.
  - Heavy PDF manipulations are offloaded to **Web Workers** (`src/workers/pdf.worker.ts`) to prevent blocking the main thread and ensure a smooth user experience.
  - Fallbacks to the main thread exist for operations requiring APIs not available in workers (or in older browsers).

#### 1.2. Directory Structure
- `src/app/`: Next.js App Router structure. Contains localized routes (e.g., `(en)`, `es`, `fr`) and dynamic operation routes (`[operation]`).
- `src/components/`: Reusable React components. The core engine is housed in `src/components/pdf-processor/`.
- `src/lib/`: Core logic and utilities (`pdf-processor.ts`, `pdf-operations.ts`, `worker-client.ts`).
- `src/workers/`: Contains `pdf.worker.ts`, which executes `pdf-operations.ts` functions off the main thread.
- `src/i18n/`: Internationalization configuration and dictionaries.
- `tests/e2e/`: Playwright end-to-end tests.

---

### 2. The Application Itself & The PDF Processor Engine

The heart of the application is the `src/components/pdf-processor/index.tsx` component and its sub-components. Because it operates as a monolithic state machine orchestrating the entire PDF workflow, it is essential to understand its internal layout to easily navigate the codebase.

#### 2.1. Internal Layout of `pdf-processor/index.tsx`
This component (roughly 2,500 lines long) manages the entire lifecycle of user interaction, from file selection to processing and downloading.

**Shared State:**
- **Files & Mode**: Tracks the uploaded files (`files`), the active tool/operation (`mode` such as `merge`, `compress`, `crop`), and whether an operation is active (`isProcessing`).
- **Operation-Specific State**: Dictionaries tracking selected pages (`selectedPages`, `extractSelectionsByFile`), crop margins, rotation angles, and page order arrays.
- **Dialog & UI State**: Tracks the final success/error modal (`statusDialogState`) and real-time preview caches (`compressionPreviewStates`).

**Subcomponent Layout (Functional Modules):**
The UI renders conditionally based on the active `mode`, composing several specialized child components. The files themselves are located in the `src/components/pdf-processor/` directory alongside `index.tsx`:

- **`FileUploader` & `FileList` (Shared)**: Always present. They handle dragging/dropping files, rejecting invalid mime-types, and listing the currently staged files.
- **`PageSelector` (Shared)**: A reusable grid component for picking specific pages from a PDF. It is dynamically mounted when the mode is `extract`, `crop`, or `rotate`.
- **`UnifiedCropInterface`**: Rendered specifically when `mode === 'crop'`. It overlays crop handles on top of a PDF page preview.
- **`PageOrderer`**: Rendered when `mode === 'reorder'`. It provides a drag-and-drop interface for rearranging individual pages.
- **`ProcessingOptions` (Shared)**: A dynamically rendered form that changes its inputs based on the `mode` (e.g., showing compression level dropdowns for `compress`, or DPI inputs for `pdfToImages`).
- **`CompressionPreviewCard` & `CompressionSummaryCard`**: Specific to the `compress` mode, these components manage the real-time background estimation of file size savings.
- **`ProcessingStatusDialog` (Shared)**: The final overlay shown to the user containing the success messages and download buttons once the Web Worker completes the task.

#### 2.2. Event Flow inside `index.tsx`
1. User interacts with UI subcomponents (e.g. `UnifiedCropInterface`).
2. The subcomponent calls a state updater passed down from `index.tsx` (e.g., setting new `cropMargins`).
3. User clicks "Process". `index.tsx` delegates to `src/lib/pdf-processor.ts`.
4. `pdf-processor.ts` talks to the Web Worker via `worker-client.ts`.
5. Upon completion, `index.tsx` receives the generated `Blob`, updates `statusDialogState`, and renders the `ProcessingStatusDialog` with download links.

#### 2.3. Security & Privacy Posture
- **Zero Data Exfiltration**: There are no API endpoints for processing.
- **No External Trackers**: Google Analytics and other third-party remote tracking scripts are strictly prohibited.
- **Local Assets**: All fonts and icons are bundled locally.

---

### 3. Core Dependencies & Their Purposes

- **`pdf-lib`**: The primary engine for mutating PDFs (merging, splitting, rotating, extracting pages, generating new PDFs). It is pure JavaScript/TypeScript and runs well in Web Workers.
- **`pdfjs-dist`**: Mozilla's PDF.js library. Used primarily for parsing PDFs, rendering PDF pages to images (thumbnails for the UI), and extracting complex metadata.
- **`jszip`**: Used for bundling multiple output files (e.g., when converting a PDF to multiple Images, it packages them into a `.zip` file client-side).
- **`next`** & **`react`**: The core framework. Used strictly for static site generation and component architecture.
- **`tailwindcss`**: Utility-first CSS framework for styling.

---

### 4. Development Tools (DevX)

- **Package Manager**: **`bun`** is the mandatory package manager and script runner. Do not use `npm` or `yarn`.
- **Linting & Formatting**: `eslint` and `prettier`.
- **Testing**: **`@playwright/test`** is used for E2E testing since all PDF modifications happen client-side in the browser.
- **Verification Script**: `./scripts/verify-all.sh` must be run before finalizing any code. It runs type-checking, linting, builds, Playwright tests, and Docker builds.

---

### 5. Known Limitations & Shortbacks

- **Browser Memory Limits**: Processing massive PDFs (e.g., 500MB+) may crash the browser tab due to V8 engine memory limits.
- **Web Worker & OffscreenCanvas**: The worker utilizes `OffscreenCanvas`. If unsupported, the worker polyfills it poorly, causing a fallback to the main thread which can freeze the UI.
- **Static Export Restrictions**: Next.js features requiring a Node server (API Routes, Server Actions, Middleware) are completely unsupported due to the `next export` configuration.
- **Monolithic Component Debt**: As detailed above, `src/components/pdf-processor/index.tsx` is highly coupled. Refactoring it to use a Context Provider or a state manager (like Zustand) would significantly improve maintainability.
