"use client";

// Top-level fallback when the root layout itself errors. It replaces the whole
// document, so it ships its own <html>/<body> and uses inline styles (no token
// CSS guaranteed here).
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#06060a",
          color: "#ededf2",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#9a9aa8", marginTop: "0.75rem" }}>
            The app hit an unexpected error.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              fontSize: "0.95rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
