import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ProportionGaugeProps {
  percentage: number;
  label?: string;
  baselineLabel?: string;
  title?: string;
  subtitle?: string;
  accentColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  cardColor?: string;
  textColor?: string;
  fontFamily?: string;
  durationInFrames?: number;
  startFrame?: number;
}

export const ProportionGauge: React.FC<ProportionGaugeProps> = ({
  percentage = 70,
  label = "Residential Real Estate",
  baselineLabel = "Stocks, Pensions & Cash (30%)",
  title = "Household Wealth Allocation",
  subtitle = "Extreme asset overexposure vs 30% international norm",
  accentColor = "#F59E0B",
  secondaryColor = "#334155",
  backgroundColor = "#131B2A",
  cardColor = "#1E293B",
  textColor = "#F8FAFC",
  fontFamily = "Inter, system-ui, sans-serif",
  durationInFrames = 42,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // PolyMatter OutExpo deceleration: cubic-bezier(0.16, 1.0, 0.3, 1.0)
  const elapsed = Math.max(0, Math.min(1, (frame - startFrame) / durationInFrames));
  const easeT = 1 - Math.pow(1 - elapsed, 4.5);

  const currentPercent = Math.round(percentage * easeT);

  // SVG Geometry
  const radius = 100;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (circumference * (percentage * easeT)) / 100;

  const cardEntrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

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
          maxWidth: 880,
          backgroundColor: cardColor,
          borderRadius: 16,
          padding: 48,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          transform: `scale(${interpolate(cardEntrance, [0, 1], [0.94, 1])})`,
          opacity: cardEntrance,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: textColor,
              fontFamily,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 18,
                color: "#94A3B8",
                fontFamily,
                marginTop: 6,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Gauge & Key Stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 56,
          }}
        >
          {/* Circular SVG Gauge */}
          <div style={{ position: "relative", width: 240, height: 240 }}>
            <svg width={240} height={240} viewBox="0 0 240 240">
              {/* Background Ring */}
              <circle
                cx={120}
                cy={120}
                r={radius}
                fill="none"
                stroke={secondaryColor}
                strokeWidth={strokeWidth}
              />
              {/* Animated Progress Ring */}
              <circle
                cx={120}
                cy={120}
                r={radius}
                fill="none"
                stroke={accentColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={targetOffset}
                strokeLinecap="round"
                transform="rotate(-90 120 120)"
              />
            </svg>
            {/* Centered Percentage Counter */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontWeight: 800,
                fontSize: 54,
                color: textColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {currentPercent}%
            </div>
          </div>

          {/* Allocation Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Active Allocation Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: accentColor,
                }}
              />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: textColor, fontFamily }}>
                  {label} ({currentPercent}%)
                </div>
                <div style={{ fontSize: 14, color: "#94A3B8", fontFamily }}>
                  Primary household balance sheet driver
                </div>
              </div>
            </div>

            {/* Baseline Allocation */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: 0.7,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: secondaryColor,
                }}
              />
              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: "#CBD5E1", fontFamily }}>
                  {baselineLabel}
                </div>
                <div style={{ fontSize: 13, color: "#64748B", fontFamily }}>
                  Liquid assets & capital markets
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
