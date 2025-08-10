import { Html, useProgress } from "@react-three/drei";

export function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <>
        <style jsx>{`
          @keyframes scanline-move {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 0% 100%;
            }
          }
        `}</style>

        <div
          style={{
            position: "relative",
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            overflow: "hidden",
            padding: "2rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              color: "#00b300",
              fontSize: "2rem",
              textAlign: "center",
              fontWeight:'700',
              fontFamily: "'Press Start 2P', monospace",
              position: "relative",
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              textShadow: "0 0 2px #00b300",
            }}
          >
            threeCanvas
          </div>

          <div
            style={{
              width: "400px",
              height: "15px",
              backgroundColor: "rgba(0, 179, 0, 0.2)",
              borderRadius: "0px",
              boxShadow: "0 0 5px #00b300",
              border: "1px solid #00b300",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#00b300",
                transition: "width 0.1s ease-in-out",
                boxShadow: "0 0 8px #00b300",
              }}
            />
          </div>

          <div
            style={{
              color: "#00b300",
              fontSize: "0.7rem",
              fontFamily: "'Press Start 2P', monospace",
              marginTop: "0.5rem",
              textShadow: "0 0 2px #00b300",
            }}
          >
            LOADING ASSETS..
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 51%, rgba(0,0,0,0) 52%)",
              backgroundSize: "100% 5px",
              animation: "scanline-move 10s infinite linear",
              opacity: 0.7,
            }}
          />
        </div>
      </>
    </Html>
  );
}