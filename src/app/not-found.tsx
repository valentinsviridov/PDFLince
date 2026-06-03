import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found | PDFLince",
  description: "The page you were looking for doesn't exist. Go back to PDFLince and continue working with your PDFs.",
};

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundColor: "#fff7f5",
          color: "#2c0f0f",
          fontFamily: "'Roboto', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.5rem",
            maxWidth: "540px",
            width: "100%",
            animation: "fadeIn 0.5s ease forwards",
          }}
        >
          {/* Animated 404 number */}
          <div
            style={{
              fontSize: "clamp(7rem, 25vw, 10rem)",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              lineHeight: 1,
              background: "linear-gradient(135deg, #e34e1c 0%, #d13631 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em",
              marginBottom: "0.25rem",
              filter: "drop-shadow(0 4px 24px rgba(227,78,28,0.18))",
            }}
          >
            404
          </div>

          {/* PDF Icon */}
          <div style={{ marginBottom: "1.5rem" }}>
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e34e1c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.7 }}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="15" x2="15" y2="15" />
              <line x1="12" y1="12" x2="12" y2="18" />
            </svg>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
              color: "#2c0f0f",
              marginBottom: "0.75rem",
              lineHeight: 1.3,
            }}
          >
            This page got lost in the file system
          </h1>

          {/* Subtext */}
          <p
            style={{
              color: "#4e2525",
              fontSize: "1rem",
              lineHeight: 1.7,
              marginBottom: "2.25rem",
              maxWidth: "380px",
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Head back to PDFLince and keep working with your PDFs — completely private, no uploads needed.
          </p>

          {/* CTA Button */}
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#e34e1c",
              color: "#ffffff",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              border: "1px solid #b82c2c",
              boxShadow: "0 2px 12px rgba(227,78,28,0.25)",
              transition: "all 0.2s ease",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to PDFLince
          </Link>

          {/* Divider */}
          <div
            style={{
              marginTop: "3rem",
              borderTop: "1px solid #ffe7e5",
              paddingTop: "1.5rem",
              width: "100%",
            }}
          >
            <p style={{ color: "#4e2525", fontSize: "0.875rem", marginBottom: "1.25rem", fontWeight: 600 }}>
              All available tools
            </p>

            {/* English tools */}
            <p style={{ color: "#4e2525", fontSize: "0.75rem", marginBottom: "0.5rem", opacity: 0.7 }}>🇬🇧 English</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center", marginBottom: "1rem" }}>
              {[
                { label: "Merge PDF", href: "/en/merge" },
                { label: "Compress PDF", href: "/en/compress" },
                { label: "Split PDF", href: "/en/split" },
                { label: "Extract Pages", href: "/en/extract" },
                { label: "Reorder Pages", href: "/en/reorder" },
                { label: "Rotate PDF", href: "/en/rotate" },
                { label: "Crop PDF", href: "/en/crop" },
                { label: "PDF to Images", href: "/en/pdf-to-images" },
                { label: "Images to PDF", href: "/en/images-to-pdf" },
              ].map((tool) => (
                <a key={tool.href} href={tool.href} style={chipStyle}>{tool.label}</a>
              ))}
            </div>

            {/* Spanish tools */}
            <p style={{ color: "#4e2525", fontSize: "0.75rem", marginBottom: "0.5rem", opacity: 0.7 }}>🇪🇸 Español</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center", marginBottom: "1rem" }}>
              {[
                { label: "Unir PDF", href: "/unir" },
                { label: "Comprimir PDF", href: "/comprimir" },
                { label: "Dividir PDF", href: "/dividir" },
                { label: "Extraer páginas", href: "/extraer" },
                { label: "Reordenar páginas", href: "/reordenar" },
                { label: "Girar PDF", href: "/girar" },
                { label: "Recortar PDF", href: "/recortar" },
              ].map((tool) => (
                <a key={tool.href} href={tool.href} style={chipStyle}>{tool.label}</a>
              ))}
            </div>

            {/* Other languages */}
            <p style={{ color: "#4e2525", fontSize: "0.75rem", marginBottom: "0.5rem", opacity: 0.7 }}>More languages</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
              {[
                { label: "Deutsch", href: "/de" },
                { label: "Français", href: "/fr" },
                { label: "Italiano", href: "/it" },
                { label: "Português", href: "/pt" },
                { label: "Română", href: "/ro" },
              ].map((lang) => (
                <a key={lang.href} href={lang.href} style={chipStyle}>{lang.label}</a>
              ))}
            </div>
          </div>
        </main>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@400;500&display=swap');
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          a:hover { opacity: 0.75; }
        `}</style>
      </body>
    </html>
  );
}

const chipStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  color: "#e34e1c",
  textDecoration: "none",
  padding: "0.28rem 0.7rem",
  borderRadius: "999px",
  border: "1px solid #ffe7e5",
  backgroundColor: "#fff0ee",
  fontWeight: 500,
};
