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
