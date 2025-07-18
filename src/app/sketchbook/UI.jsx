import { atom, useAtom } from "jotai";

const pictures = [
  "1", "2", "3", "4", "5", "6",
  "7", "8", "9", "10",
];

export const pageAtom = atom(0);
export const pages = [
  { front: "cover", back: pictures[0] },
];

for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "cover",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  return (
    <>
      <main
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 10,
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
       <div style={{marginTop:'2rem',marginLeft:'2rem'}}>sketchbook</div>

        <div
          style={{
            width: '100%',
            overflow: 'auto',
            pointerEvents: 'auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              overflow: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '100%',
              padding: '2.5rem',
            }}
          >
            {[...pages].map((_, index) => {
              const isActive = index === page;
              return (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '1.125rem',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                    border: '1px solid',
                    borderColor: isActive ? 'transparent' : 'transparent',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.3)',
                    color: isActive ? 'black' : 'white',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'white'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  {index === 0 ? "Cover" : `Page ${index}`}
                </button>
              );
            })}
            <button
              onClick={() => setPage(pages.length)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '9999px',
                fontSize: '1.125rem',
                textTransform: 'uppercase',
                flexShrink: 0,
                border: '1px solid',
                borderColor: 'transparent',
                backgroundColor: page === pages.length ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.3)',
                color: page === pages.length ? 'black' : 'white',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
            >
              Back Cover
            </button>
          </div>
        </div>
      </main>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          transform: 'rotate(-2deg)',
          userSelect: 'none',
        }}
      >
        {/* <div style={{ position: 'relative' }}>
          <div
            className="animate-horizontal-scroll"
            style={{
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              width: 'max-content',
              padding: '0 2rem',
            }}
          >
            <h1 className="text-10xl font-black" style={headingStyle}>Wawa Sensei</h1>
            <h2 className="text-8xl font-light italic" style={headingStyle}>React Three Fiber</h2>
            <h2 className="text-12xl font-bold" style={headingStyle}>Three.js</h2>
            <h2 className="text-12xl font-bold italic text-transparent outline-text" style={headingStyle}>Ultimate Guide</h2>
            <h2 className="text-9xl font-medium" style={headingStyle}>Tutorials</h2>
            <h2 className="text-9xl font-extralight italic" style={headingStyle}>Learn</h2>
            <h2 className="text-13xl font-bold" style={headingStyle}>Practice</h2>
            <h2 className="text-13xl font-bold italic text-transparent outline-text" style={headingStyle}>Creative</h2>
          </div>

          <div
            className="animate-horizontal-scroll-2"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              padding: '0 2rem',
              width: 'max-content',
            }}
          >
            <h1 className="text-10xl font-black" style={headingStyle}>Wawa Sensei</h1>
            <h2 className="text-8xl font-light italic" style={headingStyle}>React Three Fiber</h2>
            <h2 className="text-12xl font-bold" style={headingStyle}>Three.js</h2>
            <h2 className="text-12xl font-bold italic text-transparent outline-text" style={headingStyle}>Ultimate Guide</h2>
            <h2 className="text-9xl font-medium" style={headingStyle}>Tutorials</h2>
            <h2 className="text-9xl font-extralight italic" style={headingStyle}>Learn</h2>
            <h2 className="text-13xl font-bold" style={headingStyle}>Practice</h2>
            <h2 className="text-13xl font-bold italic text-transparent outline-text" style={headingStyle}>Creative</h2>
          </div>
        </div> */}
      </div>
    </>
  );
};

// Shared heading style (customize font sizes via external CSS classNames if needed)
const headingStyle = {
  flexShrink: 0,
  color: 'white',
};
