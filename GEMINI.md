# Instructions for AI Assistants (Gemini)

## 📖 Project Context
**CRITICAL**: Before performing any complex task or modifying the codebase, you MUST read the `README.md` file to understand the global architecture, the monolithic `pdf-processor` layout, and the overall project organization.


## 🏗️ Development Best Practices
When contributing to this project, adhere to the following best practices for our tech stack:
- **Bun**: Use `bun` for all package management (`bun install`) and script execution (`bun run`). Do not use `npm` or `yarn`.
- **Next.js & React**: We use Next.js with the App Router. Ensure components are cleanly separated between Server and Client.
- **TypeScript**: Write strict TypeScript. Avoid using `any` and ensure all interfaces and types are properly defined.
- **Tailwind CSS**: Use Tailwind utility classes for all styling. Avoid custom CSS files unless absolutely necessary.
- **Testing**: Maintain and update Playwright E2E tests (`tests/e2e/`) when adding or modifying features.

## 🔒 Privacy-First Mandate
**CRITICAL**: The final result of any feature or modification must be **privacy-first**.
- Do **not** add any external tracking scripts (e.g., Google Analytics, trackers).
- Do **not** load remote assets (e.g., Google Fonts, external CDNs). All assets must be bundled locally.
- Do **not** send user PDF data to any remote servers. All PDF manipulation and processing must remain 100% local and executed entirely client-side within the browser.

## ✅ Verification
**MANDATORY**: When modifying the codebase, you MUST run the comprehensive verification script before concluding your work:

```bash
./scripts/verify-all.sh
```

This script is crucial because it will run:
1. Linting and TypeScript type checking
2. Next.js application build
3. Playwright E2E Tests
4. Docker image build

If any of these steps fail, address the issues before finalizing your task. This ensures the codebase remains robust and ready for deployment.
