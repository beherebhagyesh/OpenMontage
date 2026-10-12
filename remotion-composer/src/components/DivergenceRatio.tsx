import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface DivergenceRatioProps {
  title?: string;
  subtitle?: string;
  baselineYear?: string;
  baselineMultiplier?: number;
  currentYear?: string;
  currentMultiplier?: number;
  highlighterNotice?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  fontFamily?: string;
  durationInFrames?: number;
  startFrame?: number;
}

export const DivergenceRatio: React.FC<DivergenceRatioProps> = ({
  title = "Median Home Price to Income Multiple",
  subtitle = "The Scissor of Real Asset Inflation",
  baselineYear = "1955",
  baselineMultiplier = 2.6,
  currentYear = "2025",
  currentMultiplier = 6.5,
  highlighterNotice = "MATHEMATICALLY DETACHED FROM WAGES",
  backgroundColor = "#EFECE6",
  textColor = "#222222",
  accentColor = "#C62828",
  fontFamily = "Courier Prime, JetBrains Mono, monospace",
  durationInFrames = 42,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Johnny Harris rapid launch + long settle
  const elapsed = Math.max(0, Math.min(1, (frame - startFrame) / durationInFrames));
  let easeT = elapsed;
  if (elapsed < 0.22) {
    easeT = (elapsed / 0.22) * 0.7;
  } else {
    const sub = (elapsed - 0.22) / 0.78;
    easeT = 0.7 + (1 - Math.pow(1 - sub, 2.5)) * 0.3;
  }

  const rollingMultiple = (baselineMultiplier + (currentMultiplier - baselineMultiplier) * easeT).toFixed(1);

  // Caliper expansion height
  const caliperProgress = spring({
    frame: frame - (startFrame + 10),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Animated highlighter sweep
  const highlighterSweep = interpolate(
    frame - (startFrame + 25),
    [0, 18],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
          width: "100%",
          maxWidth: 920,
          backgroundColor: "#F7F5F0",
          borderRadius: 12,
          padding: 48,
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          position: "relative",
        }}
      >
        {/* Title Block */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: textColor,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 18,
              color: "rgba(34, 34, 34, 0.65)",
              fontFamily: "Inter, sans-serif",
              marginTop: 6,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Dual Pillar Comparison */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 32,
            alignItems: "center",
          }}
        >
          {/* Baseline Card (1955) */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: 8,
              padding: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "rgba(34, 34, 34, 0.6)",
                fontFamily,
                textTransform: "uppercase",
              }}
            >
              {baselineYear} Baseline
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: "#1A7A4C",
                fontFamily,
                marginTop: 8,
              }}
            >
              {baselineMultiplier}x
            </div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
              of Median Annual Income
            </div>
          </div>

          {/* Divergence Caliper Arrow */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `scaleY(${caliperProgress})`,
            }}
          >
            <div
              style={{
                color: accentColor,
                fontSize: 28,
                fontWeight: 900,
                fontFamily,
              }}
            >
              ➔ +{(currentMultiplier - baselineMultiplier).toFixed(1)}x
            </div>
            <div
              style={{
                height: 2,
                width: 120,
                backgroundColor: accentColor,
                marginTop: 4,
              }}
            />
          </div>

          {/* Modern Card (2025) */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${accentColor}40`,
              borderRadius: 8,
              padding: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: accentColor,
                fontFamily,
                textTransform: "uppercase",
              }}
            >
              {currentYear} Current
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: accentColor,
                fontFamily,
                marginTop: 8,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {rollingMultiple}x
            </div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
              of Median Annual Income
            </div>
          </div>
        </div>

        {/* Johnny Harris Fluorescent Highlighter Notice */}
        {highlighterNotice && (
          <div
            style={{
              marginTop: 36,
              textAlign: "center",
              position: "relative",
              display: "inline-block",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: 2,
                fontFamily,
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "0.08em",
                color: "#1A1A1A",
                padding: "4px 12px",
              }}
            >
              {highlighterNotice}
            </span>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: `${highlighterSweep}%`,
                backgroundColor: "#FFE600",
                zIndex: 1,
                mixBlendMode: "multiply",
                borderRadius: 2,
              }}
            />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
