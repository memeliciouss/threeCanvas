"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      {/* Toggle button - now fixed outside the navbar */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: open ? "225px" : "5px",
          top: "20px",
          background: "rgba(30, 30, 30, 0.5)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "4px 0 0 4px",
          padding: "0.4rem 0.5rem",
          cursor: "pointer",
          transition: "right 0.4s ease",
          zIndex: 30,
        }}
      >
        {!open ? "❮" : "❯"}
      </button>

      {/* Navbar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-220px",
          height: "100vh",
          width: "220px",
          background: "rgba(20, 20, 20, 0.3)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          transition: "right 0.4s ease",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1.5rem",
          fontFamily: "Palatino Linotype",
          zIndex: 20,
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Radial gradient effect */}
        {isHovering && (
          <div
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: "500px",
              height: "500px",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%)",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "white",
            display: "flex",
            gap: "5px",
          }}
        >
          <img src="icon.ico" style={{ height: "25px", width: "auto" }} />
          <h3
            href="/"
            style={{
              marginBottom: "1rem",
              fontWeight: "600",
              fontSize: "1.1rem",
              opacity: 0.85,
              position: "relative",
              zIndex: 2,
              marginBottom: "2rem",
            }}
          >
            threeCanvas
          </h3>
        </a>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            position: "relative",
            zIndex: 2,
          }}
        >
          <StyledLink href="/sketchbook" label="Sketchbook" />
          <StyledLink href="/starry" label="Ghost Ship" />
          <StyledLink href="/orbs" label="Orbs?" />
          <StyledLink href="/weepingangels" label="Weeping Angels" />
        </nav>
      </div>
    </>
  );
}

function StyledLink({ href, label }) {
  return (
    <a
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          color: "white",
          fontStyle: "normal",
          padding: "0.4rem 0.5rem",
          borderRadius: "6px",
          fontSize: "0.95rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        {label}
      </div>
    </a>
  );
}
