"use client";

export function RetroGrid({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className || ""}`}>
      {/* Perspective container */}
      <div
        className="absolute inset-0"
        style={{
          perspective: "600px",
          perspectiveOrigin: "center top",
        }}
      >
        {/* Grid container with 3D rotation */}
        <div
          className="absolute inset-0"
          style={{
            transform: "rotateX(65deg)",
            transformOrigin: "center top",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Animated grid background */}
          <div
            className="absolute w-[300%] h-[300%] -left-[100%] top-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: "gridMove 6s linear infinite",
              willChange: "transform",
            }}
          />
        </div>
      </div>

      {/* Black background overlay */}
      <div className="absolute inset-0 bg-black pointer-events-none" />

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translateY(0) translateZ(0);
          }
          100% {
            transform: translateY(50px) translateZ(0);
          }
        }
      `}</style>
    </div>
  );
}
