import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface WaffleMatrixProps {
  totalDots?: number;
  columns?: number;
  activeCount?: number;
  dotSize?: number;
  gap?: number;
  title?: string;
  subtitle?: string;
  badge?: string;
  activeColor?: string;
  inactiveColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  durationInFrames?: number;
  startFrame?: number;
}

export const WaffleMatrix: React.FC<WaffleMatrixProps> = ({
  totalDots = 314,
  columns = 20,
  activeCount = 314,
  dotSize = 14,
  gap = 8,
  title = "Corporate Headquarters Relocated",
  subtitle = "Representing $2.8 Trillion in Combined Revenue",
  badge = "Institutional Migration",
  activeColor = "#0E382B",
  inactiveColor = "rgba(14, 56, 43, 0.15)",
  accentColor = "#C59B27",
  backgroundColor = "#F4F1EA",
  textColor = "#1B1B1B",
  fontFamily = "Cinzel, Playfair Display, Georgia, serif",
  durationInFrames = 48,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress with Niko Ludwig deceleration curve (0.12, 0.82, 0.18, 1.0)
  const elapsed = Math.max(0, Math.min(1, (frame - startFrame) / durationInFrames));
  const easeProgress = 1 - Math.pow(1 - elapsed, 3.8);

  const currentCount = Math.round(activeCount * easeProgress);

  // Overall container entrance
  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 100, mass: 1 },
  });

  const rows = Math.ceil(totalDots / columns);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${interpolate(entrance, [0, 1], [0.94, 1])})`,
          opacity: entrance,
          maxWidth: 960,
        }}
      >
        {/* Badge */}
        {badge && (
          <div
            style={{
              padding: "6px 18px",
              borderRadius: 999,
              backgroundColor: "rgba(197, 155, 39, 0.15)",
              color: accentColor,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: `1px solid ${accentColor}50`,
              marginBottom: 16,
            }}
          >
            {badge}
          </div>
        )}

        {/* Counter and Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              color: activeColor,
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {currentCount}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: textColor,
              fontFamily,
              marginTop: 10,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 18,
                color: "rgba(27, 27, 27, 0.65)",
                fontFamily: "Inter, sans-serif",
                marginTop: 8,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* The Waffle Grid Matrix */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, ${dotSize}px)`,
            gap,
            padding: 24,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(14, 56, 43, 0.08)",
            border: "1px solid rgba(14, 56, 43, 0.1)",
          }}
        >
          {Array.from({ length: totalDots }).map((_, index) => {
            const isFilled = index < currentCount;
            const isJustFilled = index === currentCount - 1 && currentCount > 0;

            return (
              <div
                key={index}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  backgroundColor: isFilled ? activeColor : inactiveColor,
                  transform: isJustFilled ? "scale(1.4)" : "scale(1)",
                  transition: "background-color 80ms, transform 120ms",
                  boxShadow: isJustFilled ? `0 0 8px ${accentColor}` : "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
