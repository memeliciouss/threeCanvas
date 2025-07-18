import { atom, useAtom } from "jotai";

const pictures = [
  "play",
  "adventure",
  "movie",
  "obsession",
  "skullstar",
  "milesMoralLess",
  "reddead",
  "red",
  "quest",
  "exact",
  "martini",
  "blackwidow",
  "spooky",
  "context",
  "w1",
  "w2",
  "w3",
  "w4",
  "crt",
  "ghosts",
  "fang",
  "batman",
  "catos",
  "horse",
  "look",
  "tranquil",
];
export const pageAtom = atom(0);

export const pages = [{ front: "transit", back: pictures[0] }];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i],
    back: pictures[i + 1],
  });
}
pages.push({ front: pictures[pictures.length - 1], back: "fossil" });

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  return (
    <>
      {/* Fixed Button Bar */}
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setPage(0)}
          title="Front Cover"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#AFAFAF",
            transition: "transform 0.2s ease, filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.5)";
            e.currentTarget.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 6v12M18 6l-6 6l6 6"
            />
          </svg>
        </button>

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          title="Previous Page"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#AFAFAF",
            transition: "transform 0.2s ease, filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.5)";
            e.currentTarget.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m15 6l-6 6l6 6"
            />
          </svg>
        </button>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, pages.length))}
          title="Next Page"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#AFAFAF",
            transition: "transform 0.2s ease, filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.5)";
            e.currentTarget.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m9 6l6 6l-6 6"
            />
          </svg>
        </button>

        <button
          onClick={() => setPage(pages.length)}
          title="Back Cover"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#AFAFAF",
            transition: "transform 0.2s ease, filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.5)";
            e.currentTarget.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m6 6l6 6l-6 6M17 5v13"
            />
          </svg>
        </button>
      </div>
    </>
  );
};
