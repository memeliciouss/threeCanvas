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
          right: open ? "255px" : "5px",
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
          right: open ? 0 : "-250px",
          height: "100vh",
          width: "250px",
          background: "rgba(20, 20, 20, 0.3)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          transition: "right 0.4s ease",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1.5rem",
          fontFamily: "Segoe UI",
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
            flexGrow: 1,
          }}
        >
          <StyledLink href="/sketchbook" label="Sketchbook" />
          <StyledLink href="/starry" label="Ghost Ship" />
          <StyledLink href="/orbs" label="Orbs?" />
          <StyledLink href="/weepingangels" label="Weeping Angels" />
        </nav>
        <div
          style={{
            fontSize: "0.9rem",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            position: "relative",
            zIndex: 2,
            marginTop: "auto",
          }}
        >
          <a
            href="https://memelicious-viewport.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4"
                />
              </svg>
              My Corner
            </div>
          </a>
          <a
            href="https://www.github.com/memeliciouss/threeCanvas"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M7.976 0A7.977 7.977 0 0 0 0 7.976c0 3.522 2.3 6.507 5.431 7.584c.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076c-.343-.93-.881-1.175-.881-1.175c-.734-.489.048-.489.048-.489c.783.049 1.224.832 1.224.832c.734 1.223 1.859.88 2.3.685c.048-.538.293-.88.489-1.076c-1.762-.196-3.621-.881-3.621-3.964c0-.88.293-1.566.832-2.153c-.05-.147-.343-.978.098-2.055c0 0 .685-.196 2.201.832c.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832c.44 1.077.146 1.908.097 2.104a3.16 3.16 0 0 1 .832 2.153c0 3.083-1.86 3.719-3.62 3.915c.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.98 7.98 0 0 0 16 7.976C15.951 3.572 12.38 0 7.976 0"
                />
              </svg>
              Github
            </div>
          </a>
        </div>
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
