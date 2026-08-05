#!/bin/bash
set -e

echo "🚀 Starting full verification suite..."

echo "📦 Installing dependencies..."
bun install

echo "🧹 Running linting..."
bun run lint

echo "🔎 Running type check..."
bunx tsc --noEmit

echo "🏗️ Building Next.js app..."
bun run build

echo "🎭 Running E2E tests..."
bun run test:e2e

echo "🐳 Building Docker image..."
docker build -t pdflince:local .

echo "✅ All checks passed successfully! The application is ready."
